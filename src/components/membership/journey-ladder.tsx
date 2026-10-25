import { cn } from '@/lib/utils/cn'

export type JourneyStep = {
  title: string
  caption?: string
  // a step not every cohort goes through: tagged 'If applicable'
  optional?: boolean
}

type Props = {
  steps: JourneyStep[]
  // 'dark' on ink bands (paper text), 'light' on paper
  tone?: 'light' | 'dark'
}

const tones = {
  light: {
    line: 'border-ink/40',
    ring: 'border-ink bg-paper',
    number: 'text-muted',
    title: 'text-ink',
    caption: 'text-muted',
  },
  dark: {
    line: 'border-paper/45',
    ring: 'border-paper bg-ink',
    number: 'text-paper/70',
    title: 'text-paper',
    caption: 'text-paper/75',
  },
}

/*
  the membership journey as a dotted timeline (layout from reference/screenshots/timeline.webp).
  from lg: one dotted line runs edge to edge through ring markers, entries alternate below and above it,
  each tied to its ring by a short dotted connector. below lg: a vertical dotted line, entries to its right.
  from lg every step is a three-row subgrid (above, ring, below) so all rings sit on one line.
*/
export function JourneyLadder({ steps, tone = 'light' }: Props) {
  const t = tones[tone]

  return (
    <ol
      className='flex flex-col lg:grid lg:grid-rows-[auto_auto_auto]'
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, i) => {
        // the first entry sits below the line, then they alternate
        const above = i % 2 === 1
        const connector = (
          <span
            aria-hidden
            className={cn('hidden h-12 border-l-2 border-dotted lg:block', t.line)}
          />
        )

        return (
          <li
            key={step.title}
            className='relative pb-10 pl-9 last:pb-0 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:pb-0 lg:pl-0'
          >
            {/* vertical line through every step (below lg) */}
            <span
              aria-hidden
              className={cn(
                'absolute top-0 bottom-0 left-1.25 border-l-2 border-paper/70 lg:hidden',
                t.line,
              )}
            />

            {/* ring, on the horizontal line from lg */}
            <div className='absolute top-1.5 left-0 lg:relative lg:top-auto lg:row-start-2 lg:flex lg:items-center lg:justify-center'>
              {/*
                the horizontal line is drawn once, from the first step across every column (equal widths, no gap),
                so the dots run unbroken. later rings paint over it in dom order
              */}
              {i === 0 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-1/2 left-0 hidden -translate-y-1/2 border-t lg:block',
                    t.line,
                  )}
                  style={{ width: `${steps.length * 100}%` }}
                />
              )}
              <span
                aria-hidden
                className={cn('relative block size-3 rounded-full border-2', t.ring)}
              />
            </div>

            <div
              className={cn(
                'flex flex-col lg:items-center lg:px-2 lg:text-center',
                above ? 'lg:row-start-1 lg:justify-end' : 'lg:row-start-3',
              )}
            >
              {!above && <div className='lg:mb-5'>{connector}</div>}
              {/* <span className={cn('font-mono text-label tabular-nums', t.number)}>
                {String(i + 1).padStart(2, '0')}
              </span> */}
              {step.optional && (
                <span className={cn('mt-1 font-mono text-label md:uppercase', t.number)}>If applicable</span>
              )}
              
              <h3 className={cn('mt-1 font-body md:font-display text-h3', t.title)}>{step.title}</h3>
              {step.caption && (
                <p className={cn('mt-3 md:mt-2 font-body text-small', t.caption)}>{step.caption}</p>
              )}
              {above && <div className='lg:mt-5'>{connector}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
