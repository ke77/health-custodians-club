import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type FieldShellProps = {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

export function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='font-mono text-label uppercase text-ink'>
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className='text-small text-muted'>
          {hint}
        </p>
      )}
      {children}
      <p
        id={`${id}-error`}
        aria-live='polite'
        className='min-h-5 text-small text-error'
      >
        {error}
      </p>
    </div>
  )
}

export function describedBy(id: string, hint?: string, error?: string) {
  return (
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
    undefined
  )
}

export const fieldBase =
  'min-h-11 rounded-sm bg-sand px-4 py-3 font-body text-body text-ink placeholder:text-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

export function errorRing(error?: string) {
  return cn(error && 'outline-2 outline-error')
}
