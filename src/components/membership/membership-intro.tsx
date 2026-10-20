import type { ReactNode } from 'react'
import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'
import { minimumCgpa, programmes } from '@/lib/config/application'

const listed = programmes.filter((p) => p !== 'Other health-related')

const criteria: { label: string; value: ReactNode }[] = [
  { label: 'Who', value: 'Tertiary students with a background in the health sciences.' },
  { label: 'Level', value: 'Level 200 or above.' },
  { label: 'CGPA', value: `${minimumCgpa.toFixed(2)} or higher, on a 4.00 scale.` },
  {
    label: 'Programmes',
    value: (
      <>
        <ul className='grid gap-x-6 gap-y-1 sm:grid-cols-2'>
          {listed.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className='mt-3 text-small text-muted'>
          Other health-related programmes are considered. General Psychology is not eligible.
        </p>
      </>
    ),
  },
  {
    label: 'Not yet',
    value: 'Health professionals cannot apply for membership at this stage, but are welcome as mentors and partners.',
  },
]

// heading, intro and the apply button; eligibility set out as ruled rows, like a report's criteria table
export function MembershipIntro() {
  return (
    <section id='eligibility' className='bg-paper'>
      <div className='container-site grid gap-14 py-16 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20'>
        <Reveal className='flex flex-col items-start lg:self-start'>
          <h1 className='heading-section text-ink'>
            For health students who want to do more than pass exams.
          </h1>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
            Members train together for two years in communication, leadership, languages and research, then take
            what they learn to schools, markets and rural communities. Applications open with each cohort.
          </p>
          <div className='mt-10'>
            <Button href='/membership/apply' variant='primary' className='px-8 py-3.5 md:px-9 md:py-4 text-ink' arrow>
              Apply to join
            </Button>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h2 className='font-mono text-label uppercase text-muted'>Eligibility</h2>
          <dl className='mt-4 border-t border-ink'>
            {criteria.map((c) => (
              <div
                key={c.label}
                className='grid gap-2 border-b border-rule py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6'
              >
                <dt className='font-mono text-label uppercase text-ink sm:pt-1'>{c.label}</dt>
                <dd className='font-body text-base md:text-md text-ink/80 leading-[1.6]'>{c.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
