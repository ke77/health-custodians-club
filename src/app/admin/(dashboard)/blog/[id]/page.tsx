import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PostEditor } from '@/components/admin/blog/post-editor'
import { requireAdmin } from '@/lib/auth/admin'
import { getPost } from '@/lib/data/admin/posts'

export const metadata: Metadata = { title: 'Edit post' }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  return (
    <div className='flex flex-col gap-8'>
      <Link
        href='/admin/blog'
        className='inline-flex w-fit items-center gap-2 rounded-xs font-mono text-label uppercase text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
      >
        <ArrowLeft className='size-4' aria-hidden /> All posts
      </Link>
      <PostEditor post={post} />
    </div>
  )
}
