import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'

export type Partner = Tables<'partners'>

export async function listPartners(): Promise<Partner[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}
