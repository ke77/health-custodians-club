import { cn } from '@/lib/utils/cn'

type Props = {
  steps: string[]
}

// membership journey as a ladder (docs/02, docs/03): horizontal on desktop, stacks vertically on phones.
// built in html and css, single teal accent. no interview step while O01 holds.
export function JourneyLadder({ steps }: Props) {
  return (
    <ol className='flex flex-col gap-0 md:flex-row md:gap-0'>
      {steps.map((step, i) => {
        const n = i + 1
        const isLast = n === steps.length
        return (
          <li
            key={step}
            className='relative flex items-start gap-4 pb-8 md:flex-1 md:flex-col md:gap-4 md:pb-0'
          >
            {/* connecting line */}
            {!isLast && (
              <span
                aria-hidden
                className='absolute top-4 left-[7px] h-full w-px bg-rule md:top-[7px] md:left-0 md:h-px md:w-full'
              />
            )}
            <span
              aria-hidden
              className='relative z-10 mt-1 size-[15px] shrink-0 rounded-full border-2 border-teal bg-paper md:mt-0'
            />
            <div className='flex flex-col gap-1 md:pr-4'>
              <span className='font-mono text-label tabular-nums text-teal'>
                {String(n).padStart(2, '0')}
              </span>
              <span className={cn('font-display text-h3 text-ink')}>{step}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
