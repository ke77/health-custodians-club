'use client'

import { useRef, useState, useTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import { FormMessage } from '@/components/admin/form-message'
import { previewStatusEmail, updateApplicationStatus } from '@/lib/actions/admin/applications'
import type { StatusPreview } from '@/lib/actions/admin/applications'
import type { ActionResult } from '@/lib/actions/admin/admins'
import { isEmailedStatus, selectableStatuses, statusLabel } from '@/lib/config/application-status'
import type { ApplicationStatus } from '@/lib/config/application-status'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

/*
  most changes save straight away; a wrong choice is undone by choosing again.
  accepted, rejected and waitlisted open a dialog first: it previews the email and lets the admin send it with the change
  (on by default) or save the status without emailing.
*/
export function StatusSelect({ id, status }: { id: string; status: ApplicationStatus }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [value, setValue] = useState(status)
  const [target, setTarget] = useState<ApplicationStatus | null>(null)
  const [preview, setPreview] = useState<StatusPreview | null>(null)
  const [notify, setNotify] = useState(true)
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()
  const [loadingPreview, startPreview] = useTransition()

  function save(next: ApplicationStatus, withEmail: boolean) {
    const previous = value
    setValue(next)
    setResult(null)
    startTransition(async () => {
      const r = await updateApplicationStatus({ id, status: next, notify: withEmail })
      if (!r.ok) setValue(previous)
      setResult(r)
      dialog.current?.close()
    })
  }

  function change(next: ApplicationStatus) {
    setResult(null)
    if (!isEmailedStatus(next)) {
      save(next, false)
      return
    }
    // the select stays on the current status until the admin confirms
    setTarget(next)
    setPreview(null)
    setNotify(true)
    dialog.current?.showModal()
    startPreview(async () => {
      const p = await previewStatusEmail({ id, status: next })
      setPreview(p)
      // off by default when they were already told, or when email is not set up yet
      if (p.ok) setNotify(p.configured && !p.alreadySentAt)
    })
  }

  const canEmail = preview?.ok === true && preview.configured

  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor='status' className='font-mono text-label uppercase text-muted'>
        Status
      </label>
      <div className='relative'>
        <select
          id='status'
          value={value}
          disabled={pending}
          onChange={(e) => change(e.target.value as ApplicationStatus)}
          className={cn(
            'min-h-11 w-full appearance-none rounded-sm bg-sand px-4 pr-10 font-body text-base font-medium text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-60',
          )}
        >
          {selectableStatuses(status).map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted' aria-hidden />
      </div>
      <FormMessage result={result} />

      <dialog
        ref={dialog}
        onClose={() => setTarget(null)}
        className='m-auto w-[min(34rem,calc(100vw-3rem))] rounded-sm bg-paper p-0 text-ink backdrop:bg-ink/40'
      >
        {target && (
          <div className='flex flex-col gap-4 p-6 sm:p-8'>
            <h2 className='font-display text-h3'>Mark as {statusLabel(target).toLowerCase()}?</h2>

            {loadingPreview || !preview ? (
              <p className='font-body text-base text-ink/70'>Loading the email…</p>
            ) : !preview.ok ? (
              <p className='font-body text-base text-error'>{preview.message}</p>
            ) : (
              <>
                <label className={cn('flex items-start gap-3 font-body text-base', canEmail ? 'cursor-pointer' : 'opacity-60')}>
                  <input
                    type='checkbox'
                    checked={notify && canEmail}
                    disabled={!canEmail}
                    onChange={(e) => setNotify(e.target.checked)}
                    className='mt-1 size-4 accent-teal'
                  />
                  <span>
                    Email the applicant <span className='text-muted'>({preview.to})</span>
                  </span>
                </label>

                {!preview.configured && (
                  <p className='font-body text-small text-muted'>
                    Email sending is not set up yet, so no email will go. The status will still be saved.
                  </p>
                )}
                {preview.alreadySentAt && (
                  <p className='font-body text-small text-muted'>
                    They were already sent this email on {formatDate(preview.alreadySentAt)}, so it is switched off.
                  </p>
                )}

                <div className='rounded-sm bg-sand p-4'>
                  <p className='font-mono text-label uppercase text-muted'>Subject</p>
                  <p className='mt-1 font-body text-base font-medium'>{preview.subject}</p>
                  <p className='mt-4 font-mono text-label uppercase text-muted'>Message</p>
                  <p className='mt-1 max-h-56 overflow-y-auto whitespace-pre-line font-body text-small text-ink/80'>
                    {preview.text}
                  </p>
                </div>
              </>
            )}

            <div className='flex flex-wrap justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={() => dialog.current?.close()}
                className={cn('min-h-11 rounded-lg px-5 font-body text-base text-ink/80 hover:text-ink', focus)}
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={pending || loadingPreview || !preview?.ok}
                onClick={() => save(target, notify && canEmail)}
                className={cn(
                  'min-h-11 rounded-lg bg-primary px-5 font-body text-base font-medium text-ink shadow-button hover:opacity-90 disabled:opacity-50',
                  focus,
                )}
              >
                {pending ? 'Saving…' : notify && canEmail ? 'Save and send email' : 'Save status'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
