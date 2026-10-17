import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'

type Props = {
  // the club supplies the hero photograph later. until then the background is a dark ink band, no stock image (docs/02).
  imageSrc?: string
}

export function Hero({ imageSrc }: Props) {
  return (
    <section className='relative flex min-h-[85vh] flex-col bg-ink text-paper'>
      {/* background photograph when supplied, otherwise the ink band shows through */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover'
        />
      )}
      {/* the hero overlay is the only gradient allowed (dark, linear) */}
      <div
        aria-hidden
        className='absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40'
      />

      <div className='relative z-10 flex min-h-[85vh] flex-col'>
        <Navbar />

        <div className='mx-auto flex w-full max-w-[var(--container-wide)] flex-1 flex-col justify-end px-4 pt-16 pb-16 sm:px-8 sm:pb-24'>
          <h1 className='max-w-[18ch] font-display text-display text-paper'>
            Most illness starts long before the hospital.
          </h1>
          <p className='mt-6 max-w-[var(--container-prose)] font-body text-body text-paper/85'>
            Health Custodians Club trains health students to close the gap between
            how people live every day and what they know about it.
          </p>
          <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Button href='#what-we-do' variant='primary' arrow>
              What we do
            </Button>
            <Button href='/membership/apply' variant='secondaryLight'>
              Apply to join
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
