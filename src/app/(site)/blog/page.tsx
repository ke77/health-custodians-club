import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ComingSoon } from '@/components/layout/coming-soon'
import { Reveal } from '@/components/ui/reveal'
import { getPublishedPosts } from '@/lib/data/posts'
import type { PostSummary } from '@/lib/data/posts'
import { formatDate } from '@/lib/utils/format'
import { postKinds } from '@/lib/validation/admin/post'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, articles, training notes and outreach stories from the Health Custodians Club.',
}

const kindLabel = (value: string) => postKinds.find((k) => k.value === value)?.label ?? value

function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group flex h-full flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
    >
      {post.coverUrl ? (
        <div className='relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5'>
          <Image
            src={post.coverUrl}
            alt={post.coverAlt}
            fill
            sizes='(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 88vw'
            className='object-cover transition-transform duration-500 group-hover:scale-[1.02]'
          />
        </div>
      ) : (
        <div aria-hidden className='aspect-[3/2] w-full rounded-sm bg-ink/5' />
      )}
      <p className='font-mono text-label uppercase text-muted'>
        {kindLabel(post.kind)}
        {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
      </p>
      <h2 className='font-body text-md md:text-lg font-semibold text-ink'>{post.title}</h2>
      {post.excerpt && <p className='font-body text-base text-ink/70 leading-[1.6em]'>{post.excerpt}</p>}
    </Link>
  )
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  // nothing published yet: the coming-soon page stays until the first post goes live
  if (posts.length === 0) {
    return (
      <ComingSoon
        label='Blog'
        image='/hero-students.jpg'
        blurb='Stories from our outreach, training notes and updates from the club will live here soon.'
      />
    )
  }

  return (
    <section>
      <div className='container-site pt-6 pb-24 md:pt-5 md:pb-32'>
        <Reveal>
          <h1 className='heading-section text-ink'>Blog</h1>
          <p className='mt-4 md:mt-5 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            News, articles and stories from the club&rsquo;s training and outreach.
          </p>
        </Reveal>

        <ul className='mt-14 md:mt-20 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post, i) => (
            <Reveal key={post.slug} as='li' index={i % 3}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
