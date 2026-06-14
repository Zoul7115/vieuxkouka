import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PRODUCTS, COUNTRIES, type Product, type Offer } from '@/lib/products';
import { updateLeadStatus, type Lead } from '@/lib/leads';
import type { CloseuseSession } from '@/lib/closeuse-auth';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  session: CloseuseSession;
  closeuseSlug: string | null;
};

const db = supabase as any;

export function ManualLeadModal({ open, onClose, onCreated, session, closeuseSlug }: Props) {
  const [productSlug, setProductSlug] = useState<string>(PRODUCTS[0].slug);
  const product = useMemo<Product>(() => PRODUCTS.find((p) => p.slug === productSlug) || PRODUCTS[0], [productSlug]);
  const [offerId, setOfferId] = useState<number>(product.offers.find((o) => o.recommended)?.id ?? product.offers[0].id);
  const offer = useMemo<Offer>(() => product.offers.find((o) => o.id === offerId) || product.offers[0], [product, offerId]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('BF');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [validateNow, setValidateNow] = useState(true);
  const [markDelivered, setMarkDelivered] = useState(false);
  const [orderDate, setOrderDate] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleProductChange = (slug: string) => {
    setProductSlug(slug);
    const p = PRODUCTS.find((x) => x.slug === slug)!;
    setOfferId(p.offers.find((o) => o.recommended)?.id ?? p.offers[0].id);
  };

  const reset = () => {
    setFirstName(''); setLastName(''); setWhatsapp(''); setCity(''); setNeighborhood(''); setAddressDetail('');
    setProductSlug(PRODUCTS[0].slug);
    setOfferId(PRODUCTS[0].offers.find((o) => o.recommended)?.id ?? PRODUCTS[0].offers[0].id);
    setValidateNow(true);
  };

  const submit = async () => {
    if (!firstName.trim()) { toast.error('Prénom requis'); return; }
    if (!whatsapp.trim()) { toast.error('WhatsApp requis'); return; }
    if (!city.trim()) { toast.error('Ville requise'); return; }
    setSubmitting(true);
    try {
      const country = COUNTRIES.find((c) => c.code === countryCode)?.label.replace(/^[^\s]+\s/, '') || '';
      const whenIso = new Date(orderDate).toISOString();
      const { data: inserted, error } = await db.from('leads').insert({
        closeuse_idx: session.idx,
        closeuse_slug: closeuseSlug || session.name.toLowerCase(),
        product_slug: product.slug,
        product_name: product.name,
        offer_label: offer.label,
        product_price: offer.price,
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        whatsapp: whatsapp.replace(/\s/g, ''),
        country,
        city: city.trim(),
        neighborhood: neighborhood.trim() || null,
        address_detail: addressDetail.trim() || null,
        status: 'nouveau_lead',
        source: 'closeuse-manual',
        created_at: whenIso,
      }).select('*').single();
      if (error) throw error;

      if (validateNow && inserted) {
        await updateLeadStatus(inserted as Lead, 'valide', { at: whenIso });

        if (markDelivered) {
          // Marquer la commande comme livrée à la date choisie (pour compta/bilan/salaires)
          await db.from('orders')
            .update({ status: 'delivered', delivered_at: whenIso })
            .eq('lead_id', inserted.id);
          await db.from('leads')
            .update({ status: 'livree' })
            .eq('id', inserted.id);
        }
      }

      toast.success(
        markDelivered ? '✅ Commande créée et marquée livrée'
        : validateNow ? '✅ Commande créée et validée'
        : '✅ Lead créé'
      );
      reset();
      onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Erreur création');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-rose-900">➕ Nouvelle commande</h2>
            <p className="text-xs text-gray-500">Saisie manuelle (téléphone, DM, etc.)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>

        <label className="block mb-2">
          <span className="text-xs font-bold text-gray-600 uppercase">Produit</span>
          <select value={productSlug} onChange={(e) => handleProductChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
            {PRODUCTS.map((p) => <option key={p.slug} value={p.slug}>{p.emoji} {p.name}</option>)}
          </select>
        </label>

        <label className="block mb-2">
          <span className="text-xs font-bold text-gray-600 uppercase">Offre</span>
          <select value={offerId} onChange={(e) => setOfferId(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
            {product.offers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label} — {o.price.toLocaleString('fr-FR')} FCFA
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom *" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp * (ex: 22670000000)" className="rounded-lg border border-gray-300 px-3 py-2 col-span-2" />
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ville *" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Quartier" className="rounded-lg border border-gray-300 px-3 py-2 col-span-2" />
          <input value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="Détail adresse (optionnel)" className="rounded-lg border border-gray-300 px-3 py-2 col-span-2" />
        </div>

        <label className="flex items-center gap-2 my-3 bg-emerald-50 rounded-lg px-3 py-2 cursor-pointer">
          <input type="checkbox" checked={validateNow} onChange={(e) => setValidateNow(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
          <span className="text-sm font-semibold text-emerald-900">✅ Valider immédiatement (créer la commande)</span>
        </label>

        <label className="block mb-3">
          <span className="text-xs font-bold text-gray-600 uppercase">📅 Date de la commande</span>
          <input
            type="datetime-local"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          <span className="text-[11px] text-gray-500">Utilisée pour l'historique, la compta et les stats.</span>
        </label>

        <button onClick={submit} disabled={submitting} className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 disabled:opacity-40">
          {submitting ? '...' : 'Créer'}
        </button>
      </div>
    </div>
  );
}
