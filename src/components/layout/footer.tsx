import Link from 'next/link'
import { socialIcons as socials } from '@/lib/config/socials'

type FooterLink = { href: string; label: string }

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
        {/* phones: one column. tablet: brand on its own row above three even columns. desktop: brand left, columns right */}
        <div className='flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16'>
          <div className='flex flex-col gap-5'>
            <span className='font-sans text-h2 text-ink/80 font-semibold'>
              Health Custodians Club
            </span>
            <p className='max-w-[36ch] font-body text-base text-ink/70 leading-7'>
              Training health students to make health knowledge reach the people
              who need it.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-x-8 md:gap-x-12 lg:gap-x-16 xl:gap-x-28'>
            {columns.map((col) => (
              <nav key={col.heading} className='flex flex-col gap-5'>
                <p className='font-mono font-semibold uppercase text-base text-ink'>
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
          md and up: copyright left; legal links, divider and socials on the right. type is smaller at tablet
          width so the legal links stay on one line each, and the row wraps as a whole rather than the links.
        */}
        <div className='mt-10 flex flex-col gap-2 border-t border-rule/50 pt-8 md:mt-20 md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-4 md:border-t-0 lg:mt-24'>
          <p className='order-last font-body text-small text-ink/70 md:order-none md:mr-auto md:text-ink/80 lg:text-base'>
            &copy; {year} Health Custodians Club
          </p>
          <div className='mt-3 flex shrink-0 items-center gap-3 md:mt-0'>
            <Link href='/privacy-policy' className='whitespace-nowrap text-ink/70 text-small transition-colors hover:text-ink lg:text-base'>Privacy Policy</Link>
            <Link href='/terms-of-service' className='whitespace-nowrap text-ink/70 text-small transition-colors hover:text-ink lg:text-base'>Terms of Service</Link>
          </div>
          {socials.length > 0 && (
            <>
              <span className='hidden h-7 w-px bg-ink/60 md:block' aria-hidden />
              <ul className='order-first mb-2 flex shrink-0 items-center gap-5 md:order-none md:mb-0'>
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href !== '#' && { target: '_blank', rel: 'noreferrer' })}
                      aria-label={label}
                      className='block text-ink/80 transition-opacity hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
                    >
                      <Icon className='size-5' />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </footer>
  )
}
