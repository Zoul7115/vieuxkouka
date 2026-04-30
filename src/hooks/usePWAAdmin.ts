import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Clé publique VAPID — doit correspondre au secret VAPID_PUBLIC_KEY de l'edge function send-push
const VAPID_PUBLIC_KEY =
  'BIuS9oQB_sBzPJWPEUyZxPiH4_HZeZPGc0lIH8pgaPbI3z3LpnCNs5QQCkdLuOqhxKOMkY9zdXt4iKxHLQR4z6w';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/** Enregistre le service worker, gère l'installation PWA et les notifications de nouvelles commandes */
export function usePWAAdmin(enabled: boolean) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const swRef = useRef<ServiceWorkerRegistration | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const unlockSound = useCallback(async () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioRef.current || new AudioCtx();
      audioRef.current = ctx;
      if (ctx.state === 'suspended') await ctx.resume();
    } catch { /* audio not available */ }
  }, []);

  const playAlertSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = audioRef.current || (AudioCtx ? new AudioCtx() : null);
      if (!ctx) return;
      audioRef.current = ctx;
      const now = ctx.currentTime;
      [0, 0.18, 0.36].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + offset);
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    } catch { /* ignore sound failures */ }
  }, []);

  // Register SW
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then(async (reg) => {
      swRef.current = reg;
      // Envoyer la config Supabase au SW pour les checks en arrière-plan
      const sendConfig = () => {
        const target = reg.active || reg.waiting || reg.installing;
        target?.postMessage({
          type: 'CONFIG',
          url: import.meta.env.VITE_SUPABASE_URL,
          key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          lastOrderTs: new Date().toISOString(),
        });
      };
      if (reg.active) sendConfig();
      else reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        sw?.addEventListener('statechange', () => { if (sw.state === 'activated') sendConfig(); });
      });
      // Tenter d'enregistrer un periodic sync (Chrome Android avec PWA installée)
      try {
        // @ts-expect-error periodicSync optional API
        if (reg.periodicSync) {
          // @ts-expect-error optional
          const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
          if (status.state === 'granted') {
            // @ts-expect-error periodicSync optional API
            await reg.periodicSync.register('check-orders', { minInterval: 5 * 60 * 1000 });
          }
        }
      } catch { /* not supported */ }
    }).catch(() => {});
    if (typeof Notification !== 'undefined') setPermission(Notification.permission);
    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
  }, []);

  // Listen install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Realtime: notify on new orders
  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel('admin-orders-notify')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const o = payload.new as { order_number?: string; first_name?: string; city?: string; product_price?: number };
          const title = `🌿 Nouvelle commande ${o.order_number || ''}`;
          const body = `${o.first_name || 'Client'} · ${o.city || ''} · ${o.product_price?.toLocaleString('fr-FR') || ''} FCFA`;
          // Toast in-app
          toast.success(title, { description: body });
          // Son + notification système
          playAlertSound();
          notify(title, body, swRef.current);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [enabled, playAlertSound]);

  const install = async () => {
    await unlockSound();
    if (!installPrompt) {
      toast.info('Pour installer : menu navigateur > "Installer / Ajouter à l\'écran d\'accueil"');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      toast.success('Application installée !');
      setInstalled(true);
    }
    setInstallPrompt(null);
  };

  const requestNotifications = useCallback(async () => {
    await unlockSound();
    if (typeof Notification === 'undefined') {
      toast.error('Notifications non supportées sur ce navigateur');
      return;
    }
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p === 'granted') {
      toast.success('Notifications activées !');
      notify('🌿 Notifications actives', 'Vous serez alerté à chaque nouvelle commande.', swRef.current);
    } else {
      toast.error('Notifications refusées');
    }
  }, [unlockSound]);

  const testAlert = useCallback(async () => {
    await unlockSound();
    playAlertSound();
    notify('🌿 Test notification KOUKA', 'Le son et les notifications admin sont prêts.', swRef.current);
    toast.success('Alerte test envoyée');
  }, [playAlertSound, unlockSound]);

  return {
    canInstall: !!installPrompt && !installed,
    installed,
    install,
    permission,
    requestNotifications,
    testAlert,
  };
}

function notify(title: string, body: string, reg: ServiceWorkerRegistration | null) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  if (reg && reg.active) {
    reg.active.postMessage({ type: 'NOTIFY', title, body, tag: 'order-' + Date.now() });
  } else {
    try { new Notification(title, { body, icon: '/icons/icon-192.png' }); } catch {}
  }
}
