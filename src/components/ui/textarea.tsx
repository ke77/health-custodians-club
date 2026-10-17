import type { TextareaHTMLAttributes } from 'react'
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
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>

export function Textarea({
  id,
  label,
  hint,
  error,
  className,
  rows = 5,
  ...props
}: Props) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        rows={rows}
        aria-describedby={describedBy(id, hint, error)}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, 'resize-y leading-relaxed', errorRing(error), className)}
        {...props}
      />
    </FieldShell>
  )
}
