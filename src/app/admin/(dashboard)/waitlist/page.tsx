import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { NotifyWaitlist } from '@/components/admin/waitlist/notify-waitlist'
import { PageHeader } from '@/components/admin/page-header'
import { requireAdmin } from '@/lib/auth/admin'
import { listWaitlist } from '@/lib/data/admin/waitlist'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'Waiting list' }

export default async function WaitlistPage() {
  await requireAdmin()
  const { groups, total, current } = await listWaitlist()

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
              <div className='flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-rule pb-3'>
                <h2 id={`cohort-${cohort}`} className='font-mono text-label uppercase text-muted'>
                  Cohort {cohort} · {entries.length}
                </h2>
                <div className='flex items-center gap-6'>
                  {cohort === current && (
                    <NotifyWaitlist cohort={cohort} waiting={entries.filter((e) => !e.notified_at).length} />
                  )}
                <Button variant='primary' href={`/admin/waitlist/export?cohort=${encodeURIComponent(cohort)}`} download className='px-5'>
                  <Download className='size-4' aria-hidden />
                  Export CSV
                </Button>
                </div>
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
