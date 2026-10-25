import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'
import { minimumCgpa, programmes } from '@/lib/config/application'

const listed = programmes.filter((p) => p !== 'Other health-related')

export function MembershipIntro() {
  return (
    <section id='eligibility' className='bg-paper'>
      <div className='container-site grid gap-14 pt-1.5 pb-16 md:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20'>
        <Reveal className='flex flex-col items-start lg:self-start'>
          <h1 className='heading-section text-ink'>
            For health students who want to do more than pass exams.
          </h1>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
            Members train together for two years in communication, leadership, languages and research, then take
            what they learn to schools, markets and rural communities. Applications open with each cohort.
          </p>
          <div className='mt-7 md:mt-10'>
            <Button href='/membership/apply' variant='primary' className='px-8 py-3.5 md:px-9 md:py-4 text-ink shadow-sm' arrow>
              Apply to join
            </Button>
          </div>
        </Reveal>

        <Reveal index={1}>
          <h2 className='font-body text-label uppercase text-muted'>Eligibility</h2>
          <div className='mt-5 flex flex-col gap-4 font-body text-base md:text-md text-ink/80 leading-[1.7]'>
            <p>
              Membership is open to tertiary students in the health sciences who are in Level 200 or above, with a
              CGPA of at least {minimumCgpa.toFixed(2)} on a 4.00 scale, or a CWA if your institution uses one.
            </p>
            <p>
              Health professionals cannot apply for membership at this stage, but are welcome as mentors and
              partners. Other health-related programmes are considered alongside those listed below; General
              Psychology is not eligible.
            </p>
          </div>

          <h3 className='mt-8 font-mono text-label uppercase text-ink'>Eligible programmes</h3>
          <ul className='mt-4 grid gap-x-6 gap-y-1 font-body text-base md:text-md text-ink/80 sm:grid-cols-2'>
            {listed.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
