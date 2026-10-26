import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { JourneyLadder } from '@/components/membership/journey-ladder'
import { membershipJourney } from '@/lib/config/membership-journey'

// the process as a visual sequence, on an ink band (same diagram as the homepage preview)
export function MembershipProcess() {
  return (
    <section id='process' className='bg-ink text-paper'>
      <div className='container-site py-24 sm:py-32'>
        <Reveal>
          <h2 className='heading-section text-paper'>From application to alumni</h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-lg text-paper/80'>
            Every member follows the same path, from a short online application to a place in the alumni network.
          </p>
        </Reveal>
        <Reveal className='mt-16 md:mt-20'>
          <JourneyLadder steps={membershipJourney} tone='dark' />
        </Reveal>
      </div>
    </section>
  )
}

// cohort model and regional heads, side by side on the cream wash (same layout as mission and vision on /about)
export function CohortAndRegions() {
  return (
    <section id='cohorts'>
      <div className='container-site grid gap-14 pt-24 pb-10 md:pt-28 md:pb-1 md:grid-cols-2 md:gap-16'>
        <Reveal>
          <p className='font-body text-2xl font-bold'>The cohort</p>
          {/*<h2 className='mt-4 font-body text-h3 font-semibold text-ink'>
            Two years, one certificate, then alumni for good.
          </h2>*/}
          <p className='mt-4 font-body text-base md:text-lg text-ink/70 leading-[1.7]'>
            Each cohort trains together for two years. At graduation, every member receives an official certificate.
            Graduation is not the end: alumni are always welcome to keep supporting the club, from mentoring new
            members to joining outreach in their region.
          </p>
        </Reveal>

        <Reveal index={1}>
          <p className='font-body text-2xl font-bold'>Regional heads</p>
          {/*<h2 className='mt-4 font-body text-h3 font-semibold text-ink'>A presiding head in every region.</h2>*/}
          <p className='mt-4 font-body text-base md:text-lg text-ink/70 leading-[1.7]'>
            Members are organised by region. Each of Ghana&rsquo;s 16 regions has a regional head who presides over
            members there, helps plan outreach in local schools, markets and communities, and works with the
            executives to check new applications.
          </p>
          <Link
            href='/about#regions'
            className='mt-5 inline-block font-body text-base font-medium text-ink underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
          >
            See the regions on the map
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
