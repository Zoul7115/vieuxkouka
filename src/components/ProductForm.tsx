import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { OfferSelector } from './OfferSelector';
import { PreFormWhatsApp } from './PreFormWhatsApp';
import { COUNTRIES, formatFCFA, type Offer, type Product } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BUMP_PRICE = 5000;

export function ProductForm({ product }: { product: Product }) {
  const navigate = useNavigate();
  const recommended = product.offers.find((o) => o.recommended) || product.offers[0];
  const [offer, setOffer] = useState<Offer>(recommended);
  const [bumpAccepted, setBumpAccepted] = useState(false);
  // Bump dispo uniquement quand on n'est pas déjà sur la meilleure offre
  const bumpAvailable = !offer.bestValue;
  const finalPrice = offer.price + (bumpAccepted && bumpAvailable ? BUMP_PRICE : 0);
  const finalUnits = offer.units + (bumpAccepted && bumpAvailable ? 1 : 0);
  const productLabel = /sirop/i.test(product.name) ? 'flacon' : 'sachet';
  const [form, setForm] = useState({
    fullName: '',
    countryCode: 'BF',
    whatsapp: '',
    city: '',
    horsOuaga: false,
    carTransport: '',
    available: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const country = COUNTRIES.find((c) => c.code === form.countryCode) || COUNTRIES[0];

  const update = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Obligatoire';
    if (!form.city.trim()) e.city = 'Obligatoire';
    if (!form.countryCode) e.countryCode = 'Obligatoire';
    const tel = form.whatsapp.replace(/\s/g, '');
    if (!/^[0-9]{6,12}$/.test(tel)) e.whatsapp = 'Numéro invalide';
    if (form.horsOuaga && !form.carTransport.trim()) e.carTransport = 'Indiquez la compagnie + ville';
    if (!form.available) e.available = 'Confirmation obligatoire';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      toast.error('Merci de compléter tous les champs.');
      return;
    }
    setSubmitting(true);
    try {
      const orderNumber = `KOUKA-${Date.now().toString(36).toUpperCase()}`;
      const [first, ...rest] = form.fullName.trim().split(' ');
      const fullPhone = country.prefix + form.whatsapp.replace(/\s/g, '');

      const bumpSuffix = bumpAccepted && bumpAvailable ? ` + 1 ${productLabel} BUMP` : '';
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        product_name: `${product.name} - ${offer.label}${bumpSuffix}`,
        product_price: finalPrice,
        product_slug: product.slug,
        offer_label: offer.label + bumpSuffix,
        first_name: first,
        last_name: rest.join(' '),
        whatsapp: fullPhone,
        country: country.label.replace(/^.{1,4}\s/, ''),
        city: form.city,
        car_transport: form.horsOuaga ? form.carTransport : null,
        is_available: form.available,
        status: 'pending',
        ai_score: 80,
        source: typeof document !== 'undefined' ? document.referrer || 'Direct' : 'Direct',
      });

      if (error) throw error;

      sessionStorage.setItem(
        'kouka_last_order',
        JSON.stringify({
          orderNumber,
          firstName: first,
          productName: product.name,
          offerLabel: offer.label + bumpSuffix,
          price: finalPrice,
          whatsapp: fullPhone,
          city: form.city,
        })
      );

      // Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: finalPrice,
          currency: 'XOF',
          content_name: product.name,
        });
      }

      navigate({ to: '/thank-you' });
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur d'envoi : " + (err.message || 'Réessayez.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="order-section"
      className="bg-vert py-14 px-0"
      style={{ background: 'linear-gradient(180deg, var(--vert-mid), var(--vert))' }}
    >
      <div className="container-kouka">
        <h2 className="text-white text-center mb-2">
          Commande {product.name === 'Sirop KOUKA' ? 'le' : 'la'} {product.name}
          <br />
          <span className="text-base font-medium opacity-85">Traitement {product.pathology.toLowerCase()}</span>
        </h2>
        <p className="text-center text-white/85 mb-6 text-base">
          Remplis le formulaire — on te contacte sous 2h sur WhatsApp pour confirmer ta livraison.
        </p>

        <OfferSelector offers={product.offers} selectedId={offer.id} onSelect={(o) => { setOffer(o); setBumpAccepted(false); }} />

        {bumpAvailable && (
          <label className="max-w-[480px] mx-auto mb-4 flex items-start gap-3 bg-[oklch(0.97_0.06_92)] border-2 border-dashed border-or rounded-xl p-3.5 cursor-pointer hover:bg-[oklch(0.95_0.08_92)] transition-colors">
            <input
              type="checkbox"
              checked={bumpAccepted}
              onChange={(e) => setBumpAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-or"
            />
            <span className="text-sm text-foreground leading-relaxed flex-1">
              🎁 <strong>OUI, j'ajoute 1 {productLabel} supplémentaire</strong> pour seulement
              <strong className="text-rouge"> +{formatFCFA(BUMP_PRICE)}</strong>
              <span className="block text-xs text-muted-foreground mt-0.5">
                (Valeur réelle : {formatFCFA(/sirop/i.test(product.name) ? 12000 : 10000)} — économise{' '}
                {formatFCFA((/sirop/i.test(product.name) ? 12000 : 10000) - BUMP_PRICE)})
              </span>
            </span>
          </label>
        )}

        <div className="bg-vert-bg border-2 border-[oklch(0.85_0.08_145)] rounded-xl px-4 py-3.5 mb-5 flex justify-between items-center flex-wrap gap-2 max-w-[480px] mx-auto">
          <div>
            <div className="text-sm text-muted-foreground font-semibold">Total à payer</div>
            <div className="text-lg font-extrabold text-foreground">
              {finalUnits} {productLabel}{finalUnits > 1 ? 's' : ''} · {offer.label.split('—')[0].trim()}
              {bumpAccepted && bumpAvailable && <span className="text-or"> +1 BUMP</span>}
            </div>
          </div>
          <div className="text-right">
            {(offer.oldPrice + (bumpAccepted && bumpAvailable ? (/sirop/i.test(product.name) ? 12000 : 10000) : 0)) > finalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatFCFA(offer.oldPrice + (bumpAccepted && bumpAvailable ? (/sirop/i.test(product.name) ? 12000 : 10000) : 0))}
              </div>
            )}
            <div className="text-3xl font-extrabold text-vert leading-none">{formatFCFA(finalPrice)}</div>
            {offer.saving && <div className="text-xs text-rouge font-bold">🎁 {offer.saving}</div>}
          </div>
        </div>

        <PreFormWhatsApp productName={product.name} />

        <div className="bg-white rounded-2xl p-6 sm:p-9 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-[480px] mx-auto">
          <Field label="Prénom & Nom" required error={errors.fullName}>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              placeholder="Ibrahim Diallo"
              className={inputCls(errors.fullName)}
            />
          </Field>

          <Field label="Pays" required error={errors.countryCode}>
            <select
              value={form.countryCode}
              onChange={(e) => update('countryCode', e.target.value)}
              className={inputCls(errors.countryCode) + ' appearance-none'}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="WhatsApp" required error={errors.whatsapp}>
            <div className="flex gap-2">
              <div className="px-3.5 py-3.5 bg-cream-2 border-2 border-vert-bg rounded-xl font-bold min-w-[72px] text-center">
                {country.prefix}
              </div>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="58 44 48 18"
                className={inputCls(errors.whatsapp) + ' flex-1'}
              />
            </div>
          </Field>

          <Field label="Ville / Quartier" required error={errors.city}>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="Ouagadougou / Tanghin"
              className={inputCls(errors.city)}
            />
          </Field>

          <label className="flex items-start gap-3 bg-[oklch(0.97_0.06_92)] border-2 border-or-light rounded-xl p-3.5 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.horsOuaga}
              onChange={(e) => update('horsOuaga', e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-or"
            />
            <span className="text-base text-muted-foreground leading-relaxed">
              📦 <strong>Je suis en dehors de Ouagadougou</strong> — expédition par car de transport
            </span>
          </label>

          {form.horsOuaga && (
            <Field label="Compagnie de transport + ville" required error={errors.carTransport}>
              <input
                type="text"
                value={form.carTransport}
                onChange={(e) => update('carTransport', e.target.value)}
                placeholder="Ex : STAF Koudougou ou SARAMAYYA Bobo-Dioulasso"
                className={inputCls(errors.carTransport)}
              />
            </Field>
          )}

          <label className="flex items-start gap-3 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => update('available', e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-vert-mid"
            />
            <span className="text-base text-muted-foreground leading-relaxed">
              <strong>Je suis disponible</strong> pour recevoir ma commande dans les <strong>24h</strong> et suis joignable sur WhatsApp.
            </span>
          </label>
          {errors.available && <div className="text-rouge text-sm mb-3">{errors.available}</div>}

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full p-5 bg-vert-mid text-white rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(46,125,50,0.4)] hover:bg-vert hover:-translate-y-0.5 transition-all disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {submitting ? '⏳ Envoi en cours…' : `🌿 COMMANDER — PAYER À LA LIVRAISON · ${formatFCFA(finalPrice)}`}
          </button>
        </div>

        <div className="flex gap-2 justify-center flex-wrap mt-4">
          {['🔒 Paiement livraison', '📦 Emballage discret', '↩️ Remboursé si insatisfait', '🌿 100% naturel'].map((t) => (
            <span
              key={t}
              className="text-sm text-white/90 bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const inputCls = (err?: string) =>
  `w-full px-4 py-3.5 border-2 rounded-xl text-base bg-white outline-none transition-colors ${
    err ? 'border-rouge' : 'border-vert-bg focus:border-vert-mid'
  }`;

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-muted-foreground mb-1.5">
        {label} {required && <span className="text-rouge">*</span>}
      </label>
      {children}
      {error && <div className="text-rouge text-sm mt-1.5">{error}</div>}
    </div>
  );
}
