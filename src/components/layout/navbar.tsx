'use client'

import { Suspense, useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRightToLine, X } from 'lucide-react'
import { AnimatePresence, motion, stagger, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { Button } from '@/components/ui/buttons'
// import { Logo } from '@/components/layout/logo'
import { easeOut, menu } from '@/lib/config/motion'
import { MoveRight } from 'lucide-react'
import { MenuIcon } from '@/components/layout/menu-icon'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/membership', label: 'Membership' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  // { href: '/partners', label: 'Partners' },
]

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

/*
  whether the navbar should show its shadow: once the page has scrolled past the hero (the homepage marks its hero
  with data-hero), or, on pages with no hero, as soon as it has scrolled a little. no shadow at the top of the page.
*/
function subscribeScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  window.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('scroll', onChange)
    window.removeEventListener('resize', onChange)
  }
}

function pastHero() {
  const hero = document.querySelector('[data-hero]')
  if (!hero) return window.scrollY > 8
  const headerHeight = document.querySelector('[data-site-header]')?.getBoundingClientRect().height ?? 0
  return hero.getBoundingClientRect().bottom <= headerHeight
}

// the home link only matches the home page; every other link also matches the pages under it (/blog/some-post)
function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

type NavLinkProps = {
  href: string
  label: string
  // classes every state shares, then the extra classes for the current page and for every other page
  base: string
  active: string
  inactive: string
  onClick?: () => void
}

function CurrentAwareLink({ href, label, base, active, inactive, onClick }: NavLinkProps) {
  const pathname = usePathname()
  const current = isActive(pathname, href)
  return (
    <Link href={href} onClick={onClick} aria-current={current ? 'page' : undefined} className={cn(base, current ? active : inactive)}>
      {label}
    </Link>
  )
}

/*
  a nav link that knows if it is the current page. the current path is only known at request time on dynamic routes
  (/blog/[slug]), so reading it has to sit inside a Suspense boundary or the whole layout cannot be prerendered.
  until the path is known the link shows in its normal, inactive style.
*/
function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} onClick={props.onClick} className={cn(props.base, props.inactive)}>
          {props.label}
        </Link>
      }
    >
      <CurrentAwareLink {...props} />
    </Suspense>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useSyncExternalStore(subscribeScroll, pastHero, () => false)
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
    <>
    <header
      data-site-header
      className={cn(
        'sticky top-0 z-30 bg-paper/95 backdrop-blur-xs transition-shadow duration-300 motion-reduce:transition-none',
        scrolled ? 'shadow-md' : 'shadow-none',
      )}
    >
      <nav
        aria-label='Primary'
        className='container-site flex items-center justify-between py-4 md:py-2 lg:grid lg:grid-cols-3'
      >
        {/*<Logo className='lg:justify-self-start' />*/}
        <Image src='/logo.png' className='lg:justify-self-start bg-transparent md:w-16' width={40} height={20} alt='site-logo' />

        <ul className='hidden items-center gap-8 lg:flex lg:justify-self-center'>
          {links.map((l) => (
            <li key={l.href}>
              {/* the current page is a lighter ink, nothing louder */}
              <NavLink
                href={l.href}
                label={l.label}
                base='font-body text-base md:text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper'
                active='text-ink/50'
                inactive='text-ink/80 hover:text-primary/60'
              />
            </li>
          ))}
        </ul>

        <div className='hidden items-center gap-6 lg:flex lg:justify-self-end'>
          <Button variant='secondary' href='/membership/apply' className='rounded-lg text-base px-14 py-3'>
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
    </header>

      {/*
        outside the header on purpose: the header has a backdrop blur, and a backdrop filter makes it the containing
        block for `fixed` children, which shrinks this full-screen panel to the height of the header bar
      */}
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
                  <NavLink
                    href={l.href}
                    label={l.label}
                    onClick={() => setOpen(false)}
                    base='block border-b border-rule/50 py-4 font-display text-h2 hover:text-ink/60'
                    active='text-ink/50'
                    inactive='text-ink'
                  />
                </motion.div>
              ))}
              <motion.div variants={reduceMotion ? undefined : item} className='pt-16 flex justify-center'>
                <Link href='/membership/apply' onClick={() => setOpen(false)} className='group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 font-body text-md text-ink/80'>
                  Apply to join
                  <MoveRight className='size-5' aria-hidden />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
