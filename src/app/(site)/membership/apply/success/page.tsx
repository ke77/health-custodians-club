import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/buttons'

export const metadata: Metadata = {
  title: 'Application received | Health Custodians Club',
  robots: { index: false, follow: false },
}

const referencePattern = /^HCC-\d{4}-\d{4}$/

// the reference comes from the URL (runtime data), so it streams in behind a boundary
async function Reference({ search }: { search: Promise<{ ref?: string }> }) {
  const { ref } = await search
  const reference = ref && referencePattern.test(ref) ? ref : null
  if (!reference) return null
  return (
    <div className='mt-8'>
      <p className='font-body text-base text-ink/70'>Your reference number is</p>
      <p className='mt-2 inline-block rounded-sm bg-sand px-5 py-3 font-mono text-h3 text-ink'>{reference}</p>
    </div>
  )
}

// DRAFT next-steps copy (docs/04-application-form.md, O09). no dates and no interview promised.
export default function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <section className='bg-paper'>
      <div className='container-site flex min-h-[70vh] flex-col justify-center py-24 sm:py-32'>
        <div className='max-w-[var(--container-prose)]'>
          <p className='font-mono text-label uppercase text-muted'>Application received</p>
          <h1 className='mt-4 heading-section text-ink'>Thank you. Your application is in.</h1>

          <Suspense fallback={null}>
            <Reference search={searchParams} />
          </Suspense>

          <div className='mt-8 flex flex-col gap-4 font-body text-base md:text-md text-ink/80 leading-[1.7]'>
            <p>
              Please keep your reference number. We will review applications and contact you by email, so check your
              inbox and spam folder.
            </p>
            <p>
              If you do not hear from us within a few weeks, write to us and quote your reference number. A
              confirmation email is on its way to you now.
            </p>
          </div>

          <div className='mt-10 flex flex-wrap gap-4'>
            <Button href='/' variant='primary' className='px-8 py-3.5 text-ink'>
              Back to home
            </Button>
            <Button href='/contact' variant='link'>
              Write to us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
