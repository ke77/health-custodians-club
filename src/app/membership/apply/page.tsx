import type { Metadata } from 'next'
import Link from 'next/link'
import { ApplicationFormLoader } from '@/components/membership/apply/application-form-loader'
import { minimumCgpa } from '@/lib/config/application'

export const metadata: Metadata = {
  title: 'Apply to join | Health Custodians Club',
  description:
    'Apply to join Health Custodians Club: seven short steps for tertiary students in the health sciences, Level 200 and above.',
}

export default function ApplyPage() {
  return (
    <section className='bg-paper'>
      <div className='container-site pt-16 pb-24 sm:pt-24 sm:pb-32'>
        <header className='grid gap-6 border-b border-rule pb-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-20 lg:pb-16'>
          <h1 className='heading-section text-ink lg:whitespace-nowrap'>Apply to join</h1>
          <div className='flex flex-col gap-4 lg:pt-3'>
            <p className='max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
              Seven short steps, about twenty minutes. Your answers are saved on this device as you go, so you can
              stop and come back to them.
            </p>
            <p className='font-body text-small text-muted'>
              For tertiary students in the health sciences, Level 200 and above, with a CGPA of at least{' '}
              {minimumCgpa.toFixed(2)} (or a CWA, where your institution uses one).{' '}
              <Link
                href='/membership#eligibility'
                className='font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink'
              >
                Check eligibility
              </Link>
            </p>
          </div>
        </header>

        <div className='mt-12 lg:mt-16'>
          <ApplicationFormLoader />
        </div>
      </div>
    </section>
  )
}
