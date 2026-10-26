import { Button } from '@/components/ui/buttons'
import { HeroCarousel } from '@/components/home/hero-carousel'
import type { HeroSlide } from '@/components/home/hero-carousel'

// stand-in photographs (Unsplash licence) until the club supplies its own photos (D21). add or remove a line to change the carousel
const slides: HeroSlide[] = [
  { src: '/hero4.jpg', position: 'right bottom' },
  { src: '/hero3.jpg' },
  { src: '/hero-students.jpg', position: 'center 40%' },
  { src: '/hero-image.jpg' },
]

export function Hero() {
  return (
    <section className='relative flex min-h-[70vh] md:min-h-[85vh] flex-col justify-end sm:justify-initial bg-ink text-paper'>
      <HeroCarousel slides={slides} />
      {/*
        the hero overlay is the only gradient allowed (dark, linear; look from reference/screenshots/altermate-hero.png).
        md and up: darkest behind the text on the left, easing off to the right.
        phones: the text sits low and spans the width, so the dark end is at the bottom instead
      */}
      <div
        aria-hidden
        className='absolute inset-0 bg-linear-to-t from-ink/40 via-ink/80 to-ink/1 md:bg-linear-to-r md:from-ink/40 md:to-ink/60'
      />

      <div className='relative z-10 flex min-h-[83vh] sm:min-h-[80vh] flex-col'>
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
            <Button href='/membership/apply' variant='secondary' className='flex-1 whitespace-nowrap px-4 py-3.5 sm:flex-none sm:px-9 md:py-4'>
              Apply to join
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
