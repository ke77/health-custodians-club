import Image from 'next/image'
import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'

// stand-in until the club supplies a closing photograph (D21): swap this one path
const PHOTO_SRC = '/hero-image.jpg'

// full-bleed photo band with a flat ink overlay (not a gradient: the gradient is the hero's alone)
export function ClosingCta() {
  return (
    <section id='join' className='relative isolate overflow-hidden bg-ink text-paper'>
      <Image
        src={PHOTO_SRC}
        alt=''
        fill
        sizes='100vw'
        className='-z-20 object-cover'
      />
      <div aria-hidden className='absolute inset-0 -z-10 bg-ink/75' />

      <div className='container-site py-24 sm:py-32'>
        <Reveal className='mx-auto flex max-w-4xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between md:gap-16'>
          <div>
            <h2 className='heading-section text-paper'>
              Ready to become a custodian?
            </h2>
            <p className='mt-6 max-w-[48ch] font-body text-base md:text-md text-paper/80 leading-7'>
              Applications open with each cohort. If you study a health science
              at Level 200 or above, we would like to hear from you.
            </p>
          </div>
          <Button
            href='/membership/apply'
            variant='primary'
            className='shrink-0 px-9 py-3.5 md:py-4 text-ink focus-visible:outline-paper'
            arrow
          >
            Apply to join
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
