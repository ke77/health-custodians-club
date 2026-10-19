import { Button } from '@/components/ui/buttons'
import { JourneyLadder } from '@/components/membership/journey-ladder'

const stages = [
  { title: 'Apply', caption: 'A short seven-step form, open for each cohort.' },
  { title: 'Review', caption: 'Admins read every answer and cross-check with regional reps.' },
  { title: 'Admission', caption: 'Accepted members receive a welcome email with next steps.' },
  { title: 'Cohort', caption: 'Two years of Saturday training and community outreach.' },
  { title: 'Certificate', caption: 'An official certificate on graduation.' },
  { title: 'Alumni', caption: 'Stay close, mentor the next intake, keep the work going.' },
]

export function MembershipPreview() {
  return (
    <section id='membership' className='bg-ink/90 text-paper'>
      <div className='container-site py-24 sm:py-32'>
        <div className='grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16'>
          <div>
            <h2 className='mt-4 w-full max-w-full text-wrap md:max-w-[24ch] font-bold font-sans text-h1 tracking-[.03em] leading-9 md:leading-14'>
              Two years of training, then alumni for good.
            </h2>
          </div>
          <p className='font-body text-base lg:max-w-[52ch] leading-7'>
            Members train together for two years and graduate with an official
            certificate. Alumni stay close, we mentor the next intake,
            supporting outreach in the regions, and keeping the work going long
            after the cohort ends.
          </p>
        </div>

        <div className='mt-16 border-t border-rule pt-12 sm:mt-20 sm:pt-16'>
          <JourneyLadder steps={stages} />
        </div>

        <div className='mt-16 flex flex-col items-start gap-4 sm:mt-20 sm:flex-row sm:items-center sm:justify-between'>
          <p className='max-w-[48ch] font-body text-base leading-7'>
            Open to tertiary students in the health sciences, Level 200 and
            above.
          </p>
          <Button href='/membership/apply' variant='link' className='mt-5 text-paper' arrow>
            Apply to join
          </Button>
        </div>
      </div>
    </section>
  )
}
