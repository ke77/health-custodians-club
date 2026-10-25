import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { mediaPublicUrl } from '@/lib/supabase/media'
import { createPublicClient } from '@/lib/supabase/public'

export const partnersTag = 'partners'

export type PublicPartner = { id: string; name: string; url: string | null; logoUrl: string | null }

// published partners in display order. an empty list keeps /partners on its editorial empty state
export async function getPartners(): Promise<PublicPartner[]> {
  'use cache'
  cacheTag(partnersTag)
  cacheLife('max')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('partners')
    .select('id, name, url, logo_path, sort_order')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    url: p.url,
    logoUrl: p.logo_path ? mediaPublicUrl(p.logo_path) : null,
  }))
}
