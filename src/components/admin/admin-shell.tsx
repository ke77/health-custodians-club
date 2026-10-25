'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogOut, Menu, PanelLeft, PanelLeftClose, X } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { readyAdminNav } from '@/lib/config/admin-nav'
import { signOut } from '@/lib/actions/admin/auth'
import { cn } from '@/lib/utils/cn'

type Props = {
  // the signed-in admin's avatar and name, a link to the account screen; streamed in by the layout
  account: ReactNode
  // small counts beside a link (new applications), keyed by href and streamed in by the layout
  badges?: Record<string, ReactNode>
  children: ReactNode
}

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLinks({
  pathname,
  badges,
  onNavigate,
  large,
}: {
  pathname: string
  badges?: Record<string, ReactNode>
  onNavigate?: () => void
  large?: boolean
}) {
  return (
    <div className='flex flex-col gap-8'>
      {readyAdminNav.map((group) => (
        <div key={group.label}>
          <p className='px-3 font-mono text-label uppercase text-muted'>{group.label}</p>
          <ul className='mt-2 flex flex-col gap-0.5'>
            {group.items.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      // active is a filled ink pill (reference/screenshots/dashboard.png), rest are quiet text
                      'flex items-center justify-between gap-3 rounded-lg px-3 font-body transition-colors',
                      large ? 'py-3 text-h3' : 'py-2 text-base',
                      active ? 'bg-ink font-medium text-paper' : 'text-ink/70 hover:bg-ink/5 hover:text-ink',
                      focus,
                    )}
                  >
                    <span>{item.label}</span>
                    {badges?.[item.href] && (
                      <span className={cn('shrink-0', active && '[&_*]:text-paper/70')}>{badges[item.href]}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

function SignOutButton({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <form action={signOut} onSubmit={onNavigate}>
      <button
        type='submit'
        className={cn('inline-flex items-center gap-2 rounded-xs text-small text-ink/80 hover:text-ink', focus, className)}
      >
        Sign out <LogOut className='size-4' aria-hidden />
      </button>
    </form>
  )
}

function ViewSite({ className }: { className?: string }) {
  return (
    <a
      href='/'
      target='_blank'
      rel='noreferrer'
      className={cn('inline-flex items-center gap-1 rounded-xs text-small text-ink/80 hover:text-ink', focus, className)}
    >
      View site <ArrowUpRight className='size-3.5' aria-hidden />
    </a>
  )
}

const COLLAPSE_KEY = 'hcc-admin-sidebar-collapsed'

/*
  the collapsed preference lives in localStorage and is read through useSyncExternalStore, so there is no
  setState-in-effect and the server snapshot (expanded) matches the first client render.
*/
const collapseListeners = new Set<() => void>()

function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

function useSidebarCollapsed(): [boolean, () => void] {
  const collapsed = useSyncExternalStore(
    (cb) => {
      collapseListeners.add(cb)
      return () => collapseListeners.delete(cb)
    },
    readCollapsed,
    () => false,
  )

  function toggle() {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, readCollapsed() ? '0' : '1')
    } catch {
      // storage blocked: the preference just will not be remembered
    }
    collapseListeners.forEach((cb) => cb())
  }

  return [collapsed, toggle]
}

// the dashboard frame: a top header everywhere, a sidebar from lg, a full-screen menu below it
export function AdminShell({ account, badges, children }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, toggleCollapsed] = useSidebarCollapsed()

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

  const close = () => setOpen(false)

  return (
    <div className='flex min-h-dvh flex-col bg-paper'>
      <a
        href='#admin-main'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:p-3'
      >
        Skip to content
      </a>

      {/* top header, full width (reference layout): wordmark left, account and sign out right */}
      <header className='sticky top-0 z-20 border-b border-rule bg-paper'>
        <div className='flex items-center justify-between px-6 py-3 lg:px-8'>
          <div className='flex items-center gap-2'>
            {/* when the sidebar is collapsed, this brings it back */}
            {collapsed && (
              <button
                type='button'
                onClick={toggleCollapsed}
                aria-label='Show the menu'
                className={cn('hidden size-9 items-center justify-center rounded-lg text-ink/70 hover:bg-ink/5 hover:text-ink lg:flex', focus)}
              >
                <PanelLeft className='size-5' aria-hidden />
              </button>
            )}
            <Logo href='/admin' label='Dashboard home' wordmark='HCC Dashboard' />
          </div>

          <div className='hidden items-center gap-5 lg:flex'>
            <ViewSite />
            <span className='h-6 w-px bg-rule' aria-hidden />
            {account}
            <SignOutButton />
          </div>

          <button
            type='button'
            onClick={() => setOpen(true)}
            aria-label='Open menu'
            aria-expanded={open}
            aria-controls='admin-menu'
            className={cn('flex size-11 items-center justify-end text-ink lg:hidden', focus)}
          >
            <Menu className='size-6' aria-hidden />
          </button>
        </div>
      </header>

      {open && (
        <div
          id='admin-menu'
          role='dialog'
          aria-modal='true'
          aria-label='Dashboard menu'
          className='fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper px-6 pb-10 lg:hidden'
        >
          <div className='flex items-center justify-between py-3'>
            <Logo href='/admin' label='Dashboard home' wordmark='HCC Dashboard' onClick={close} />
            <button
              type='button'
              onClick={close}
              aria-label='Close menu'
              autoFocus
              className={cn('flex size-11 items-center justify-end text-ink', focus)}
            >
              <X className='size-6' aria-hidden />
            </button>
          </div>
          <nav aria-label='Dashboard' className='mt-8 flex flex-1 flex-col gap-10'>
            <NavLinks pathname={pathname} badges={badges} onNavigate={close} large />
            <div className='flex flex-col items-start gap-4 border-t border-rule pt-6' onClick={close}>
              {account}
              <ViewSite />
              <SignOutButton />
            </div>
          </nav>
        </div>
      )}

      <div className={cn('flex-1', collapsed ? 'lg:block' : 'lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]')}>
        {/* desktop sidebar (hidden when collapsed) */}
        <aside
          className={cn(
            'hidden lg:sticky lg:top-[3.75rem] lg:h-[calc(100dvh-3.75rem)] lg:flex-col lg:overflow-y-auto lg:border-r lg:border-rule lg:px-4 lg:py-6',
            collapsed ? 'lg:hidden' : 'lg:flex',
          )}
        >
          <div className='mb-4 flex justify-end'>
            <button
              type='button'
              onClick={toggleCollapsed}
              aria-label='Collapse the menu'
              className={cn('flex size-9 items-center justify-center rounded-lg text-ink/60 hover:bg-ink/5 hover:text-ink', focus)}
            >
              <PanelLeftClose className='size-5' aria-hidden />
            </button>
          </div>
          <nav aria-label='Dashboard'>
            <NavLinks pathname={pathname} badges={badges} />
          </nav>
        </aside>

        <main id='admin-main' className='min-w-0'>
          <div className='mx-auto w-full max-w-6xl px-6 py-10 lg:px-12 lg:py-14'>{children}</div>
        </main>
      </div>
    </div>
  )
}
