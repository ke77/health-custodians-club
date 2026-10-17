'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// public menu links (docs/02). the admin link is added far right only once the dashboard is finished.
const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/membership', label: 'Membership' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/partners', label: 'Partners' },
]

// wordmark stands in for the logo until it is added under public/brand/ (text wordmark in Newsreader, docs/02).
function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href='/'
      onClick={onClick}
      className='font-display text-h3 text-paper'
    >
      <span className='sm:hidden'>HCC</span>
      <span className='hidden sm:inline'>Health Custodians Club</span>
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  // close the full-screen menu on escape, and lock body scroll while it is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className='relative z-20'>
      <nav className='mx-auto flex w-full max-w-[var(--container-wide)] items-center justify-between gap-6 px-4 py-5 sm:px-8'>
        <Wordmark />

        {/* desktop navigation */}
        <div className='hidden items-center gap-8 lg:flex'>
          <ul className='flex items-center gap-6'>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className='font-body text-small text-paper/90 transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper'
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href='/membership/apply' variant='secondaryLight' className='px-4 py-2'>
            Apply
          </Button>
        </div>

        {/* mobile toggle */}
        <button
          type='button'
          onClick={() => setOpen(true)}
          aria-label='Open menu'
          aria-expanded={open}
          className='flex size-11 items-center justify-center text-paper lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'
        >
          <Menu className='size-6' aria-hidden />
        </button>
      </nav>

      {/* full-screen mobile menu (docs/02: a full-screen panel, not a small dropdown) */}
      {open && (
        <div className='fixed inset-0 z-50 flex flex-col bg-ink lg:hidden'>
          <div className='flex items-center justify-between px-4 py-5 sm:px-8'>
            <Wordmark onClick={() => setOpen(false)} />
            <button
              type='button'
              onClick={() => setOpen(false)}
              aria-label='Close menu'
              className='flex size-11 items-center justify-center text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'
            >
              <X className='size-6' aria-hidden />
            </button>
          </div>
          <nav className='flex flex-1 flex-col gap-2 px-4 pt-8 sm:px-8'>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className='border-b border-paper/15 py-4 font-display text-h2 text-paper'
              >
                {l.label}
              </Link>
            ))}
            <div className='pt-8'>
              <Button
                href='/membership/apply'
                variant='secondaryLight'
                arrow
              >
                Apply to join
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
