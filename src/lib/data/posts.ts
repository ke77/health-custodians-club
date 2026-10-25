import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { mediaPublicUrl } from '@/lib/supabase/media'
import { createPublicClient } from '@/lib/supabase/public'
import type { Json, Tables } from '@/lib/supabase/types'

// the dashboard's post actions call updateTag with this, so published changes show on the next load
export const postsTag = 'posts'

export type PostSummary = {
  slug: string
  title: string
  excerpt: string | null
  kind: Tables<'posts'>['kind']
  publishedAt: string | null
  coverUrl: string | null
  coverAlt: string
}

export type PublicPost = PostSummary & {
  authorName: string | null
  body: Json
  gallery: { url: string; alt: string }[]
}

function summary(row: Pick<Tables<'posts'>, 'slug' | 'title' | 'excerpt' | 'kind' | 'published_at' | 'cover_path' | 'cover_alt'>): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    kind: row.kind,
    publishedAt: row.published_at,
    coverUrl: row.cover_path ? mediaPublicUrl(row.cover_path) : null,
    coverAlt: row.cover_alt ?? '',
  }
}

function toGallery(value: Json): PublicPost['gallery'] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return []
    const { path, alt } = item as Record<string, unknown>
    if (typeof path !== 'string' || !path) return []
    return [{ url: mediaPublicUrl(path), alt: typeof alt === 'string' ? alt : '' }]
  })
}

// every published post, newest first. an empty list is what keeps /blog on its coming-soon page
export async function getPublishedPosts(): Promise<PostSummary[]> {
  'use cache'
  cacheTag(postsTag)
  cacheLife('max')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('posts')
    .select('slug, title, excerpt, kind, published_at, cover_path, cover_alt')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return (data ?? []).map(summary)
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  'use cache'
  cacheTag(postsTag)
  cacheLife('max')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('posts')
    .select('slug, title, excerpt, kind, published_at, cover_path, cover_alt, author_name, body, gallery')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()
  if (!data) return null
  return { ...summary(data), authorName: data.author_name, body: data.body, gallery: toGallery(data.gallery) }
}
