'use client'

import { cn } from '@/lib/utils/cn'

type Props = {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  description?: string
}

// the shared on/off switch used across the dashboard (published, active, banner on…)
export function Switch({ checked, onChange, label, description }: Props) {
  return (
    <div className='flex items-start justify-between gap-6'>
      <span className='flex flex-col gap-1'>
        <span className='font-body text-base font-medium text-ink'>{label}</span>
        {description && <span className='font-body text-small text-muted'>{description}</span>}
      </span>
      <button
        type='button'
        role='switch'
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
          checked ? 'bg-teal' : 'bg-ink/20',
        )}
      >
        <span className={cn('inline-block size-5 rounded-full bg-paper transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
      </button>
    </div>
  )
}
