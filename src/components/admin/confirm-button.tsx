'use client'

import { useRef, useState, useTransition } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  // the small trigger, e.g. "Remove"
  label: string
  // names the row for screen readers, e.g. "Remove ama@example.com"
  ariaLabel?: string
  title: string
  body: ReactNode
  confirmLabel: string
  onConfirm: () => Promise<{ ok: boolean; message?: string }>
  className?: string
}

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

// a text button that asks before doing something that cannot be undone (native <dialog>, so focus is trapped for free)
export function ConfirmButton({ label, ariaLabel, title, body, confirmLabel, onConfirm, className }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function confirm() {
    setError(null)
    startTransition(async () => {
      const result = await onConfirm()
      if (result.ok) dialog.current?.close()
      else setError(result.message ?? 'Something went wrong. Try again.')
    })
  }

  return (
    <>
      <button
        type='button'
        aria-label={ariaLabel}
        onClick={() => dialog.current?.showModal()}
        className={cn(
          'rounded-xs text-small text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink',
          focus,
          className,
        )}
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        onClose={() => setError(null)}
        className='m-auto w-[min(28rem,calc(100vw-3rem))] rounded-sm bg-paper p-0 text-ink backdrop:bg-ink/40'
      >
        <div className='flex flex-col gap-4 p-6 sm:p-8'>
          <h2 className='font-display text-h3'>{title}</h2>
          <div className='font-body text-base text-ink/70'>{body}</div>
          <p aria-live='polite' className='min-h-5 text-small text-error'>
            {error}
          </p>
          <div className='flex flex-wrap justify-end gap-3'>
            <button
              type='button'
              onClick={() => dialog.current?.close()}
              className={cn('min-h-11 rounded-lg px-5 font-body text-base text-ink/80 hover:text-ink', focus)}
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={confirm}
              disabled={pending}
              className={cn(
                'min-h-11 rounded-lg bg-primary px-5 font-body text-base font-medium text-ink shadow-button hover:opacity-90 disabled:opacity-50',
                focus,
              )}
            >
              {pending ? 'Working…' : confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
