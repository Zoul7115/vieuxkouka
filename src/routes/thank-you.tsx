import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ADMIN_WHATSAPP, formatFCFA } from '@/lib/products';

export const Route = createFileRoute('/thank-you')({
  head: () => ({
    meta: [{ title: 'Merci pour votre commande — KOUKA' }],
  }),
  component: ThankYouPage,
});

type Order = {
  orderNumber: string;
  firstName: string;
  productName: string;
  offerLabel: string;
  price: number;
  whatsapp: string;
  city: string;
};

function ThankYouPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('kouka_last_order');
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase');
    }
  }, []);

  const waText = order
    ? `Bonjour, je viens de passer la commande ${order.orderNumber} (${order.productName}) — ${order.firstName}`
    : 'Bonjour, je viens de passer une commande sur ShopAfrik';
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-vert-bg to-background py-12">
      <div className="container-kouka">
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-7 sm:p-10 text-center">
          <div className="w-20 h-20 mx-auto bg-vert-bg rounded-full flex items-center justify-center mb-5 anim-up">
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="text-vert mb-3">Merci{order ? `, ${order.firstName}` : ''} !</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Ta commande est bien enregistrée. On te contacte sous <strong>2 heures</strong> sur WhatsApp pour la
            confirmer.
          </p>

          {order && (
            <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-5 mb-6 text-left">
              <div className="text-sm text-muted-foreground mb-1">Numéro de commande</div>
              <div className="font-extrabold text-vert text-lg mb-3">{order.orderNumber}</div>
              <div className="text-sm text-muted-foreground mb-1">Produit</div>
              <div className="font-bold mb-3">{order.productName}</div>
              <div className="flex justify-between border-t border-vert-mid/30 pt-3">
                <span className="font-bold">À payer à la livraison</span>
                <span className="font-extrabold text-vert">{formatFCFA(order.price)}</span>
              </div>
            </div>
          )}

          <div className="grid gap-3 text-left mb-7">
            {[
              { n: 1, t: 'Confirmation WhatsApp', d: 'Sous 2h, on confirme ton adresse et ta dispo.' },
              { n: 2, t: 'Livraison sous 24-48h', d: 'À ton adresse — emballage discret, sans mention.' },
              { n: 3, t: 'Paiement à la réception', d: 'Tu vérifies, tu paies en cash. Aucune avance.' },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 items-start bg-cream-2 rounded-xl p-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-vert-mid text-white flex items-center justify-center font-extrabold">
                  {s.n}
                </div>
                <div>
                  <div className="font-extrabold text-vert">{s.t}</div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-[#25D366] text-white py-4 rounded-xl font-extrabold shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 transition-transform mb-3"
          >
            💬 Confirmer ma commande sur WhatsApp
          </a>

          <Link to="/" className="text-vert-mid font-bold text-sm">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
