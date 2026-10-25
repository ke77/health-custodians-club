import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'

export type RegionRow = Tables<'regions'>

// all 16 region rows (they are seeded by the migration), in a stable order
export async function listRegions(): Promise<RegionRow[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('regions').select('*').order('region', { ascending: true })
  return data ?? []
}
