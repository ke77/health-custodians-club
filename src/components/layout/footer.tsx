import type { ComponentType } from 'react'
import Link from 'next/link'
import { FaLinkedinIn, FaFacebook, FaInstagram } from 'react-icons/fa6'

type FooterLink = { href: string; label: string }

const socials: { label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: 'Instagram', href: '#', Icon: FaInstagram },
  { label: 'Facebook', href: '#', Icon: FaFacebook },
  { label: 'LinkedIn', href: '#', Icon: FaLinkedinIn },
]

const columns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/programs', label: 'Programs' },
      { href: '/membership', label: 'Membership' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'More',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/partners', label: 'Partners' },
      { href: '/membership#faq', label: 'FAQ' },
    ],
  },
  {
    heading: 'Get in touch',
    links: [
      { href: '/contact', label: 'Contact us' },
      { href: '/membership/apply', label: 'Apply to join' },
    ],
  },
]

function FooterLink({ href, label }: FooterLink) {
  return (
    <Link
      href={href}
      className='font-body text-base text-ink/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
    >
      {label}
    </Link>
  )
}

async function copyrightYear() {
  'use cache'
  return new Date().getFullYear()
}

export async function Footer() {
  const year = await copyrightYear()

  return (
    <footer className='bg-paper text-ink/90'>
      <div className='container-site pt-18 md:pt-6 md:mt-14 pb-14 md:pb-16'>
        <div className='flex sm:flex-row flex-col justify-between'>
          <div className='flex flex-col gap-5'>
            <span className='font-sans text-h2 text-ink/80 font-semibold'>
              Health Custodians Club
            </span>
            <p className='max-w-[36ch] font-body text-base text-ink/70 leading-7'>
              Training health students to make health knowledge reach the people
              who need it.
            </p>
          </div>

          <div className="flex flex-col md:flex-wrap sm:flex-row justify-between gap-18 sm:gap-42 mt-12 md:mt-0">

            {columns.map((col) => (
              <nav key={col.heading} className='flex flex-col gap-5'>
                <p className='font-mono uppercase text-base text-ink'>
                  {col.heading}
                </p>
                <ul className='flex flex-col gap-3'>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <FooterLink {...l} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/*
          phones: three short left-aligned rows: socials, the legal links on one line, then the copyright.
          md and up: copyright left; legal links, divider and socials on the right.
        */}
        <div className='mt-10 flex flex-col gap-2 border-t border-rule/50 pt-8 md:mt-24 md:flex-row md:items-center md:gap-5 md:border-t-0'>
          <p className='order-last font-body text-small text-ink/70 md:order-none md:mr-auto md:text-base md:text-ink/80'>
            &copy; {year} Health Custodians Club
          </p>
          <div className='mt-3 md:mt-0 flex items-center gap-3 md:gap-3'>
            <Link href='/privacy-policy' className='text-ink/70 text-small md:text-base transition-colors hover:text-ink'>Privacy Policy</Link>
            <Link href='/terms-of-service' className='text-ink/70 text-small md:text-base hover:text-ink transition-colors'>Terms of Service</Link>
          </div>
          <span className='hidden md:block h-7 w-px bg-ink/60' aria-hidden />
          <ul className='order-first mb-2 flex items-center gap-5 md:order-none md:mb-0'>
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className='block text-ink/80 transition-opacity hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
                >
                  <Icon className='size-5' />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
