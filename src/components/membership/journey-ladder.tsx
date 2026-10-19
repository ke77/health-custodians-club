type Step = string | { title: string; caption?: string }

type Props = {
  steps: Step[]
}

function normalise(step: Step): { title: string; caption?: string } {
  return typeof step === 'string' ? { title: step } : step
}

export function JourneyLadder({ steps }: Props) {
  return (
    <ol className='flex flex-col gap-0 md:flex-row md:gap-0'>
      {steps.map((raw, i) => {
        const { title, caption } = normalise(raw)
        const n = i + 1
        const isLast = n === steps.length
        return (
          <li
            key={title}
            className='relative flex items-start gap-4 pb-8 md:flex-1 md:flex-col md:gap-4 md:pb-0'
          >
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
            <div className='flex flex-col gap-1 md:pr-6'>
              <span className='font-mono text-label tabular-nums text-teal'>
                {String(n).padStart(2, '0')}
              </span>
              <span className='font-display text-h3 text-ink'>{title}</span>
              {caption && (
                <p className='mt-1 font-body text-small text-muted'>{caption}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
