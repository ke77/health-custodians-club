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
      <label htmlFor={id} className='font-body font-semibold text-lg text-ink/80'>
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
  'min-h-11 rounded-sm bg-gray-100/90 border-b border-b-transparent transition-[border-color] duration-300 ease-out motion-reduce:transition-none focus:border-b-ink/20 px-4 py-3 font-body text-body text-ink placeholder:text-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

export function errorRing(error?: string) {
  return cn(error && 'outline-2 outline-error')
}
