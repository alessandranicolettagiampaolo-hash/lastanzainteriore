// Service Worker passivo - Nessun salvataggio in cache offline
// Permette aggiornamenti istantanei dei file e la massima freschezza dei contenuti.

self.addEventListener('install', event => {
  // Forza l'attivazione immediata del nuovo Service Worker senza attendere la chiusura delle schede
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Svuota completamente eventuali vecchie cache presenti per evitare conflitti
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => caches.delete(key))
      );
    }).then(() => {
      // Prende subito il controllo di tutti i client/schede aperte
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // Gestisce solo richieste con protocollo HTTP/HTTPS (ignora estensioni browser o schemi speciali)
  if (!event.request.url.startsWith('http')) return;

  // Invia ogni singola richiesta direttamente alla rete in tempo reale
  event.respondWith(
    fetch(event.request).catch(error => {
      console.warn('[SW] Connessione di rete non disponibile per:', event.request.url, error);
    })
  );
});