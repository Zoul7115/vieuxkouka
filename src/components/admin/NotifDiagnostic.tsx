import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SubRow = {
  id: string;
  endpoint: string;
  user_agent: string | null;
  label: string | null;
  last_used_at: string;
  created_at: string;
};

export function NotifDiagnostic() {
  const [open, setOpen] = useState(false);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [swActive, setSwActive] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [hasLocalSub, setHasLocalSub] = useState<boolean | null>(null);
  const [iosStandalone, setIosStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      // Permission + SW
      if (typeof Notification !== 'undefined') setPermission(Notification.permission);
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        setSwActive(!!reg?.active);
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          setHasLocalSub(!!sub);
        } else {
          setHasLocalSub(false);
        }
      }
      // iOS detection
      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua);
      setIsIOS(ios);
      // @ts-expect-error iOS standalone flag
      setIosStandalone(!!window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);

      // DB subs
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('id, endpoint, user_agent, label, last_used_at, created_at')
        .order('last_used_at', { ascending: false });
      if (error) throw error;
      setSubs((data || []) as SubRow[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  const sendRealTest = async () => {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: 'TEST-' + Date.now().toString(36).toUpperCase(),
          first_name: 'Test',
          city: 'Diagnostic',
          product_name: 'Test push réel',
          product_price: 0,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        toast.success(`✅ Push envoyé à ${json.sent}/${json.total} appareils`);
      } else {
        toast.error('❌ ' + (json.error || 'Erreur send-push'));
      }
    } catch (e) {
      toast.error('❌ Appel send-push échoué : ' + (e as Error).message);
    }
  };

  const removeSub = async (id: string) => {
    if (!confirm('Supprimer cette souscription ?')) return;
    const { error } = await supabase.from('push_subscriptions').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Souscription supprimée'); refresh(); }
  };

  return (
    <div className="bg-white border-2 border-vert-bg rounded-2xl mb-5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-vert-bg/30 transition-colors"
      >
        <span className="font-extrabold text-foreground text-sm">
          🔔 Diagnostic notifications
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {permission === 'granted' && hasLocalSub ? '✅ actif' : permission === 'denied' ? '❌ refusé' : '⚠️ à configurer'}
          </span>
        </span>
        <span className="text-muted-foreground">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-vert-bg/50">
          <div className="grid sm:grid-cols-2 gap-2 mt-3 text-xs">
            <Status label="Permission notif" value={permission} ok={permission === 'granted'} />
            <Status label="Service Worker actif" value={swActive ? 'oui' : 'non'} ok={swActive} />
            <Status label="Souscription locale" value={hasLocalSub === null ? '...' : hasLocalSub ? 'oui' : 'non'} ok={hasLocalSub === true} />
            <Status label="Souscriptions en base" value={String(subs.length)} ok={subs.length > 0} />
          </div>

          {isIOS && !iosStandalone && (
            <div className="mt-3 bg-or/20 border-2 border-or rounded-xl p-3 text-xs leading-relaxed">
              <strong>📱 iPhone détecté :</strong> les notifications ne fonctionnent QUE si tu installes l'app
              via Safari → bouton <strong>Partager</strong> → <strong>"Sur l'écran d'accueil"</strong>, puis tu ouvres
              l'app depuis l'icône (pas le navigateur). iOS 16.4+ requis.
            </div>
          )}

          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={sendRealTest}
              className="bg-vert-mid text-white text-xs font-extrabold px-3 py-2 rounded-lg hover:bg-vert"
            >
              🚀 Envoyer un push réel de test
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="bg-white border-2 border-vert-bg text-xs font-bold px-3 py-2 rounded-lg hover:border-vert-mid"
            >
              🔄 Actualiser
            </button>
          </div>

          {subs.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-bold text-muted-foreground mb-2">Appareils enregistrés ({subs.length})</div>
              <div className="space-y-1.5">
                {subs.map((s) => (
                  <div key={s.id} className="flex items-start justify-between gap-2 bg-cream-2 rounded-lg p-2 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground truncate">{s.user_agent || 'Appareil inconnu'}</div>
                      <div className="text-muted-foreground">
                        Créé le {new Date(s.created_at).toLocaleDateString('fr-FR')} ·
                        Vu {new Date(s.last_used_at).toLocaleString('fr-FR')}
                      </div>
                      <div className="text-muted-foreground/70 truncate">…{s.endpoint.slice(-40)}</div>
                    </div>
                    <button
                      onClick={() => removeSub(s.id)}
                      className="text-rouge hover:underline shrink-0"
                      title="Supprimer cet appareil"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Status({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 ${ok ? 'bg-vert-bg/40 border-vert-bg' : 'bg-or/10 border-or/40'}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-extrabold ${ok ? 'text-vert' : 'text-rouge'}`}>{value}</span>
    </div>
  );
}
