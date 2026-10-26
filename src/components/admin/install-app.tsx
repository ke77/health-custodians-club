'use client'

import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/buttons'
import { installPromptStore, promptInstall } from '@/lib/utils/pwa-install'

type Env = 'server' | 'installed' | 'ios' | 'other'

function subscribeDisplayMode(onChange: () => void) {
  const query = window.matchMedia('(display-mode: standalone)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getEnv(): Env {
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  if (standalone) return 'installed'
  // iPads report as a Mac, so touch support tells them apart
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return ios ? 'ios' : 'other'
}

// how to put the dashboard on a phone's home screen, matched to the device that is looking at it
export function InstallApp() {
  const env = useSyncExternalStore(subscribeDisplayMode, getEnv, () => 'server' as Env)
  const canPrompt = useSyncExternalStore(
    installPromptStore.subscribe,
    installPromptStore.getSnapshot,
    installPromptStore.getServerSnapshot,
  )

  if (env === 'server') return null

  if (env === 'installed') {
    return <p className='font-body text-base text-ink/70'>You are using the installed app.</p>
  }

  if (canPrompt) {
    return (
      <Button variant='dark' onClick={promptInstall} className='px-6'>
        Install the app
      </Button>
    )
  }

  if (env === 'ios') {
    return (
      <p className='font-body text-base text-ink/70'>
        In Safari, tap the <strong className='font-medium text-ink'>Share</strong> button, then{' '}
        <strong className='font-medium text-ink'>Add to Home Screen</strong>.
      </p>
    )
  }

  return (
    <p className='font-body text-base text-ink/70'>
      Open this page in Chrome or Edge, then choose <strong className='font-medium text-ink'>Install app</strong>{' '}
      (or <strong className='font-medium text-ink'>Add to Home screen</strong> on a phone) from the browser menu.
    </p>
  )
}
