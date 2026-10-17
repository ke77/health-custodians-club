import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  id: string
  label: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'>

export function Checkbox({ id, label, className, ...props }: Props) {
  return (
    <label htmlFor={id} className='flex min-h-11 cursor-pointer items-center gap-3'>
      <input
        id={id}
        type='checkbox'
        className={cn(
          'size-5 shrink-0 rounded-xs border border-ink bg-sand accent-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
          className,
        )}
        {...props}
      />
      <span className='font-body text-body text-ink'>{label}</span>
    </label>
  )
}
