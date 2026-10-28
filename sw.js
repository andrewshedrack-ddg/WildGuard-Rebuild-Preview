// Service Worker for WildGuard Society - Offline support
// Served at the root of wildguard.live (2026-10-28 rebuild).
const CACHE_NAME = 'wildguard-v7';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/scan.html',
  '/library/library.html',
  '/about.html',
  '/contact.html',
  '/login.html',
  '/register.html',
  '/adopt.html',
  '/parks.html',
  '/terms.html',
  '/privacy.html',
  '/forgot-password.html',
  '/css/style.css',
  '/css/editorial.css',
  '/css/scan.css',
  '/js/main.js',
  '/js/scan.js',
  '/js/auth.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 2026-10-28 fix: network-first, cache as fallback. The old cache-first
// strategy meant a code update was never served until the service worker
// version changed AND the visitor loaded the site a second time — every
// preview retest kept running stale scanner code. Network-first picks up
// a new deploy on the next load; the cache only covers offline visits.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        const copy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return networkResponse;
    }).catch(() => caches.match(event.request))
  );
});