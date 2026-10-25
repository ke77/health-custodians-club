import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { PostBody } from '@/components/blog/post-body'
import { getPublishedPost } from '@/lib/data/posts'
import { formatDate } from '@/lib/utils/format'
import { postKinds } from '@/lib/validation/admin/post'

type Props = { params: Promise<{ slug: string }> }

const kindLabel = (value: string) => postKinds.find((k) => k.value === value)?.label ?? value

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverUrl ? [{ url: post.coverUrl, alt: post.coverAlt }] : undefined,
    },
  }
}

async function PostContent({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()

  return (
    <article className='container-site pt-6 pb-24 md:pt-5 md:pb-32'>
      <Link
        href='/blog'
        className='inline-flex items-center gap-2 rounded-xs font-body text-base text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
      >
        <ArrowLeft className='size-4' aria-hidden /> All posts
      </Link>

      <header className='mt-8 md:mt-12'>
        <p className='font-mono text-label uppercase text-muted'>
          {kindLabel(post.kind)}
          {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
          {post.authorName && ` · ${post.authorName}`}
        </p>
        <h1 className='heading-section mt-4 text-ink'>{post.title}</h1>
        {post.excerpt && (
          <p className='mt-5 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
            {post.excerpt}
          </p>
        )}
      </header>

      {post.coverUrl && (
        <div className='relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-sm bg-ink/5 md:mt-14'>
          <Image src={post.coverUrl} alt={post.coverAlt} fill priority sizes='88vw' className='object-cover' />
        </div>
      )}

      <div className='mt-10 max-w-[var(--container-prose)] md:mt-14'>
        <PostBody body={post.body} />
      </div>

      {post.gallery.length > 0 && (
        <section aria-label='Photo gallery' className='mt-14 border-t border-rule pt-10 md:mt-20'>
          <ul className='grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4'>
            {post.gallery.map((photo) => (
              <li key={photo.url} className='relative aspect-[4/3] overflow-hidden rounded-sm bg-ink/5'>
                <Image src={photo.url} alt={photo.alt} fill sizes='(min-width: 768px) 29vw, 44vw' className='object-cover' />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

// params is awaited inside the boundary so the page shell can prerender and posts publish without a rebuild
export default function PostPage({ params }: Props) {
  return (
    <Suspense fallback={<div className='container-site min-h-[60svh]' />}>
      <PostContent params={params} />
    </Suspense>
  )
}
