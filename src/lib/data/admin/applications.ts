import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'
import type { ApplicationFilters } from '@/lib/validation/admin/application-filters'

export const pageSize = 50

export type ApplicationRow = Tables<'applications'>
export type ApplicationListItem = Pick<
  ApplicationRow,
  | 'id'
  | 'reference'
  | 'full_name'
  | 'email'
  | 'programme'
  | 'programme_other'
  | 'institution'
  | 'institution_other'
  | 'level'
  | 'current_region'
  | 'committed'
  | 'status'
  | 'created_at'
>

const listColumns =
  'id, reference, full_name, email, programme, programme_other, institution, institution_other, level, current_region, committed, status, created_at'

// the structural slice of a postgrest builder that the filters need
type Filterable = {
  eq(column: string, value: string | number | boolean): Filterable
  or(filters: string): Filterable
  gte(column: string, value: string): Filterable
  lt(column: string, value: string): Filterable
}

// postgrest's or() syntax treats these as separators, so they never reach it from the search box
const cleanSearch = (q: string) => q.replace(/[,()*%\\"':.]/g, ' ').replace(/\s+/g, ' ').trim()

function nextDay(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString()
}

// Ghana is on GMT all year, so a calendar day in Accra is the same UTC day
function applyFilters<Q extends Filterable>(query: Q, f: ApplicationFilters, cohort: string | null): Q {
  let q: Filterable = query
  if (cohort) q = q.eq('cohort', cohort)
  if (f.status) q = q.eq('status', f.status)
  if (f.committed) q = q.eq('committed', f.committed === 'yes')
  if (f.region) q = q.eq('current_region', f.region)
  if (f.programme) q = q.eq('programme', f.programme)
  if (f.institution) q = q.eq('institution', f.institution)
  if (f.from) q = q.gte('created_at', `${f.from}T00:00:00Z`)
  if (f.to) q = q.lt('created_at', nextDay(f.to))
  if (f.q) {
    const term = cleanSearch(f.q)
    if (term) {
      q = q.or(
        ['full_name', 'email', 'reference', 'student_id'].map((col) => `${col}.ilike.*${term}*`).join(','),
      )
    }
  }
  return q as Q
}

// the cohort a list shows: the one in the URL, every cohort for 'all', otherwise the current one from settings
export async function resolveCohort(f: ApplicationFilters) {
  if (f.cohort === 'all') return null
  if (f.cohort) return f.cohort
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('current_cohort').eq('id', 1).single()
  return data?.current_cohort ?? null
}

export async function listCohorts() {
  const supabase = await createClient()
  const [{ data: settings }, { data: rows }] = await Promise.all([
    supabase.from('settings').select('current_cohort').eq('id', 1).single(),
    supabase.from('applications').select('cohort').order('cohort', { ascending: false }).limit(1000),
  ])
  const cohorts = new Set<string>(rows?.map((r) => r.cohort) ?? [])
  if (settings?.current_cohort) cohorts.add(settings.current_cohort)
  return { current: settings?.current_cohort ?? '', all: [...cohorts].sort().reverse() }
}

export async function listApplications(f: ApplicationFilters) {
  const supabase = await createClient()
  const cohort = await resolveCohort(f)
  const page = f.page ?? 1
  const start = (page - 1) * pageSize

  const { data, count, error } = await applyFilters(
    supabase.from('applications').select(listColumns, { count: 'exact' }),
    f,
    cohort,
  )
    .order('created_at', { ascending: false })
    .range(start, start + pageSize - 1)

  if (error) throw new Error(`applications list failed: ${error.message}`)
  return { rows: (data ?? []) as ApplicationListItem[], total: count ?? 0, page, cohort }
}

export async function getApplication(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('applications').select('*').eq('id', id).maybeSingle()
  return data
}

// previous and next in the filtered list, so a reviewer can work through it without going back
export async function neighbours(id: string, f: ApplicationFilters) {
  const supabase = await createClient()
  const cohort = await resolveCohort(f)
  const { data } = await applyFilters(supabase.from('applications').select('id'), f, cohort)
    .order('created_at', { ascending: false })
    .limit(2000)

  const ids = data?.map((r) => r.id) ?? []
  const index = ids.indexOf(id)
  if (index === -1) return { previous: null, next: null, position: null, total: ids.length }
  return {
    previous: ids[index - 1] ?? null,
    next: ids[index + 1] ?? null,
    position: index + 1,
    total: ids.length,
  }
}

// every matching row for the CSV, read in batches because the api returns at most 1000 rows at a time
export async function exportApplications(f: ApplicationFilters) {
  const supabase = await createClient()
  const cohort = await resolveCohort(f)
  const batch = 1000
  const rows: ApplicationRow[] = []

  for (let start = 0; ; start += batch) {
    const { data, error } = await applyFilters(supabase.from('applications').select('*'), f, cohort)
      .order('created_at', { ascending: true })
      .range(start, start + batch - 1)
    if (error) throw new Error(`applications export failed: ${error.message}`)
    rows.push(...(data ?? []))
    if (!data || data.length < batch) break
  }

  return { rows, cohort }
}

export async function countNewApplications() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'submitted')
  return count ?? 0
}
