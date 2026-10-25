'use server'

import { updateTag } from 'next/cache'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import { adminLabel, requireAdmin } from '@/lib/auth/admin'
import { postsTag } from '@/lib/data/posts'
import { createClient } from '@/lib/supabase/server'
import { postSchema } from '@/lib/validation/admin/post'
import type { PostInput } from '@/lib/validation/admin/post'
import type { ActionResult } from '@/lib/actions/admin/admins'
import type { Json, TablesUpdate } from '@/lib/supabase/types'


// turn the editor's validated values into a row the posts table accepts
function toRow(input: PostInput): TablesUpdate<'posts'> {
  const parsed = postSchema.parse(input)
  return {
    title: parsed.title,
    slug: parsed.slug,
    kind: parsed.kind,
    excerpt: parsed.excerpt || null,
    cover_path: parsed.coverPath || null,
    cover_alt: parsed.coverAlt || null,
    // tiptap json and the gallery list are plain serialisable data; store as jsonb
    body: parsed.body as Json,
    gallery: parsed.gallery as Json,
  }
}

// postgres unique-violation: here it can only be the slug
function isSlugTaken(error: { code?: string } | null) {
  return error?.code === '23505'
}

// start a new post: insert an empty draft, then open it in the editor
export async function createDraft() {
  // this runs on a real request and redirects to a per-user page; never prerender it
  await connection()
  const admin = await requireAdmin()
  const supabase = await createClient()
  // a throwaway unique slug so the insert succeeds; the admin edits it before publishing
  const slug = `untitled-${crypto.randomUUID().slice(0, 8)}`
  const { data, error } = await supabase
    .from('posts')
    .insert({ title: 'Untitled post', slug, author_name: adminLabel(admin), status: 'draft' })
    .select('id')
    .single()

  if (error || !data) throw new Error('Could not start a new post.')
  updateTag(postsTag)
  redirect(`/admin/blog/${data.id}`)
}

// save the current content, leaving the status as it is
export async function savePost(id: string, input: PostInput): Promise<ActionResult> {
  return write(id, input, {})
}

// save the current content and make the post live
export async function publishPost(id: string, input: PostInput): Promise<ActionResult> {
  return write(id, input, { status: 'published', publishedAt: true })
}

// save the current content and take the post back to draft
export async function unpublishPost(id: string, input: PostInput): Promise<ActionResult> {
  return write(id, input, { status: 'draft' })
}

async function write(
  id: string,
  input: PostInput,
  { status, publishedAt }: { status?: 'draft' | 'published'; publishedAt?: boolean },
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }

  const supabase = await createClient()
  const row = toRow(input)
  if (status) row.status = status
  // stamp the publish time when going live
  if (publishedAt) row.published_at = new Date().toISOString()

  const { error } = await supabase.from('posts').update(row).eq('id', id)

  if (error) {
    if (isSlugTaken(error)) return { ok: false, message: 'That slug is already used by another post.' }
    return { ok: false, message: 'Could not save. Try again.' }
  }

  updateTag(postsTag)
  const message = status === 'published' ? 'Published.' : status === 'draft' ? 'Moved to draft.' : 'Saved.'
  return { ok: true, message }
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { ok: false, message: 'Could not delete the post. Try again.' }
  updateTag(postsTag)
  return { ok: true }
}
