import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'

export type Person = Tables<'people'>

export async function listPeople(): Promise<Person[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('people')
    .select('*')
    .order('type', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}
