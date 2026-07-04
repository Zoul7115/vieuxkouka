import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ADMIN_WHATSAPP, formatFCFA } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { trackFB } from '@/lib/facebookPixel';

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
  addressDetail?: string;
  deliverySlot?: string;
};

const SLOT_LABELS: Record<string, string> = {
  morning: 'matin (8h-12h)',
  noon: 'midi (12h-14h)',
  afternoon: 'après-midi (14h-17h)',
  evening: 'soir (17h-20h)',
};

function ThankYouPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('kouka_last_order');
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const buildWaMessage = () => {
    if (!order) return '';
    const slot = order.deliverySlot ? SLOT_LABELS[order.deliverySlot] || order.deliverySlot : 'à confirmer';
    return encodeURIComponent(
      `Bonjour, je viens de passer la commande ${order.orderNumber}.\n` +
      `🌿 Produit : ${order.productName}\n` +
      `💵 Montant : ${formatFCFA(order.price)} (cash à la livraison)\n` +
      `📍 ${order.city}${order.addressDetail ? ' · ' + order.addressDetail : ''}\n` +
      `🕐 Créneau préféré : ${slot}\n\n` +
      `Je CONFIRME ma disponibilité — merci de m'appeler pour valider la livraison. 🙏`
    );
  };

  const handleConfirm = async () => {
    if (!order) return;
    // Track côté Pixel — signal "vrai client"
    trackFB('Lead', { value: order.price, currency: 'XOF', content_name: 'WhatsAppConfirmed' }, {
      phone: order.whatsapp, city: order.city,
    });
    // Marque la confirmation côté DB
    try {
      await supabase
        .from('orders')
        .update({ confirmed_via_whatsapp_at: new Date().toISOString() })
        .eq('order_number', order.orderNumber);
    } catch (e) {
      console.warn('confirm update failed', e);
    }
    setConfirmed(true);
    // Ouvre WhatsApp
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${buildWaMessage()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-vert-bg to-background py-8">
      <div className="container-kouka">
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 sm:p-10 text-center">
          <div className="w-20 h-20 mx-auto bg-vert-bg rounded-full flex items-center justify-center mb-5 anim-up">
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="text-vert mb-3">Merci{order ? `, ${order.firstName}` : ''} !</h1>
          <p className="text-muted-foreground text-base mb-2">
            Ta commande est bien enregistrée.
          </p>
          <p className="text-foreground text-base font-bold mb-6">
            ⚠️ Une dernière étape pour <span className="text-rouge">garantir ta livraison</span> 👇
          </p>

          {/* CTA WhatsApp prioritaire — c'est l'ÉTAPE 1 visuellement */}
          {order && !confirmed && (
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl p-5 mb-6 text-left shadow-[0_8px_24px_rgba(37,211,102,0.4)]">
              <div className="text-white">
                <div className="font-extrabold text-lg mb-2">📲 Confirme ta dispo sur WhatsApp</div>
                <p className="text-sm opacity-95 mb-4 leading-relaxed">
                  Pour <strong>verrouiller ta livraison</strong> et passer en priorité, envoie un message WhatsApp au Vieux KOUKA.
                  C'est instantané — un seul clic, le message est déjà rédigé.
                </p>
                <button
                  onClick={handleConfirm}
                  className="w-full bg-white text-[#128C7E] font-extrabold py-4 rounded-xl text-base shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  💬 J'ENVOIE MA CONFIRMATION SUR WHATSAPP
                </button>
                <div className="text-xs text-white/80 text-center mt-2">
                  ⏱️ Prend 5 secondes · garanti livré dans tes 24h
                </div>
              </div>
            </div>
          )}

          {confirmed && (
            <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-5 mb-6 text-left">
              <div className="font-extrabold text-vert mb-1">✅ Merci ! Confirmation envoyée.</div>
              <p className="text-sm text-muted-foreground">
                Le Vieux KOUKA va t'appeler dans les <strong>2 prochaines heures</strong> pour valider ta livraison.
                Garde ton WhatsApp ouvert 📱.
              </p>
            </div>
          )}

          {order && (
            <div className="bg-cream-2 border border-vert-bg rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs text-muted-foreground mb-1">N° de commande</div>
              <div className="font-extrabold text-vert text-base mb-3">{order.orderNumber}</div>
              <div className="text-xs text-muted-foreground mb-1">Produit</div>
              <div className="font-bold mb-3 text-sm">{order.productName}</div>
              {order.addressDetail && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">Adresse</div>
                  <div className="font-bold mb-3 text-sm">📍 {order.city} · {order.addressDetail}</div>
                </>
              )}
              {order.deliverySlot && SLOT_LABELS[order.deliverySlot] && (
                <>
                  <div className="text-xs text-muted-foreground mb-1">Créneau</div>
                  <div className="font-bold mb-3 text-sm">🕐 {SLOT_LABELS[order.deliverySlot]}</div>
                </>
              )}
              <div className="flex justify-between border-t border-vert-mid/30 pt-3 mt-2">
                <span className="font-bold">À payer en cash à la livraison</span>
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

          <Link to="/" className="text-vert-mid font-bold text-sm">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
