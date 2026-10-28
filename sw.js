// Service Worker for WildGuard Society - Offline support
// Served at the root of wildguard.live (2026-10-28 rebuild).
const CACHE_NAME = 'wildguard-v5';
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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) { return response; }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => caches.match('/Wildlife-website/index.html'));
    })
  );
});