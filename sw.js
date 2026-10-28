const CACHE_NAME = 'cafe-ratio-v1';
const ASSETS = [
  '/cafe-ratio/',
  '/cafe-ratio/index.html',
  '/cafe-ratio/styles.css',
  '/cafe-ratio/app.js',
  '/cafe-ratio/manifest.json',
  '/cafe-ratio/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match('/cafe-ratio/index.html')))
  );
});
