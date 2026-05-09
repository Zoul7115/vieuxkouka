// Service Worker — App Livreur KOUKA
const CACHE = 'kouka-livreur-v1';
const SHELL = ['/livreur', '/manifest-livreur.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r || caches.match('/livreur')))
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'NOTIFY') {
    self.registration.showNotification(data.title || 'KOUKA Livreur', {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag || 'livreur-' + Date.now(),
      vibrate: [200, 100, 200, 100, 400],
      requireInteraction: true,
      renotify: true,
      data: { url: '/livreur' },
    });
  }
});

self.addEventListener('push', (event) => {
  let payload = { title: '🛵 Nouvelle livraison KOUKA', body: 'Ouvre l\'app pour voir', tag: 'livreur-' + Date.now(), url: '/livreur' };
  try { if (event.data) payload = { ...payload, ...event.data.json() }; } catch {}
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200, 100, 400],
    requireInteraction: true,
    renotify: true,
    tag: payload.tag,
    data: { url: payload.url || '/livreur' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => {
      for (const c of list) { if (c.url.includes('/livreur') && 'focus' in c) return c.focus(); }
      return self.clients.openWindow('/livreur');
    })
  );
});
