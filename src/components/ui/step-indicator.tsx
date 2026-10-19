import { cn } from '@/lib/utils/cn'

type Props = {
  steps: string[]
  current: number // 1-based
}

export function StepIndicator({ steps, current }: Props) {
  return (
    <ol className='flex flex-wrap items-center gap-x-4 gap-y-2'>
      {steps.map((label, i) => {
        const n = i + 1
        const isCurrent = n === current
        const isDone = n < current
        return (
          <li key={label} className='flex items-center gap-2'>
            <span
              className={cn(
                'font-mono text-label tabular-nums',
                isCurrent ? 'text-teal' : isDone ? 'text-ink' : 'text-muted',
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {String(n).padStart(2, '0')}
            </span>
            <span
              className={cn(
                'hidden font-mono text-label uppercase sm:inline',
                isCurrent ? 'text-teal' : isDone ? 'text-ink' : 'text-muted',
              )}
            >
              {label}
            </span>
            {n < steps.length && (
              <span className='h-px w-6 bg-rule' aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
