import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/types'

export type Post = Tables<'posts'>
export type PostFilter = 'draft' | 'published' | 'all'

// the list screen only needs these columns, not the full body json
export type PostListItem = Pick<
  Post,
  'id' | 'title' | 'slug' | 'kind' | 'status' | 'updated_at' | 'published_at' | 'author_name'
>

export async function listPosts(filter: PostFilter): Promise<PostListItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from('posts')
    .select('id, title, slug, kind, status, updated_at, published_at, author_name')
    .order('updated_at', { ascending: false })
  if (filter !== 'all') query = query.eq('status', filter)
  const { data } = await query
  return data ?? []
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  return data
}
