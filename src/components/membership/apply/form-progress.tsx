import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type StepMeta = { title: string; description: string }

type Props = {
  steps: readonly StepMeta[]
  current: number
  // furthest step reached: earlier steps can be revisited
  reached: number
  onGo: (step: number) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

// the page number, set like a report's folio: large serif current page over a mono total
function Folio({ current, total, size }: { current: number; total: number; size: 'lg' | 'sm' }) {
  return (
    <p className='flex items-baseline gap-2' aria-hidden>
      <span className={cn('font-display leading-none text-ink tabular-nums', size === 'lg' ? 'text-display' : 'text-h2')}>
        {pad(current + 1)}
      </span>
      <span className='font-mono text-label tabular-nums text-muted'>/ {pad(total)}</span>
    </p>
  )
}

// desktop: a sticky rail with the folio and every step
export function ProgressRail({ steps, current, reached, onGo }: Props) {
  return (
    <nav aria-label='Application progress' className='hidden lg:block'>
      {/*<Folio current={current} total={steps.length} size='lg' />*/}
      <ol className='mt-10 flex flex-col border-l border-rule'>
        {steps.map((s, i) => {
          const isCurrent = i === current
          // every step before the furthest one reached has been completed
          const isDone = i < reached && !isCurrent
          const canGo = i <= reached && !isCurrent
          const content = (
            <>
              <span className='flex w-6 shrink-0 justify-start font-mono text-label tabular-nums'>
                {isDone ? <Check className='size-3.5 text-ink' strokeWidth={2.5} aria-hidden /> : pad(i + 1)}
              </span>
              <span>{s.title}</span>
            </>
          )
          return (
            <li
              key={s.title}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                '-ml-px border-l-2 py-2.5 pl-5',
                isCurrent ? 'border-ink' : 'border-transparent',
              )}
            >
              {canGo ? (
                <button
                  type='button'
                  onClick={() => onGo(i)}
                  className='flex cursor-pointer items-center gap-3 text-left font-body text-base text-ink/70 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
                >
                  {content}
                  <span className='sr-only'>(edit this step)</span>
                </button>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-3 font-body text-base',
                    isCurrent ? 'font-semibold text-ink' : 'text-muted',
                  )}
                >
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// phones and tablets: folio, step title and a segmented hairline
export function ProgressBar({ steps, current }: Pick<Props, 'steps' | 'current'>) {
  return (
    <div className='lg:hidden'>
      <div className='flex items-end justify-end gap-4'>
        {/*<Folio current={current} total={steps.length} size='sm' />*/}
        <p className='pb-1 text-right font-mono text-label uppercase text-muted'>
          Step {current + 1} of {steps.length}
        </p>
      </div>
      <ol aria-hidden className='mt-4 grid gap-1' style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => (
          <li key={s.title} className={cn('h-0.5 rounded-full', i <= current ? 'bg-ink' : 'bg-ink/10')} />
        ))}
      </ol>
    </div>
  )
}
