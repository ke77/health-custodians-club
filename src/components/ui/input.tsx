'use client'

import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FieldShell, describedBy, fieldBase, errorRing } from '@/components/ui/field'
import { cn } from '@/lib/utils/cn'

type Props = {
  id: string
  label: string
  hint?: string
  error?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

export function Input({ id, label, hint, error, className, type, ...props }: Props) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  // a password field keeps its type until the eye is clicked, then shows the characters
  const resolvedType = isPassword && revealed ? 'text' : type

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className='relative'>
        <input
          id={id}
          type={resolvedType}
          aria-describedby={describedBy(id, hint, error)}
          aria-invalid={error ? true : undefined}
          className={cn(fieldBase, 'w-full', isPassword && 'pr-12', errorRing(error), className)}
          {...props}
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className='absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-sm text-ink/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
          >
            {revealed ? <EyeOff className='size-4' aria-hidden /> : <Eye className='size-4' aria-hidden />}
          </button>
        )}
      </div>
    </FieldShell>
  )
}
