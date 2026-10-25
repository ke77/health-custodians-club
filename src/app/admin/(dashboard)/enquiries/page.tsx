import type { Metadata } from 'next'
import Link from 'next/link'
import { MarkButton } from '@/components/admin/enquiries/enquiry-actions'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { listInquiries } from '@/lib/data/admin/inquiries'
import type { InquiryFilter } from '@/lib/data/admin/inquiries'
import { interestTypes } from '@/lib/config/contact'
import { cn } from '@/lib/utils/cn'
import { formatDateTime } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Enquiries' }

const interestLabel = (value: string) => interestTypes.find((t) => t.value === value)?.label ?? value
const filters: InquiryFilter[] = ['new', 'handled', 'all']
const isFilter = (v: string | undefined): v is InquiryFilter => v === 'new' || v === 'handled' || v === 'all'

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin()
  const { status } = await searchParams
  const filter: InquiryFilter = isFilter(status) ? status : 'new'
  const rows = await listInquiries(filter)

  return (
    <>
      <PageHeader
        title='Enquiries'
        description='Messages from the contact form. Reply by email, then mark them handled so the team knows.'
      />

      <div role='tablist' aria-label='Filter enquiries' className='mt-8 flex gap-2'>
        {filters.map((f) => (
          <Link
            key={f}
            href={f === 'new' ? '/admin/enquiries' : `/admin/enquiries?status=${f}`}
            role='tab'
            aria-selected={filter === f}
            className={cn(
              'rounded-lg px-4 py-2 font-mono text-label uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
              filter === f ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-ink/5 hover:text-ink',
            )}
          >
            {f === 'new' ? 'New' : f === 'handled' ? 'Handled' : 'All'}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className='mt-8 border-t border-rule py-16'>
          <p className='font-body text-base text-ink/70'>
            {filter === 'new' ? 'No new enquiries. Nicely done.' : 'Nothing here.'}
          </p>
        </div>
      ) : (
        <ul className='mt-8 flex flex-col gap-px'>
          {rows.map((e) => (
            <li key={e.id} className='border-t border-rule py-6 last:border-b'>
              <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
                <h2 className='font-body text-base font-medium text-ink'>
                  {e.name}
                  {e.organisation && <span className='font-normal text-muted'> · {e.organisation}</span>}
                </h2>
                <span className='font-mono text-label uppercase text-muted'>
                  {interestLabel(e.interest)} · {formatDateTime(e.created_at)}
                </span>
              </div>
              <p className='mt-3 max-w-[var(--container-prose)] whitespace-pre-line font-body text-base leading-[1.7] text-ink/80'>
                {e.message}
              </p>
              <div className='mt-4 flex flex-wrap items-center gap-6'>
                <a
                  href={`mailto:${e.email}?subject=${encodeURIComponent('Re: your message to Health Custodians Club')}`}
                  className='rounded-xs text-small font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
                >
                  Reply to {e.email}
                </a>
                <MarkButton id={e.id} status={e.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
