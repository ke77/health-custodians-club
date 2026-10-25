'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRightToLine, X } from 'lucide-react'
import { AnimatePresence, motion, stagger, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { Button } from '@/components/ui/buttons'
// import { Logo } from '@/components/layout/logo'
import { easeOut, menu } from '@/lib/config/motion'
import { HiArrowRight } from 'react-icons/hi'
import Image from 'next/image';

const links = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Programs' },
  { href: '#', label: 'Membership' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Blog' },
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

// the panel drops down like a curtain, then the links rise in one after another
const panel: Variants = {
  closed: {
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: menu.duration * 0.75, ease: easeOut },
  },
  open: {
    clipPath: 'inset(0 0 0% 0)',
    transition: {
      duration: menu.duration,
      ease: easeOut,
      delayChildren: stagger(menu.stagger, { startDelay: menu.duration * 0.4 }),
    },
  },
}

// reduced motion: a plain fade, no curtain and no rising links
const panelReduced: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}

const item: Variants = {
  closed: { opacity: 0, y: menu.linkDistance },
  open: { opacity: 1, y: 0, transition: { duration: menu.duration, ease: easeOut } },
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

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
    <header className='sticky top-0 z-30  bg-paper/95 backdrop-blur-sm'>
      <nav
        aria-label='Primary'
        className='container-site flex items-center justify-between py-4 md:py-2 lg:grid lg:grid-cols-3'
      >
        {/*<Logo className='lg:justify-self-start' />*/}
        <Image src='/logo.png' className='lg:justify-self-start bg-transparent md:w-16' width={40} height={20} alt='site-logo' />

        <ul className='hidden items-center gap-8 lg:flex lg:justify-self-center'>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className='font-body text-base text-ink/80 transition-colors hover:text-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper'
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className='hidden lg:flex lg:justify-self-end'>
          <Button variant='dark' href='/membership/apply' className='rounded-lg text-sm px-14'>
            Apply
          </Button>
        </div>

        <button
          type='button'
          onClick={() => setOpen(true)}
          aria-label='Open menu'
          aria-expanded={open}
          aria-controls='mobile-menu'
          className='flex size-11 items-center justify-end text-ink lg:hidden'
        >
          <MenuIcon />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key='mobile-menu'
            id='mobile-menu'
            role='dialog'
            aria-modal='true'
            aria-label='Menu'
            variants={reduceMotion ? panelReduced : panel}
            initial='closed'
            animate='open'
            exit='closed'
            className='fixed inset-0 z-50 flex flex-col bg-paper lg:hidden'
          >
            <div className='container-site flex items-center justify-between py-4'>
              {/*<Logo onClick={() => setOpen(false)} />*/}
              <Image src='/logo.png' className='lg:justify-self-start bg-transparent md:w-16' width={40} height={20} alt='site-logo' />
              <button
                type='button'
                onClick={() => setOpen(false)}
                aria-label='Close menu'
                autoFocus
                className='flex size-11 items-center justify-end text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
              >
                <X className='size-6' aria-hidden />
              </button>
            </div>
            <nav aria-label='Mobile' className='container-site flex flex-1 flex-col gap-2 pt-11'>
              {links.map((l) => (
                <motion.div key={l.href} variants={reduceMotion ? undefined : item}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className='block border-b border-rule/50 py-4 font-display text-h2 text-ink hover:text-ink/60'
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={reduceMotion ? undefined : item} className='pt-16 flex justify-center'>
                <Link href='#' className='group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 font-body text-md text-ink/80'>
                  Apply to join
                  <HiArrowRight />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
