// Service Worker passivo - Nessun salvataggio in cache offline
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Lascia che ogni singola richiesta vada direttamente su internet in tempo reale
  return event.respondWith(fetch(event.request));
});
