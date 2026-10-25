import { WaitlistForm } from '@/components/membership/apply/waitlist-form'
import { formatDate } from '@/lib/utils/format'

type Props = {
  deadline: string | null
  cohort: string
}

// shown in place of the form when applications are closed (docs/04)
export function ClosedState({ deadline, cohort }: Props) {
  return (
    <div className='grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-20'>
      <div>
        <p className='font-mono text-label uppercase text-muted'>Applications closed</p>
      </div>
      <div className='max-w-[var(--container-prose)]'>
        <p className='font-body text-base md:text-md text-ink/80 leading-[1.7]'>
          Applications are closed just now
          {cohort ? ` for the ${cohort} cohort` : ''}
          {deadline ? `. They closed on ${formatDate(deadline)}.` : '.'} Leave your email and we will let you know
          the moment they open again.
        </p>
        <div className='mt-8'>
          <WaitlistForm />
        </div>
        <p className='mt-6 font-body text-small text-muted'>
          We use your email only to tell you applications are open.
        </p>
      </div>
    </div>
  )
}
