import { Button } from '@/components/ui/buttons'

export function Hero() {
  return (
    <section className='relative flex min-h-[90vh] flex-col justify-end sm:justify-initial bg-ink text-paper bg-[url(/hero-image.jpg)] bg-cover bg-center bg-no-repeat'>
      {/* background photograph when supplied, otherwise the ink band shows through */}
      {/* {imageSrc && ( */}
        {/* <Image
          src='/hero-image.jpg'
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover'
        /> */}
      {/* // )} */}
      {/* the hero overlay is the only gradient allowed (dark, linear) */}
      <div
        aria-hidden
        className='absolute inset-0 bg-gradient-to-t from-ink to-ink/70'
      />

      <div className='relative z-10 flex min-h-[85vh] sm:min-h-[80vh] flex-col'>
        {/* <Navbar /> */}

        <div className='container-site flex flex-1 flex-col justify-end pt-16 pb-16 sm:pb-24'>
          <h1 className='max-w-[21ch] font-display text-display text-paper'>
            Most illness starts long before the hospital.
          </h1>
          <p className='mt-6 max-w-[var(--container-prose)] font-body text-body text-paper/85'>
            Health Custodians Club trains health students to close the gap between
            how people live every day and what they know about it.
          </p>
          <div className='mt-10 flex flex-row gap-3 md:gap-4 sm:items-center'>
            <Button href='#what-we-do' variant='primary' className='px-8 py-3.5 md:px-9 md:py-4 text-ink' arrow>
              What we do
            </Button>
            <Button href='/membership/apply' variant='secondary' className='px-9 py-3.5 md:px-9 md:py-4 text-ink'>
              Apply to join
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
