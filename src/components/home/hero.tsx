import Image from 'next/image'
import { Button } from '@/components/ui/buttons'

// stand-in photograph (Dr Josiah Sarpong, Unsplash licence) until the club supplies its own group photo (D21)
const PHOTO_SRC = '/hero3.jpg'

export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] md:min-h-[90vh] flex-col justify-end sm:justify-initial bg-ink text-paper bg-[url('/hero3.jpg')] bg-cover bg-bottom-right">
      {/* <Image
        src={PHOTO_SRC}
        alt=''
        fill
        priority
        sizes='100vw'
        className='object-cover'
      /> */}
      {/* 
        the hero overlay is the only gradient allowed (dark, linear; look from reference/screenshots/altermate-hero.png).
        md and up: darkest behind the text on the left, easing off to the right.
        phones: the text sits low and spans the width, so the dark end is at the bottom instead
      */}
      <div
        aria-hidden
        className='absolute inset-0 bg-linear-to-t from-ink/40 via-ink/80 to-ink/1 md:bg-linear-to-r md:from-ink/50 md:to-ink/70'
      />

      <div className='relative z-10 flex min-h-[83vh] sm:min-h-[80vh] flex-col'>
        {/* <Navbar /> */}

        <div className='container-site flex flex-1 flex-col justify-end pt-10 pb-16 sm:pb-24'>
          <h1 className='max-w-[21ch] font-display text-display text-paper'>
            Most illness starts long before the hospital.
          </h1>
          <p className='mt-6 max-w-[var(--container-prose)] font-body text-body text-paper/85'>
            Health Custodians Club trains health students to close the gap between
            how people live every day and what they know about it.
          </p>
          <div className='mt-10 flex flex-row gap-3 md:gap-4 sm:items-center'>
            <Button href='#what-we-do' variant='primary' className='flex-1 whitespace-nowrap px-4 py-3.5 sm:flex-none sm:px-8 md:px-9 md:py-4 text-ink' arrow>
              What we do
            </Button>
            <Button href='#' variant='dark' className='flex-1 whitespace-nowrap px-4 py-3.5 sm:flex-none sm:px-9 md:py-4 text-ink'>
              Apply to join
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
