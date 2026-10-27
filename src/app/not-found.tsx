import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/buttons'

export const metadata: Metadata = {
  title: 'Page not found | Health Custodians Club',
  robots: { index: false },
}

const quickLinks = [
  { href: '/about', label: 'About the club' },
  { href: '/membership', label: 'Membership' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact us' },
]

/*
  shown for any address that does not exist, and when a page calls notFound() (an unknown blog post, say).
  it sits at the app root, so it brings its own navbar and footer.
*/
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className='flex flex-1 flex-col'>
        <section className='container-site flex flex-1 flex-col justify-center py-24 md:py-32'>
          <p className='font-mono text-label uppercase tracking-[0.2em] text-muted'>Error 404</p>
          <h1 className='heading-section mt-5 text-ink'>We could not find that page.</h1>
          <p className='mt-6 max-w-[var(--container-prose)] font-body text-base md:text-md text-ink/70 leading-[1.7]'>
            The address may have changed, or the page may never have existed. Head back to the start, or pick up
            from one of the places below.
          </p>

          <div className='mt-10 flex flex-wrap gap-2'>
            <Button href='/' variant='primary' arrow className='px-8 md:px-9 py-4'>
              Back to home
            </Button>
            <Button href='/contact' variant='link' className='px-8 md:px-9'>
              Tell us about it
            </Button>
          </div>

          <nav aria-label='Pages you might want' className='mt-16 border-t border-rule pt-8 md:mt-20'>
            <ul className='flex flex-wrap gap-x-8 gap-y-3'>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='rounded-xs font-body text-base text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
      <Footer />
    </>
  )
}
