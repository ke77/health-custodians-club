'use client'

import { ConfirmButton } from '@/components/admin/confirm-button'
import { notifyWaitlist } from '@/lib/actions/admin/waitlist'

// emails everyone on the current cohort's list who has not been told yet. hidden once everyone has been
export function NotifyWaitlist({ cohort, waiting }: { cohort: string; waiting: number }) {
  if (waiting === 0) return <span className='font-mono text-label text-muted'>Everyone notified</span>

  return (
    <ConfirmButton
      label={`Notify ${waiting} ${waiting === 1 ? 'person' : 'people'}`}
      title='Tell the waiting list applications are open?'
      body={
        <>
          This emails {waiting} {waiting === 1 ? 'person' : 'people'} on the {cohort} list who have not been told yet, with a
          link to apply. Each person gets their own email. It cannot be undone, but anyone already notified is skipped if you run
          it again. Applications must be open first.
        </>
      }
      confirmLabel='Send emails'
      onConfirm={() => notifyWaitlist({ cohort })}
    />
  )
}
