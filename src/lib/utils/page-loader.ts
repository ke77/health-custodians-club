/*
  state for the full-screen page loader. lives outside react so click listeners and timers can drive it,
  and components read it through useSyncExternalStore (components/layout/page-loader.tsx).

  two ways in:
  - startNavigation(): a link was clicked. the loader stays up until the route changes, and never less than
    minVisibleMs, so even an instant client-side navigation shows a short, deliberate delay.
  - startTimed(): an action with no route change of its own (a form submit). it hides itself after a moment.
  routeChanged() covers redirects that did not start from a link click (server action redirects, router.push).
*/
export const loaderTiming = {
  // shortest time the loader stays up for a link click, even if the next page is ready at once
  minVisibleMs: 600,
  // how long it shows when a redirect happened without a click
  redirectMs: 500,
  // how long a form submit shows it
  submitMs: 700,
  // gives up if a navigation never completes (offline, error page), so the screen is never stuck
  failsafeMs: 8000,
}

let visible = false
let waitingForRoute = false
let shownAt = 0
let hideTimer: ReturnType<typeof setTimeout> | undefined
let failsafeTimer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function show() {
  clearTimeout(hideTimer)
  if (!visible) {
    visible = true
    shownAt = Date.now()
    emit()
  }
}

function hide() {
  clearTimeout(hideTimer)
  clearTimeout(failsafeTimer)
  waitingForRoute = false
  if (visible) {
    visible = false
    emit()
  }
}

function hideAfter(ms: number) {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(hide, ms)
}

export function startNavigation() {
  waitingForRoute = true
  show()
  clearTimeout(failsafeTimer)
  failsafeTimer = setTimeout(hide, loaderTiming.failsafeMs)
}

export function startTimed(ms: number) {
  // a pending navigation already owns the loader
  if (waitingForRoute) return
  show()
  hideAfter(ms)
}

// the pathname changed
export function routeChanged() {
  if (visible && waitingForRoute) {
    waitingForRoute = false
    clearTimeout(failsafeTimer)
    hideAfter(Math.max(0, loaderTiming.minVisibleMs - (Date.now() - shownAt)))
    return
  }
  // a redirect nobody clicked a link for: still give it the short, consistent delay
  show()
  hideAfter(loaderTiming.redirectMs)
}

export const pageLoaderStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => visible,
  getServerSnapshot: () => false,
}
