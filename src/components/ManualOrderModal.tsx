import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PRODUCTS, type Product } from '@/lib/products';
import { useLivreurs } from '@/lib/livreurs';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  /** Si fourni, la commande est auto-assignée à ce livreur et le sélecteur est masqué */
  forceLivreurIdx?: number | null;
  /** Préfixe du numéro de commande (ex: KOUKA, MANU, LIV) */
  orderPrefix?: string;
};

export function ManualOrderModal({ open, onClose, onCreated, forceLivreurIdx, orderPrefix = 'MANU' }: Props) {
  const { livreurs } = useLivreurs();
  const [productSlug, setProductSlug] = useState<string>(PRODUCTS[0].slug);
  const [units, setUnits] = useState<string>('1');
  const [price, setPrice] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [livreurIdx, setLivreurIdx] = useState<number | ''>(forceLivreurIdx ?? '');
  const [delivered, setDelivered] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState('');
  const [orderDate, setOrderDate] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [submitting, setSubmitting] = useState(false);

  const product = useMemo<Product>(() => PRODUCTS.find((p) => p.slug === productSlug) || PRODUCTS[0], [productSlug]);
  const productLabel = /sirop/i.test(product.name) ? 'flacons' : 'sachets';

  if (!open) return null;

  const reset = () => {
    setProductSlug(PRODUCTS[0].slug);
    setUnits('1');
    setPrice('');
    setFirstName(''); setLastName(''); setWhatsapp(''); setCity(''); setNeighborhood('');
    setLivreurIdx(forceLivreurIdx ?? '');
    setDelivered(false);
    setDeliveryFee('');
  };

  const submit = async () => {
    const qty = Math.max(1, parseInt(units, 10) || 0);
    const amount = Math.max(0, parseInt(price, 10) || 0);
    if (!firstName.trim()) { toast.error('Prénom requis'); return; }
    if (!city.trim()) { toast.error('Ville requise'); return; }
    if (!amount) { toast.error('Prix requis'); return; }

    const finalLivreurIdx = forceLivreurIdx != null ? forceLivreurIdx : (livreurIdx === '' ? null : Number(livreurIdx));

    setSubmitting(true);
    try {
      const orderNumber = `${orderPrefix}-${Date.now().toString(36).toUpperCase()}`;
      const offerLabel = `${qty} ${productLabel.toUpperCase()} — Saisie manuelle`;
      const whenIso = new Date(orderDate).toISOString();

      // Insertion en pending d'abord pour déclencher correctement les triggers de stock
      const { data: inserted, error: insErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          product_name: `${product.name} - ${offerLabel}`,
          product_price: amount,
          product_slug: product.slug,
          offer_label: offerLabel,
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
          whatsapp: whatsapp.replace(/\s/g, '') || null,
          city: city.trim(),
          neighborhood: neighborhood.trim() || null,
          status: 'pending',
          livreur_idx: finalLivreurIdx,
          delivery_fee: deliveryFee.trim() === '' ? null : Math.max(0, parseInt(deliveryFee, 10) || 0),
          source: 'Manuelle',
          ai_score: 100,
        })
        .select('id')
        .single();

      if (insErr) throw insErr;

      // Si livré, on update juste après pour déclencher la déduction de stock par trigger
      if (delivered && inserted?.id) {
        const { error: upErr } = await supabase
          .from('orders')
          .update({ status: 'delivered' })
          .eq('id', inserted.id);
        if (upErr) throw upErr;
      }

      toast.success(`✅ Commande ${orderNumber} créée${delivered ? ' (livrée)' : ''}`);
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
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold">➕ Nouvelle commande manuelle</h2>
            <p className="text-xs text-gray-500">Saisie sans formulaire client</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>

        {/* Produit */}
        <label className="block mb-2">
          <span className="text-xs font-bold text-gray-600 uppercase">Produit</span>
          <select
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {PRODUCTS.map((p) => (
              <option key={p.slug} value={p.slug}>{p.emoji} {p.name}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="block">
            <span className="text-xs font-bold text-gray-600 uppercase">Nombre de {productLabel}</span>
            <input
              type="number" min="1" value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-600 uppercase">Prix total (FCFA)</span>
            <input
              type="number" min="0" value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ex: 25000"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
        </div>

        {/* Client */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom *" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp (ex: 22670000000)" className="rounded-lg border border-gray-300 px-3 py-2 col-span-2" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ville *" className="rounded-lg border border-gray-300 px-3 py-2" />
          <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Quartier" className="rounded-lg border border-gray-300 px-3 py-2" />
        </div>

        {/* Livreur — masqué si force */}
        {forceLivreurIdx == null && (
          <label className="block mb-2">
            <span className="text-xs font-bold text-gray-600 uppercase">Livreur (optionnel)</span>
            <select
              value={livreurIdx}
              onChange={(e) => setLivreurIdx(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">— Non assigné —</option>
              {livreurs.filter((l) => l.active).map((l) => (
                <option key={l.id} value={l.idx}>{l.emoji} {l.name}</option>
              ))}
            </select>
          </label>
        )}

        {/* Livré ? */}
        <label className="flex items-center gap-2 my-3 bg-emerald-50 rounded-lg px-3 py-2 cursor-pointer">
          <input type="checkbox" checked={delivered} onChange={(e) => setDelivered(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
          <span className="text-sm font-semibold text-emerald-900">Marquer comme livrée immédiatement</span>
        </label>

        {delivered && (
          <label className="block mb-3">
            <span className="text-xs font-bold text-gray-600 uppercase">Frais de livraison encaissés (FCFA)</span>
            <input
              type="number" min="0" value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              placeholder="Laisse vide = défaut livreur"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 disabled:opacity-40"
        >
          {submitting ? '...' : 'Créer la commande'}
        </button>
      </div>
    </div>
  );
}
