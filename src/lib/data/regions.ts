import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { mediaPublicUrl } from '@/lib/supabase/media'
import { createPublicClient } from '@/lib/supabase/public'
import { regions as regionConfig } from '@/lib/config/regions'
import type { Region } from '@/lib/config/regions'

export const regionsTag = 'regions'

export type RegionalHead = { region: string; name: string; institution: string | null; photoUrl: string | null }

// the map regions: coordinates from config, `present` from the database's active flag
export async function getRegions(): Promise<Region[]> {
  'use cache'
  cacheTag(regionsTag)
  cacheLife('max')

  const supabase = createPublicClient()
  const { data } = await supabase.from('regions').select('region, active')
  const activeByName = new Map<string, boolean>((data ?? []).map((r) => [r.region, r.active]))

  // fall back to the config's `present` if a row is somehow missing, so the map never empties
  return regionConfig.map((r) => ({ ...r, present: activeByName.get(r.name) ?? r.present }))
}

// published regional heads, in region order, for the About list (empty when none are published)
export async function getRegionalHeads(): Promise<RegionalHead[]> {
  'use cache'
  cacheTag(regionsTag)
  cacheLife('max')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('regions')
    .select('region, head_name, head_institution, head_photo_path, head_published')
    .eq('head_published', true)
    .not('head_name', 'is', null)
    .order('region', { ascending: true })

  return (data ?? [])
    .filter((r) => r.head_name)
    .map((r) => ({
      region: r.region,
      name: r.head_name as string,
      institution: r.head_institution,
      photoUrl: r.head_photo_path ? mediaPublicUrl(r.head_photo_path) : null,
    }))
}
