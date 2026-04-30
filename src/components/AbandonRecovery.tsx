import { useEffect, useState } from 'react';
import { ADMIN_WHATSAPP } from '@/lib/products';

const STORAGE_KEY = 'kouka_form_draft';
const DISMISS_KEY = 'kouka_recovery_dismissed';

export function AbandonRecovery({ productName }: { productName: string }) {
  const [draft, setDraft] = useState<{ fullName?: string; whatsapp?: string; ts?: number } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      // Affiche seulement si abandonné il y a plus de 30 secondes et moins de 7 jours
      const age = Date.now() - (data.ts || 0);
      if (age > 30000 && age < 7 * 24 * 3600 * 1000 && (data.fullName || data.whatsapp)) {
        setDraft(data);
      }
    } catch {}
  }, []);

  if (!draft) return null;

  const firstName = (draft.fullName || '').split(' ')[0] || '';
  const text = encodeURIComponent(
    `Bonjour, je suis ${firstName || 'intéressé(e)'}, j'avais commencé une commande de ${productName}. Pouvez-vous m'aider à la finaliser ?`,
  );
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDraft(null);
  };

  return (
    <div className="fixed top-16 right-3 z-40 max-w-[300px] bg-white border-2 border-or rounded-xl shadow-lg p-3.5 animate-in slide-in-from-right duration-500">
      <button onClick={dismiss} className="absolute top-1 right-2 text-muted-foreground text-lg" aria-label="Fermer">×</button>
      <div className="text-xs font-bold text-or-light mb-1">👋 Tu reviens ?</div>
      <div className="text-sm text-foreground mb-2">
        {firstName && <strong>{firstName}, </strong>}on a gardé ta commande. Termine en 1 minute.
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
            dismiss();
          }}
          className="flex-1 bg-vert-mid text-white text-xs font-extrabold py-2 rounded-lg"
        >
          Reprendre
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          onClick={dismiss}
          className="flex-1 bg-[#25D366] text-white text-xs font-extrabold py-2 rounded-lg text-center"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
