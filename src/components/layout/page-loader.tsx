'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { PulseLoader } from 'react-spinners'
import { loaderTiming, pageLoaderStore, routeChanged, startNavigation, startTimed } from '@/lib/utils/page-loader'
import { cn } from '@/lib/utils/cn'

// a link that stays on this page (a hash, a query change) or leaves the site never needs the loader
function isPageNavigation(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download') || anchor.hasAttribute('data-no-loader')) return false
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return false
  return url.pathname !== window.location.pathname
}

/*
  a full-screen loader for every page change: link clicks, redirects, and form submits on the public site.
  it is a deliberate short delay, so a client-side navigation that would otherwise be instant still feels
  like a page change. mounted once in the root layout.
  opt a link or form out with data-no-loader. plain buttons (menus, accordions, switches) never trigger it.
*/
export function PageLoader() {
  const visible = useSyncExternalStore(pageLoaderStore.subscribe, pageLoaderStore.getSnapshot, pageLoaderStore.getServerSnapshot)
  const pathname = usePathname()
  const previous = useRef(pathname)

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    routeChanged()
  }, [pathname])

  useEffect(() => {
    // capture phase: next/link calls preventDefault on client navigations, so a bubbling listener would miss them
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target instanceof Element ? event.target : null
      if (!target) return

      const anchor = target.closest('a[href]')
      if (anchor instanceof HTMLAnchorElement) {
        if (isPageNavigation(anchor)) startNavigation()
        return
      }

      // a form submit has no route change of its own to wait for, so it shows for a fixed moment.
      // the dashboard's save buttons already say "Saving…", so they are left alone
      const button = target.closest('button')
      if (
        button &&
        button.type === 'submit' &&
        !button.disabled &&
        button.form &&
        !button.form.hasAttribute('data-no-loader') &&
        !window.location.pathname.startsWith('/admin')
      ) {
        startTimed(loaderTiming.submitMs)
      }
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return (
    <div
      role='status'
      aria-live='polite'
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        'page-loader fixed inset-0 z-100 flex flex-col items-center justify-center bg-paper/95 transition-opacity duration-200',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {visible && (
        <>
          <PulseLoader color='var(--color-ink)' size={14} margin={5} speedMultiplier={0.85} />
          <span className='sr-only'>Loading</span>
        </>
      )}
    </div>
  )
}
