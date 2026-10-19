'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/membership', label: 'Membership' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  // { href: '/partners', label: 'Partners' },
]

function MenuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 items-end justify-center group cursor-pointer ${className}`}>
      <span className="h-0.5 bg-ink/70 rounded-full w-6 transition-all duration-300"></span>
      <span className="h-0.5 bg-ink/60 rounded-full w-4 transition-all duration-300 group-hover:w-5"></span>
      <span className="h-0.5 bg-ink/60 rounded-full w-2.5 transition-all duration-300 group-hover:w-6"></span>
    </div>
  );
}

function Wordmark({
  onClick,
  className,
}: {
  onClick?: () => void
  className?: string
}) {
  return (
    <Link
      href='/'
      onClick={onClick}
      className={cn('font-display text-h3 text-ink', className)}
    >
      <span>HCC</span>
      {/* <span className='hidden sm:inline'>Health Custodians Club</span> */}
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

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
    <header className='sticky z-20 bg-paper text-ink'>
      <nav
        aria-label='Primary'
        className='container-site flex items-center justify-between py-4 lg:grid lg:grid-cols-3'
      >
        <Wordmark className='lg:justify-self-start' />

        <ul className='hidden items-center gap-8 lg:flex lg:justify-self-center'>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className='font-body text-base text-ink/80 transition-colors hover:text-ink/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper'
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className='hidden lg:flex lg:justify-self-end'>
          <Button variant='primary' href='/membership/apply' className='rounded-lg text-sm px-14'>
            Apply
          </Button>
        </div>

        <button
          type='button'
          onClick={() => setOpen(true)}
          aria-label='Open menu'
          aria-expanded={open}
          className='flex items-center justify-center text-ink lg:hidden transition-all duration-300'
        >
          {/* <Menu className='size-6' aria-hidden /> */}
          <MenuIcon />
        </button>
      </nav>

      {open && (
        <div className='fixed inset-0 z-50 flex flex-col bg-paper lg:hidden'>
          <div className='container-site flex items-center justify-between py-5'>
            <Wordmark onClick={() => setOpen(false)} />
            <button
              type='button'
              onClick={() => setOpen(false)}
              aria-label='Close menu'
              className='flex size-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'
            >
              <X className='size-6' aria-hidden />
            </button>
          </div>
          <nav className='container-site flex flex-1 flex-col gap-2 pt-8 transition-all duration-300'>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className='border-b border-rule py-4 font-display text-h2 text-ink hover:text-ink/60'
              >
                {l.label}
              </Link>
            ))}
            <div className='pt-8'>
              <Button href='/membership/apply' variant='primary' className='w-full bg-transparent md:px-9 py-4 text-ink' arrow>
                Apply to join
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
