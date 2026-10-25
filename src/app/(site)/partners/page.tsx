import type { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/buttons'
import { Reveal } from '@/components/ui/reveal'
import { getPartners } from '@/lib/data/partners'

export const metadata: Metadata = {
  title: 'Partners | Health Custodians Club',
  description: 'The institutions and organisations supporting the Health Custodians Club.',
}

export default async function PartnersPage() {
  const partners = await getPartners()

  return (
    <section>
      <div className='container-site pt-6 pb-24 md:pt-5 md:pb-32'>
        <Reveal>
          <h1 className='heading-section text-ink'>Partners</h1>
          {partners.length > 0 ? (
            <p className='mt-4 md:mt-5 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
              The institutions and organisations working with us to bring health knowledge to more people.
            </p>
          ) : (
            <div className='mt-5 max-w-[var(--container-prose)]'>
              <p className='font-body text-base md:text-md text-ink/70 leading-[1.7]'>
                We are building partnerships with institutions and organisations that want to support health
                education and outreach across Ghana. If that sounds like you, we would love to talk.
              </p>
              <div className='mt-8'>
                <Button href='/contact' variant='link' arrow>
                  Get in touch
                </Button>
              </div>
            </div>
          )}
        </Reveal>

        {partners.length > 0 && (
          <ul className='mt-14 md:mt-20 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4'>
            {partners.map((p, i) => {
              const inner = p.logoUrl ? (
                <Image
                  src={p.logoUrl}
                  alt={p.name}
                  width={220}
                  height={120}
                  className='max-h-16 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100'
                />
              ) : (
                <span className='font-body text-base font-medium text-ink/80'>{p.name}</span>
              )
              return (
                <Reveal key={p.id} as='li' index={i % 4} className='flex items-center justify-center'>
                  {p.url ? (
                    <a
                      href={p.url}
                      target='_blank'
                      rel='noreferrer'
                      aria-label={p.name}
                      className='group flex h-28 w-full items-center justify-center rounded-sm border border-rule px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className='group flex h-28 w-full items-center justify-center rounded-sm border border-rule px-4'>{inner}</div>
                  )}
                </Reveal>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
