import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { COUNTRIES, formatFCFA, type Offer, type Product } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { trackFB } from '@/lib/facebookPixel';
import { toast } from 'sonner';

const quickOrderSchema = z.object({
  fullName: z.string().trim().min(2, 'Nom trop court').max(80, 'Nom trop long'),
  whatsapp: z.string().trim().regex(/^[0-9\s]{6,15}$/, 'Numéro invalide'),
  city: z.string().trim().min(2, 'Ville requise').max(60, 'Ville trop longue'),
});

export function QuickOrderModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  const navigate = useNavigate();
  const recommended = product.offers.find((o) => o.recommended) || product.offers[0];
  const [offer, setOffer] = useState<Offer>(recommended);
  const [form, setForm] = useState({ fullName: '', whatsapp: '', city: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const productLabel = /sirop/i.test(product.name) ? 'flacon' : 'sachet';

  // Restaure brouillon
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem('kouka_form_draft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft) {
        setForm((f) => ({
          fullName: draft.fullName || f.fullName,
          whatsapp: draft.whatsapp || f.whatsapp,
          city: draft.city || f.city,
        }));
      }
    } catch {}
  }, [open]);

  // Lock scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      trackFB('InitiateCheckout', { value: offer.price, currency: 'XOF', content_name: product.name });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      try {
        localStorage.setItem('kouka_form_draft', JSON.stringify({ ...next, ts: Date.now() }));
      } catch {}
      return next;
    });
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = async () => {
    const result = quickOrderSchema.safeParse(form);
    if (!result.success) {
      const e: Record<string, string> = {};
      result.error.issues.forEach((i) => { e[i.path[0] as string] = i.message; });
      setErrors(e);
      toast.error('Vérifie tes infos.');
      return;
    }
    setSubmitting(true);
    try {
      const orderNumber = `KOUKA-${Date.now().toString(36).toUpperCase()}`;
      const [first, ...rest] = result.data.fullName.split(' ');
      const country = COUNTRIES[0]; // Burkina par défaut (95% du trafic)
      const fullPhone = country.prefix + result.data.whatsapp.replace(/\s/g, '');

      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        product_name: `${product.name} - ${offer.label}`,
        product_price: offer.price,
        product_slug: product.slug,
        offer_label: offer.label,
        first_name: first,
        last_name: rest.join(' ') || '',
        whatsapp: fullPhone,
        country: 'Burkina Faso',
        city: result.data.city,
        car_transport: null,
        is_available: true,
        status: 'pending',
        ai_score: 75,
        source: typeof document !== 'undefined' ? (document.referrer || 'Quick-Hero') : 'Quick-Hero',
      });
      if (error) throw error;

      try { localStorage.removeItem('kouka_form_draft'); } catch {}
      sessionStorage.setItem('kouka_last_order', JSON.stringify({
        orderNumber, firstName: first, productName: product.name,
        offerLabel: offer.label, price: offer.price, whatsapp: fullPhone, city: result.data.city,
      }));

      trackFB('Purchase', { value: offer.price, currency: 'XOF', content_name: product.name }, {
        phone: fullPhone, country: 'Burkina Faso', city: result.data.city,
      });
      trackFB('Lead', { value: offer.price, currency: 'XOF', content_name: product.name }, {
        phone: fullPhone, country: 'Burkina Faso', city: result.data.city,
      });

      navigate({ to: '/thank-you' });
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur d'envoi : " + (err.message || 'Réessayez.'));
    } finally {
      setSubmitting(false);
    }
  };

  const ctaTone = /sirop/i.test(product.name) ? 'rouge' : 'vert';
  const ctaBg = ctaTone === 'rouge' ? 'bg-rouge' : 'bg-vert-mid';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${ctaBg} text-white p-4 sm:rounded-t-2xl rounded-t-2xl flex items-start justify-between gap-3 sticky top-0 z-10`}>
          <div>
            <div className="text-xs font-bold opacity-90 uppercase tracking-wider">⚡ Commande rapide · 30 secondes</div>
            <div className="text-base font-extrabold leading-tight mt-0.5">Paiement à la livraison · Cash</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none p-1" aria-label="Fermer">×</button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Sélecteur d'offres compact */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
              1. Choisis ton pack
            </div>
            <div className="grid gap-2">
              {product.offers.map((o) => {
                const sel = offer.id === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => { setOffer(o); trackFB('AddToCart', { value: o.price, currency: 'XOF', content_name: `${product.name} · ${o.label}` }); }}
                    className={`text-left rounded-xl p-3 border-2 transition-all flex items-center gap-3 ${
                      sel ? 'border-rouge bg-rouge-light' : 'border-vert-bg bg-white hover:border-vert-mid'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${sel ? 'border-rouge bg-rouge' : 'border-muted-foreground/40'}`}>
                      {sel && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-foreground leading-tight">{o.label.split('—')[0].trim()}</div>
                      {o.saving && <div className="text-[11px] text-rouge font-bold">🎁 {o.saving}</div>}
                    </div>
                    <div className="text-right shrink-0">
                      {o.oldPrice > o.price && <div className="text-[11px] text-muted-foreground line-through">{formatFCFA(o.oldPrice)}</div>}
                      <div className="text-base font-extrabold text-vert leading-none">{formatFCFA(o.price)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form 3 champs */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
              2. Tes infos de livraison
            </div>
            <div className="space-y-2.5">
              <div>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="Prénom & Nom *"
                  maxLength={80}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base outline-none ${errors.fullName ? 'border-rouge' : 'border-vert-bg focus:border-vert-mid'}`}
                />
                {errors.fullName && <div className="text-rouge text-xs mt-1">{errors.fullName}</div>}
              </div>
              <div>
                <div className="flex gap-2">
                  <div className="px-3 py-3 bg-cream-2 border-2 border-vert-bg rounded-xl font-bold text-sm shrink-0">+226</div>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => update('whatsapp', e.target.value)}
                    placeholder="WhatsApp · 70 00 00 00 *"
                    maxLength={15}
                    className={`flex-1 min-w-0 px-4 py-3 border-2 rounded-xl text-base outline-none ${errors.whatsapp ? 'border-rouge' : 'border-vert-bg focus:border-vert-mid'}`}
                  />
                </div>
                {errors.whatsapp && <div className="text-rouge text-xs mt-1">{errors.whatsapp}</div>}
                <div className="text-[11px] text-muted-foreground mt-1">Hors Burkina ? <button type="button" onClick={onClose} className="text-vert font-bold underline">Utilise le formulaire complet</button></div>
              </div>
              <div>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Ville / Quartier *"
                  maxLength={60}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base outline-none ${errors.city ? 'border-rouge' : 'border-vert-bg focus:border-vert-mid'}`}
                />
                {errors.city && <div className="text-rouge text-xs mt-1">{errors.city}</div>}
              </div>
            </div>
          </div>

          {/* Trust + total */}
          <div className="bg-vert-bg/50 border-2 border-vert-bg rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="text-xs font-bold text-vert">
              💵 Tu paies à la livraison<br />
              <span className="text-[11px] font-semibold text-muted-foreground">🛡️ Remboursé si pas satisfait</span>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">Total à payer</div>
              <div className="text-2xl font-extrabold text-vert leading-none">{formatFCFA(offer.price)}</div>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={submitting}
            className={`w-full p-4 ${ctaBg} text-white rounded-xl text-base font-extrabold shadow-lg hover:brightness-110 transition-all disabled:opacity-55`}
          >
            {submitting ? '⏳ Envoi…' : `🌿 VALIDER MA COMMANDE · ${formatFCFA(offer.price)}`}
          </button>
          <p className="text-center text-[11px] text-muted-foreground -mt-2">
            🔒 Aucun paiement en ligne · On t'appelle sous 2h sur WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
