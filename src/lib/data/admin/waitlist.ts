import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'

export type WaitlistEntry = Tables<'waitlist'>

// the current cohort first, then any others, each with its entries
export async function listWaitlist() {
  const supabase = await createClient()
  const [{ data: settings }, { data: rows }] = await Promise.all([
    supabase.from('settings').select('current_cohort').eq('id', 1).single(),
    supabase.from('waitlist').select('*').order('created_at', { ascending: false }),
  ])

  const current = settings?.current_cohort ?? ''
  const byCohort = new Map<string, WaitlistEntry[]>()
  for (const row of rows ?? []) {
    const list = byCohort.get(row.cohort) ?? []
    list.push(row)
    byCohort.set(row.cohort, list)
  }

  const cohorts = [...byCohort.keys()].sort((a, b) => {
    if (a === current) return -1
    if (b === current) return 1
    return b.localeCompare(a)
  })

  return { current, groups: cohorts.map((cohort) => ({ cohort, entries: byCohort.get(cohort)! })), total: rows?.length ?? 0 }
}

export async function exportWaitlist(cohort: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('waitlist')
    .select('*')
    .eq('cohort', cohort)
    .order('created_at', { ascending: true })
  return data ?? []
}
