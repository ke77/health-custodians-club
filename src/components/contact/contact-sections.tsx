import type { ComponentType, ReactNode } from 'react'
import { Mail, Phone } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { audiences, contactDetails } from '@/lib/config/contact'
import { socialIcons } from '@/lib/config/socials'

// a value, or the honest placeholder until the club supplies it
function orToCome(value: ReactNode | null) {
  return value ?? <span className='text-muted'>To come</span>
}

const linkClass =
  'text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

// one contact detail: an outline icon (no border) beside a mono label and the value
function Detail({ icon: Icon, label, children }: { icon: ComponentType<{ className?: string }>; label: string; children: ReactNode }) {
  return (
    <div className='flex items-start gap-3'>
      <Icon className='mt-0.5 size-5 shrink-0 text-ink/70' aria-hidden />
      <div className='flex flex-col md:flex-row gap-2'>
        <p className='font-body text-lg md:text-lg font-semibold text-muted'>{label}: </p>
        <div className='font-body text-base md:text-md text-ink/80'>{children}</div>
      </div>
    </div>
  )
}


export function Audiences() {
  return (
    <section id='who'>
      <div className='container-site pt-6 pb-24 md:pt-8 md:pb-32'>
        <Reveal>
          <h1 className='heading-section text-ink'>Groups of particular interest</h1>
          <p className='mt-4 md:mt-5 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70'>
            Health knowledge reaches more people when more people carry it. There is a place here for each of you.
          </p>
        </Reveal>

        <ul className='mt-14 md:mt-20 grid grid-cols-1 gap-x-18 gap-y-14 sm:grid-cols-2 lg:grid-cols-3'>
          {audiences.map((a, i) => (
            <Reveal key={a.interest} as='li' index={i % 3} className='flex flex-col items-start gap-2'>
              <h2 className='font-body text-md md:text-lg font-semibold text-ink'>{a.title}</h2>
              <p className='font-body text-base md:text-md text-ink/70 leading-[1.6em]'>{a.pitch}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

// contact details on the left, the message form on the right (layout from reference/screenshots/contact-section2.png)
export function ContactSection() {
  const { email, phones, whatsapp } = contactDetails

  return (
    <section id='send-a-message' className='scroll-mt-6 bg-paper'>
      <div className='container-site grid gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20'>
        <Reveal className='flex flex-col items-start lg:self-start'>
          <h2 className='heading-section text-ink'>Let&rsquo;s talk</h2>
          <p className='mt-6 md:mt-8 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
            Whether you want to advise, partner, mentor or join, we would like to hear from you. Use the form, or
            reach us directly.
          </p>

          <div className='mt-10 flex flex-col gap-7'>
            <Detail icon={Mail} label='Email'>
              {orToCome(email ? <a href={`mailto:${email}`} className={linkClass}>{email}</a> : null)}
            </Detail>

            {/*<Detail icon={MapPin} label='Location'>
              {orToCome(location)}
            </Detail>*/}

            <Detail icon={Phone} label='Contacts'>
              {orToCome(
                phones.length || whatsapp.length ? (
                  <div className='flex flex-col gap-1'>
                    {phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className={linkClass}>
                        {p}
                      </a>
                    ))}
                    {whatsapp.map((w) => (
                      <a key={w} href={`https://wa.me/${w.replace(/[^\d]/g, '')}`} className={linkClass}>
                        {w} <span className='text-muted'>(WhatsApp)</span>
                      </a>
                    ))}
                  </div>
                ) : null,
              )}
            </Detail>
          </div>

          <div className='mt-10'>
            <p className='font-body text-lg md:text-2xl font-bold text-muted'>Socials</p>
            {socialIcons.length > 0 ? (
              <ul className='mt-3 flex items-center gap-3'>
                {socialIcons.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href !== '#' && { target: '_blank', rel: 'noreferrer' })}
                      aria-label={label}
                      className='flex size-11 items-center justify-center rounded-full border border-rule text-ink/80 transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
                    >
                      <Icon className='size-5' />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className='mt-3 block text-muted'>To come</span>
            )}
          </div>
        </Reveal>

        <Reveal index={1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
