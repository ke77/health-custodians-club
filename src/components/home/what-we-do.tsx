import { Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/buttons'

export function WhatWeDo() {
  return (
    <section id='what-we-do' className='bg-paper'>
      <div className='container-site grid gap-12 py-24 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-16'>
        <div className='flex flex-col items-start'>
          <h2 className='w-full max-w-full text-wrap md:max-w-[24ch] font-bold font-sans text-h1 text-ink tracking-[.03em] leading-9 md:leading-14'>
            Making health knowledge simple enough to use.
          </h2>
          <p className='mt-8 max-w-[var(--container-prose)] font-body text-body text-muted'>
            Health Custodians Club trains students from across the health
            sciences in communication, leadership, languages and research &mdash;
            the skills a degree rarely teaches. Members use them to study the
            health problems around them and to explain health plainly, in the
            languages people speak, in schools, markets and rural communities.
          </p>
          <div className='mt-8'>
            <Button href='/about' variant='link' arrow>
              More about HCC
            </Button>
          </div>
        </div>

        <div className='flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-md border border-rule'>
          <ImageIcon className='size-10 text-muted' aria-hidden />
          <span className='font-mono text-label uppercase text-muted'>
            Photo to come
          </span>
        </div>
      </div>
    </section>
  )
}
