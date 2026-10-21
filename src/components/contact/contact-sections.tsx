import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { WriteToUsLink } from '@/components/contact/write-to-us-link'
import { audiences, contactDetails } from '@/lib/config/contact'

const socialLabels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', x: 'X' } as const

// a value, or the honest placeholder until the club supplies it
function orToCome(value: ReactNode | null) {
  return value ?? <span className='text-muted'>To come</span>
}

const linkClass =
  'text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

// heading and intro left; the club's details as ruled rows right (same pattern as membership eligibility)
export function ContactIntro() {
  const { email, phones, whatsapp, socials } = contactDetails
  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Email', value: orToCome(email ? <a href={`mailto:${email}`} className={linkClass}>{email}</a> : null) },
    {
      label: 'Phone',
      value: orToCome(
        phones.length
          ? phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className={`${linkClass} block`}>
                {p}
              </a>
            ))
          : null,
      ),
    },
    {
      label: 'WhatsApp',
      value: orToCome(
        whatsapp.length
          ? whatsapp.map((w) => (
              <a key={w} href={`https://wa.me/${w.replace(/[^\d]/g, '')}`} className={`${linkClass} block`}>
                {w}
              </a>
            ))
          : null,
      ),
    },
    {
      label: 'Socials',
      value: orToCome(
        socials.length ? (
          <span className='flex flex-wrap gap-x-5 gap-y-1'>
            {socials.map((s) => (
              <a key={s.platform} href={s.href} className={linkClass}>
                {socialLabels[s.platform]}
              </a>
            ))}
          </span>
        ) : null,
      ),
    },
  ]

  return (
    <section className='bg-paper'>
      <div className='container-site grid gap-14 py-16 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20'>
        <Reveal className='flex flex-col items-start lg:self-start'>
          <h1 className='heading-section text-ink'>Get in touch</h1>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
            Whether you want to advise, partner, mentor or join, we would like to hear from you. Write to us below,
            or use the details here.
          </p>
        </Reveal>

        <Reveal index={1}>
          <h2 className='font-mono text-label uppercase text-muted'>Contact details</h2>
          <dl className='mt-4 border-t border-ink'>
            {rows.map((r) => (
              <div key={r.label} className='grid gap-2 border-b border-rule py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6'>
                <dt className='font-mono text-label uppercase text-ink sm:pt-1'>{r.label}</dt>
                <dd className='font-body text-base md:text-md text-ink/80'>{r.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

// a short pitch per audience, laid out like "Beyond the curriculum" on the homepage
export function Audiences() {
  return (
    <section id='who' className='bg-cream/20'>
      <div className='container-site py-24 sm:py-32'>
        <Reveal>
          <h2 className='heading-section text-ink'>Who we would like to hear from</h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            Health knowledge reaches more people when more people carry it. There is a place here for each of you.
          </p>
        </Reveal>

        <ul className='mt-14 md:mt-20 grid grid-cols-1 gap-x-18 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
          {audiences.map((a, i) => (
            <Reveal key={a.interest} as='li' index={i % 3} className='flex flex-col items-start gap-2'>
              <h3 className='font-body text-md md:text-lg font-semibold text-ink'>{a.title}</h3>
              <p className='font-body text-base md:text-md text-ink/70 leading-[1.6em]'>{a.pitch}</p>
              <div className='mt-2'>
                <WriteToUsLink interest={a.interest} audience={a.title} />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

// the message form: heading left (sticky on desktop), form right, like the FAQ section
export function MessageSection() {
  return (
    <section id='send-a-message' className='scroll-mt-6 bg-paper'>
      <div className='container-site grid gap-12 py-24 sm:py-32 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-20'>
        <Reveal className='flex flex-col items-start lg:sticky lg:top-24 lg:self-start'>
          <h2 className='heading-section text-ink'>Send us a message</h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            We read every message and reply by email.
          </p>
        </Reveal>
        <Reveal index={1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
