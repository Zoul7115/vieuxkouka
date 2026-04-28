import { useEffect, useState } from 'react';
import { ADMIN_WHATSAPP } from '@/lib/products';

const STORAGE_KEY = 'kouka_exit_intent_shown';

export function ExitIntentPopup({ productName }: { productName: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem(STORAGE_KEY, '1');
      setShow(true);
    };

    // Desktop: souris vers le haut
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    // Mobile: après 45s d'inactivité scroll
    let lastScroll = Date.now();
    const onScroll = () => { lastScroll = Date.now(); };
    const idleId = setInterval(() => {
      if (Date.now() - lastScroll > 45000) trigger();
    }, 5000);

    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      clearInterval(idleId);
    };
  }, []);

  if (!show) return null;

  const text = encodeURIComponent(`Bonjour, je viens de la page ${productName}. J'aimerais en savoir plus avant de commander.`);
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300 shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-3 text-2xl text-muted-foreground hover:text-foreground"
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-vert text-xl font-extrabold mb-2">Attends ! Une dernière chose…</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tu as une question sur <strong>{productName}</strong> ? Le Vieux KOUKA répond personnellement sur WhatsApp en moins de 10 minutes.
          </p>
          <div className="bg-vert-bg border-2 border-vert-mid rounded-xl p-3 mb-4 text-left">
            <div className="text-xs font-bold text-vert mb-1">🎁 OFFRE EXCLUSIVE</div>
            <div className="text-sm text-foreground">
              Mentionne <strong>"CODE WEB"</strong> sur WhatsApp et reçois <strong>la livraison gratuite partout au Burkina</strong> sur ta première commande.
            </div>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setShow(false)}
            className="block w-full bg-[#25D366] text-white py-3 rounded-xl font-extrabold mb-2"
          >
            💬 Parler au Vieux KOUKA maintenant
          </a>
          <button
            onClick={() => {
              setShow(false);
              document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm text-muted-foreground underline"
          >
            Non merci, je commande directement
          </button>
        </div>
      </div>
    </div>
  );
}
