import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'

export type Inquiry = Tables<'inquiries'>
export type InquiryFilter = 'new' | 'handled' | 'all'

export async function listInquiries(filter: InquiryFilter) {
  const supabase = await createClient()
  let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false })
  if (filter !== 'all') query = query.eq('status', filter)
  const { data } = await query
  return data ?? []
}

export async function countNewInquiries() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')
  return count ?? 0
}
