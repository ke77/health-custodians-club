/*
  holds the browser's "install this app" offer. chromium browsers fire `beforeinstallprompt` once, early, so
  the dashboard layout captures it here (components/admin/admin-pwa.tsx) and the Account page can show an
  Install button later. read it with useSyncExternalStore.
*/
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPromptEvent | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function captureInstallPrompt(event: Event) {
  deferred = event as InstallPromptEvent
  emit()
}

export function clearInstallPrompt() {
  deferred = null
  emit()
}

// shows the browser's install dialog; the offer can only be used once
export async function promptInstall() {
  if (!deferred) return
  const offer = deferred
  await offer.prompt()
  await offer.userChoice
  clearInstallPrompt()
}

export const installPromptStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => deferred !== null,
  getServerSnapshot: () => false,
}
