import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Register SW
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      swRef.current = reg;
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
          // Système notification
          notify(title, body, swRef.current);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [enabled]);

  const install = async () => {
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

  const requestNotifications = async () => {
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
  };

  return {
    canInstall: !!installPrompt && !installed,
    installed,
    install,
    permission,
    requestNotifications,
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
