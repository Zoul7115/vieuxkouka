// Service worker — KOUKA Admin (notifications + background polling)
const CACHE = 'kouka-admin-v3';
const SHELL = ['/admin', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';
let lastOrderTs = null; // ISO

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
  const url = new URL(request.url);
  // Ne pas intercepter les appels API (Supabase, IP, etc.)
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r || caches.match('/admin')))
  );
});

// Notifications locales (déclenchées via postMessage depuis l'app)
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'NOTIFY') {
    self.registration.showNotification(data.title || 'Nouvelle commande', {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag || 'order-' + Date.now(),
      vibrate: [200, 100, 200, 100, 400],
      requireInteraction: true,
      renotify: true,
      data: { url: '/admin' },
    });
  }
  if (data.type === 'CONFIG') {
    SUPABASE_URL = data.url || SUPABASE_URL;
    SUPABASE_ANON_KEY = data.key || SUPABASE_ANON_KEY;
    if (data.lastOrderTs) lastOrderTs = data.lastOrderTs;
  }
  if (data.type === 'CHECK_NOW') {
    event.waitUntil(checkNewOrders());
  }
});

// Push réel (Web Push via VAPID)
self.addEventListener('push', (event) => {
  let payload = { title: '🌿 Nouvelle commande KOUKA', body: 'Ouvre l\'admin pour voir', tag: 'push-' + Date.now(), url: '/admin' };
  try { if (event.data) payload = { ...payload, ...event.data.json() }; } catch {}
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200, 100, 400],
    requireInteraction: true,
    renotify: true,
    tag: payload.tag,
    data: { url: payload.url || '/admin' },
  }));
});

// Sync périodique en arrière-plan (Chrome/Android, si autorisé)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-orders') {
    event.waitUntil(checkNewOrders());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'check-orders') {
    event.waitUntil(checkNewOrders());
  }
});

async function checkNewOrders() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    const sinceParam = lastOrderTs ? `&created_at=gt.${encodeURIComponent(lastOrderTs)}` : '&limit=1';
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=order_number,first_name,city,product_price,created_at&order=created_at.desc${sinceParam}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) return;
    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0) {
      const fresh = lastOrderTs ? rows : [];
      lastOrderTs = rows[0].created_at;
      for (const o of fresh) {
        await self.registration.showNotification(`🌿 Nouvelle commande ${o.order_number || ''}`, {
          body: `${o.first_name || 'Client'} · ${o.city || ''} · ${(o.product_price || 0).toLocaleString('fr-FR')} FCFA`,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          vibrate: [200, 100, 200, 100, 400],
          requireInteraction: true,
          tag: 'order-' + o.order_number,
          renotify: true,
          data: { url: '/admin' },
        });
      }
    }
  } catch {}
}

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
