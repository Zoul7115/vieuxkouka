// Helpers Web Push côté navigateur (admin)
import { supabase } from '@/integrations/supabase/client';

// Clé publique VAPID — peut être en clair dans le bundle, c'est fait pour
export const VAPID_PUBLIC_KEY =
  'BPvhuJHkhHwPg0hhJ8SJa4fFIPoKjA0TDaJlO113fLf763Gg-PoOiIg8awzSccDt0szDS5V0MXMrvROYhpPjrPA';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str);
}

export async function subscribeToPush(reg: ServiceWorkerRegistration): Promise<boolean> {
  if (typeof window === 'undefined' || !('PushManager' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  const endpoint = json.endpoint || sub.endpoint;
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;

  // Fallback : extraire depuis getKey()
  const finalP256dh = p256dh || arrayBufferToBase64(sub.getKey('p256dh') as ArrayBuffer);
  const finalAuth = auth || arrayBufferToBase64(sub.getKey('auth') as ArrayBuffer);

  if (!endpoint || !finalP256dh || !finalAuth) return false;

  // Upsert : si l'endpoint existe déjà, on met juste à jour last_used_at
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        endpoint,
        p256dh: finalP256dh,
        auth: finalAuth,
        user_agent: navigator.userAgent,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' },
    );

  if (error) {
    console.error('push subscribe save error', error);
    return false;
  }
  return true;
}

export async function unsubscribeFromPush(reg: ServiceWorkerRegistration): Promise<void> {
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
  await sub.unsubscribe();
}
