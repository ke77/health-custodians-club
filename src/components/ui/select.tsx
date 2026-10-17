import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  FieldShell,
  describedBy,
  fieldBase,
  errorRing,
} from '@/components/ui/field'
import { cn } from '@/lib/utils/cn'

type Option = { value: string; label: string }

type Props = {
  id: string
  label: string
  hint?: string
  error?: string
  options: Option[]
  placeholder?: string
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'>

export function Select({
  id,
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  defaultValue,
  ...props
}: Props) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className='relative'>
        <select
          id={id}
          aria-describedby={describedBy(id, hint, error)}
          aria-invalid={error ? true : undefined}
          defaultValue={defaultValue ?? (placeholder ? '' : undefined)}
          className={cn(fieldBase, 'w-full appearance-none pr-10', errorRing(error), className)}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted'
          aria-hidden
        />
      </div>
    </FieldShell>
  )
}
