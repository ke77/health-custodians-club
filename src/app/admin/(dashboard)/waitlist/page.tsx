import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { listWaitlist } from '@/lib/data/admin/waitlist'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Waiting list' }

export default async function WaitlistPage() {
  await requireAdmin()
  const { groups, total } = await listWaitlist()

  return (
    <>
      <PageHeader
        title='Waiting list'
        description='People who asked to be told when applications open. Export a cohort and email them when you reopen.'
      />

      {total === 0 ? (
        <div className='mt-10 border-t border-rule py-16'>
          <p className='font-body text-base text-ink/70'>
            No one is on the waiting list. People join it from the apply page while applications are closed.
          </p>
        </div>
      ) : (
        <div className='mt-10 flex flex-col gap-12'>
          {groups.map(({ cohort, entries }) => (
            <section key={cohort} aria-labelledby={`cohort-${cohort}`}>
              <div className='flex items-center justify-between gap-4 border-b border-rule pb-3'>
                <h2 id={`cohort-${cohort}`} className='font-mono text-label uppercase text-muted'>
                  Cohort {cohort} · {entries.length}
                </h2>
                <a
                  href={`/admin/waitlist/export?cohort=${encodeURIComponent(cohort)}`}
                  download
                  className='inline-flex items-center gap-2 rounded-xs text-small text-ink/80 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
                >
                  <Download className='size-4' aria-hidden />
                  Export CSV
                </a>
              </div>
              <ul className='divide-y divide-rule'>
                {entries.map((entry) => (
                  <li key={entry.id} className='flex items-center justify-between gap-4 py-3'>
                    <span className='truncate font-body text-base text-ink'>{entry.email}</span>
                    <span className='shrink-0 font-mono text-label text-muted'>
                      {entry.notified_at ? `Notified ${formatDate(entry.notified_at)}` : formatDate(entry.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
