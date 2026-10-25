import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { mediaPublicUrl } from '@/lib/supabase/media'
import { createPublicClient } from '@/lib/supabase/public'
import { parseSocials } from '@/lib/validation/admin/person'
import type { Person, SocialPlatform } from '@/lib/config/leadership'

export const peopleTag = 'people'

type PersonType = 'executive' | 'adviser'

async function publishedPeople(type: PersonType): Promise<Person[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('people')
    .select('id, type, name, role, photo_path, bio, socials, sort_order, published')
    .eq('type', type)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (data ?? []).map((p) => ({
    id: p.id,
    type: p.type,
    name: p.name,
    role: p.role,
    photoPath: p.photo_path ? mediaPublicUrl(p.photo_path) : null,
    socials: parseSocials(p.socials) as { platform: SocialPlatform; href: string }[],
    sortOrder: p.sort_order,
    published: p.published,
  }))
}

export async function getExecutives(): Promise<Person[]> {
  'use cache'
  cacheTag(peopleTag)
  cacheLife('max')
  return publishedPeople('executive')
}

export async function getAdvisers(): Promise<Person[]> {
  'use cache'
  cacheTag(peopleTag)
  cacheLife('max')
  return publishedPeople('adviser')
}
