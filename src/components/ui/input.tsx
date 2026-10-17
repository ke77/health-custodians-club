import type { InputHTMLAttributes } from 'react'
import {
  FieldShell,
  describedBy,
  fieldBase,
  errorRing,
} from '@/components/ui/field'
import { cn } from '@/lib/utils/cn'

type Props = {
  id: string
  label: string
  hint?: string
  error?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

export function Input({ id, label, hint, error, className, ...props }: Props) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-describedby={describedBy(id, hint, error)}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, errorRing(error), className)}
        {...props}
      />
    </FieldShell>
  )
}
