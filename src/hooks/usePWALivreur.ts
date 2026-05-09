import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function ab64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return window.btoa(bin);
}

async function getVapidPublicKey(): Promise<string | null> {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.publicKey || null;
  } catch {
    return null;
  }
}

async function subscribePush(reg: ServiceWorkerRegistration, livreurIdx: number, livreurName: string) {
  if (!('PushManager' in window)) return;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const key = await getVapidPublicKey();
    if (!key) return;
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key).buffer as ArrayBuffer,
    });
  }
  const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  const p256dh = ab64(sub.getKey('p256dh')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const auth = ab64(sub.getKey('auth')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  await supabase.from('push_subscriptions').upsert(
    {
      endpoint: json.endpoint || sub.endpoint,
      p256dh: json.keys?.p256dh || p256dh,
      auth: json.keys?.auth || auth,
      user_agent: navigator.userAgent,
      label: `livreur-${livreurIdx}-${livreurName}`,
      livreur_idx: livreurIdx,
      last_used_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' },
  );
}

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

/** PWA + Push pour la page livreur (utilise le même VAPID que l'admin) */
export function usePWALivreur(livreurIdx: number | null, livreurName: string) {
  const [installPrompt, setInstallPrompt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const swRef = useRef<ServiceWorkerRegistration | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playAlert = useCallback(() => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = audioRef.current || (Ctx ? new Ctx() : null);
      if (!ctx) return;
      audioRef.current = ctx;
      const t = ctx.currentTime;
      [0, 0.18, 0.36].forEach((off) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(880, t + off);
        g.gain.setValueAtTime(0.0001, t + off);
        g.gain.exponentialRampToValueAtTime(0.18, t + off + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.14);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t + off);
        o.stop(t + off + 0.15);
      });
    } catch { /* silent */ }
  }, []);

  // Register SW
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register('/sw-livreur.js', { scope: '/livreur' })
      .then((reg) => {
        swRef.current = reg;
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && livreurIdx != null) {
          subscribePush(reg, livreurIdx, livreurName).catch(() => {});
        }
      })
      .catch(() => {});
    if (typeof Notification !== 'undefined') setPermission(Notification.permission);
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
  }, [livreurIdx, livreurName]);

  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setInstallPrompt(e as BIPEvent); };
    window.addEventListener('beforeinstallprompt', h);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  // Realtime: notif si nouvelle commande pour MOI
  useEffect(() => {
    if (livreurIdx == null) return;
    const ch = supabase
      .channel(`livreur-notif-${livreurIdx}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const oldR = payload.old as { livreur_idx?: number | null };
        const newR = payload.new as { livreur_idx?: number | null; order_number?: string; first_name?: string; city?: string; product_price?: number };
        if (oldR.livreur_idx !== livreurIdx && newR.livreur_idx === livreurIdx) {
          const title = `🛵 Nouvelle livraison ${newR.order_number || ''}`;
          const body = `${newR.first_name || 'Client'} · ${newR.city || ''} · ${newR.product_price?.toLocaleString('fr-FR') || ''} FCFA`;
          toast.success(title, { description: body });
          playAlert();
          if (swRef.current) {
            swRef.current.active?.postMessage({ type: 'NOTIFY', title, body, tag: `livreur-${newR.order_number}` });
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [livreurIdx, playAlert]);

  const install = async () => {
    if (!installPrompt) {
      toast.info('Pour installer : menu navigateur > "Installer / Ajouter à l\'écran d\'accueil"');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') { toast.success('App installée !'); setInstalled(true); }
    setInstallPrompt(null);
  };

  const enableNotif = async () => {
    if (typeof Notification === 'undefined') { toast.error('Notifications non supportées'); return; }
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p === 'granted') {
      toast.success('Notifications activées !');
      if (swRef.current && livreurIdx != null) await subscribePush(swRef.current, livreurIdx, livreurName);
    }
  };

  return { installed, installPromptAvailable: !!installPrompt, permission, install, enableNotif, playAlert };
}
