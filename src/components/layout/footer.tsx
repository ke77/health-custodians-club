import Link from 'next/link'

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
      { href: '/faq', label: 'FAQ' },
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
      className='font-body text-small text-paper transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'
    >
      {label}
    </Link>
  )
}

// copyright year, cached so it is prerenderable under cache components (baked at build/revalidate)
async function copyrightYear() {
  'use cache'
  return new Date().getFullYear()
}

export async function Footer() {
  const year = await copyrightYear()

  return (
    <footer className='bg-ink text-paper'>
      <div className='mx-auto w-full max-w-[var(--container-wide)] px-4 py-16 sm:px-8 sm:py-20'>
        <div className='grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]'>
          <div className='flex flex-col gap-4'>
            <span className='font-display text-h3 text-paper'>
              Health Custodians Club
            </span>
            <p className='max-w-[32ch] font-body text-small text-paper/70'>
              Training health students to make health knowledge reach the people
              who need it.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} className='flex flex-col gap-4'>
              <p className='font-mono text-label uppercase text-paper/60'>
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

        {/* contact details and social handles render here from settings once available (docs/02, docs/05) */}

        <div className='mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between'>
          <p className='font-body text-small text-paper/70'>
            &copy; {year} Health Custodians Club
          </p>
          <div className='flex items-center gap-6'>
            <FooterLink href='/privacy' label='Privacy' />
            <FooterLink href='/terms' label='Terms' />
          </div>
        </div>
      </div>
    </footer>
  )
}
