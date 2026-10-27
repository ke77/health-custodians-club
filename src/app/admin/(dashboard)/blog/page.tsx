import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/buttons'
import { requireAdmin } from '@/lib/auth/admin'
import { listPosts } from '@/lib/data/admin/posts'
import type { PostFilter } from '@/lib/data/admin/posts'
import { createDraft } from '@/lib/actions/admin/posts'
import { postKinds } from '@/lib/validation/admin/post'
import { cn } from '@/lib/utils/cn'
import { formatDate, formatDateTime } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Blog' }

const filters: PostFilter[] = ['draft', 'published', 'all']
const isFilter = (v: string | undefined): v is PostFilter => v === 'draft' || v === 'published' || v === 'all'
const kindLabel = (value: string) => postKinds.find((k) => k.value === value)?.label ?? value

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin()
  const { status } = await searchParams
  const filter: PostFilter = isFilter(status) ? status : 'draft'
  const rows = await listPosts(filter)

  return (
    <>
      <PageHeader
        title='Blog'
        description='Write, edit and publish posts for the main site. Drafts stay private until you publish them.'
        actions={
          <form action={createDraft}>
            <Button type='submit' variant='primary' className='px-6'>
              New post
            </Button>
          </form>
        }
      />

      <div role='tablist' aria-label='Filter posts' className='mt-8 flex gap-2'>
        {filters.map((f) => (
          <Link
            key={f}
            href={f === 'draft' ? '/admin/blog' : `/admin/blog?status=${f}`}
            role='tab'
            aria-selected={filter === f}
            className={cn(
              'rounded-lg px-4 py-2 font-mono text-label uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
              filter === f ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-ink/5 hover:text-ink',
            )}
          >
            {f === 'draft' ? 'Drafts' : f === 'published' ? 'Published' : 'All'}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className='mt-8 border-t border-rule py-16'>
          <p className='font-body text-base text-ink/70'>
            {filter === 'published' ? 'Nothing published yet.' : 'No posts yet. Start one with “New post”.'}
          </p>
        </div>
      ) : (
        <ul className='mt-8 flex flex-col gap-px'>
          {rows.map((p) => (
            <li key={p.id} className='border-t border-rule last:border-b'>
              <Link
                href={`/admin/blog/${p.id}`}
                className='flex flex-col gap-1 py-5 transition-colors hover:bg-ink/[0.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal sm:flex-row sm:items-baseline sm:justify-between sm:gap-4'
              >
                <span className='flex items-baseline gap-3'>
                  <span
                    className={cn('size-2 shrink-0 self-center rounded-full', p.status === 'published' ? 'bg-teal' : 'bg-ink/30')}
                    aria-hidden
                  />
                  <span className='font-body text-base font-medium text-ink'>{p.title || 'Untitled post'}</span>
                </span>
                <span className='pl-5 font-mono text-label uppercase text-muted sm:pl-0'>
                  {kindLabel(p.kind)} ·{' '}
                  {p.status === 'published' && p.published_at
                    ? `Published ${formatDate(p.published_at)}`
                    : `Edited ${formatDateTime(p.updated_at)}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
