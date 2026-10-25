import { z } from 'zod'
import { institutions } from '@/lib/config/application'
import { Constants } from '@/lib/supabase/types'

/*
  the applications list keeps every filter in the URL, so a view can be bookmarked or shared and the CSV export
  sees exactly the same set. shared by the filter bar (client) and the query (server). a bad value is dropped,
  never an error.
*/

export type SearchParams = Record<string, string | string[] | undefined>

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const fields = {
  q: z.string().trim().min(1).max(100),
  status: z.enum(Constants.public.Enums.application_status),
  committed: z.enum(['yes', 'no']),
  region: z.enum(Constants.public.Enums.region),
  programme: z.enum(Constants.public.Enums.programme),
  institution: z.enum(institutions),
  // empty means the current cohort; 'all' means every cohort
  cohort: z.string().trim().min(1).max(20),
  from: isoDate,
  to: isoDate,
  page: z.coerce.number().int().min(1).max(1000),
}

type Fields = typeof fields
export type ApplicationFilters = { [K in keyof Fields]?: z.output<Fields[K]> }
export type FilterKey = keyof ApplicationFilters

export const filterKeys = Object.keys(fields) as FilterKey[]

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export function parseFilters(params: SearchParams): ApplicationFilters {
  const filters: Record<string, unknown> = {}
  for (const key of filterKeys) {
    const parsed = fields[key].safeParse(first(params[key]))
    if (parsed.success) filters[key] = parsed.data
  }
  return filters as ApplicationFilters
}

// the filters as a query string, without the leading "?"; page 1 is left out
export function filtersToQuery(filters: ApplicationFilters, overrides: ApplicationFilters = {}) {
  const merged = { ...filters, ...overrides }
  const params = new URLSearchParams()
  for (const key of filterKeys) {
    const value = merged[key]
    if (value === undefined || value === '' || (key === 'page' && value === 1)) continue
    params.set(key, String(value))
  }
  return params.toString()
}

// filters that narrow the set (page and cohort do not count), for the "Filters (2)" label
export function activeFilterCount(filters: ApplicationFilters) {
  return filterKeys.filter((k) => k !== 'page' && k !== 'cohort' && filters[k] !== undefined).length
}
