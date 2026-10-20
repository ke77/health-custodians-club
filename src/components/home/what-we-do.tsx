import { Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'

export function WhatWeDo() {
  return (
    <section id='what-we-do' className='bg-paper'>
      <div className='container-site grid gap-12 py-24 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-16'>
        <Reveal className='flex flex-col items-start'>
          <h2 className='heading-section text-ink'>
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
        </Reveal>

        <Reveal index={1} className='flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-md border border-rule shadow-image'>
          <ImageIcon className='size-10 text-muted' aria-hidden />
          <span className='font-mono text-label uppercase text-muted'>
            Photo to come
          </span>
        </Reveal>
      </div>
    </section>
  )
}
