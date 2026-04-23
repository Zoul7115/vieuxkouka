// Service worker minimal — cache shell + push notifications
const CACHE = 'kouka-admin-v1';
const SHELL = ['/', '/admin', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r || caches.match('/admin')))
  );
});

// Notifications locales (déclenchées via postMessage depuis l'app)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NOTIFY') {
    self.registration.showNotification(event.data.title || 'Nouvelle commande', {
      body: event.data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: event.data.tag || 'order',
      vibrate: [200, 100, 200],
      data: { url: '/admin' },
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => {
      for (const client of list) {
        if (client.url.includes('/admin') && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow('/admin');
    })
  );
});
