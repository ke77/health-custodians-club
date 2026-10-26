/*
  service worker for the HCC dashboard app (registered with scope /admin).
  it does one thing: when a page cannot load because the phone is offline, show a friendly offline screen
  instead of the browser's error. it caches nothing else on purpose: the dashboard shows live applications and
  enquiries, and a stale copy of them would mislead people. bump CACHE when admin-offline.html changes.
*/
const CACHE = 'hcc-admin-offline-v1'
const OFFLINE_URL = '/admin-offline.html'
const OFFLINE_ASSETS = [OFFLINE_URL, '/pwa/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  // only page loads; data, images and scripts go straight to the network as normal
  if (request.mode !== 'navigate') return

  event.respondWith(
    fetch(request).catch(() => caches.match(OFFLINE_URL).then((cached) => cached || Response.error())),
  )
})
