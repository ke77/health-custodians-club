import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'
import { JourneyLadder } from '@/components/membership/journey-ladder'
import { membershipJourney } from '@/lib/config/membership-journey'

export function MembershipPreview() {
  return (
    <section id='membership' className='bg-ink/95 text-paper'>
      <div className='container-site py-24 sm:py-32'>
        <Reveal className='grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16'>
          <div>
            <h2 className='mt-4 heading-section text-paper'>
              Two years of training, then alumni for good.
            </h2>
          </div>
          <p className='font-body text-base md:text-body text-paper/80 lg:max-w-[60ch] leading-8'>
            Members train together for two years and graduate with an official
            certificate. Alumni stay close, we mentor the next intake,
            supporting outreach in the regions, and keeping the work going long
            after the cohort ends.
          </p>
        </Reveal>

        <Reveal className='mt-16 md:mt-18 pt-12 sm:mt-20 sm:pt-16'>
          <JourneyLadder steps={membershipJourney} tone='dark' />
        </Reveal>

        <Reveal className='mt-16 flex flex-col items-start gap-4 sm:mt-26 sm:flex-row sm:items-center sm:justify-between'>
          <p className='max-w-[48ch] font-body text-base text-paper/80 leading-7'>
            The club is open to tertiary students in the health sciences, Level 200 and
            above.
          </p>
          <Button href='#' variant='link' className='mt-5 text-paper focus-visible:outline-paper' arrow>
            Apply to join
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
