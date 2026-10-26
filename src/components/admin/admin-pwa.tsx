'use client'

import { useEffect } from 'react'
import { captureInstallPrompt, clearInstallPrompt } from '@/lib/utils/pwa-install'

/*
  sets the dashboard up as an installable app: registers the offline service worker (scope /admin only, so the
  public site is never touched) and keeps the browser's install offer for the Account page. renders nothing.
  the service worker is only registered in production builds, so it never gets in the way of `pnpm dev`.
*/
export function AdminPwa() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {
        // no service worker just means no offline screen; the app still installs and works
      })
    }

    const onPrompt = (event: Event) => {
      // hold the offer back so it appears as a button on the Account page, not as a surprise banner
      event.preventDefault()
      captureInstallPrompt(event)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', clearInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', clearInstallPrompt)
    }
  }, [])

  return null
}
