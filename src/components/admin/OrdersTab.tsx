import { useState } from 'react';
import { formatFCFA } from '@/lib/products';
import { useLivreurs, effectiveDeliveryFee, type Livreur } from '@/lib/livreurs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { waClientUrl, waLivreurUrl } from '@/lib/whatsappMessages';

export const STATUSES: Record<string, { label: string; cls: string }> = {
  pending: { label: 'En attente', cls: 'bg-[oklch(0.95_0.10_85)] text-[oklch(0.40_0.10_82)]' },
  confirmed: { label: 'Confirmée', cls: 'bg-[oklch(0.92_0.06_240)] text-[oklch(0.40_0.15_240)]' },
  delivered: { label: 'Livrée', cls: 'bg-vert-bg text-vert' },
  cancelled: { label: 'Annulée', cls: 'bg-rouge-light text-rouge' },
  approche: { label: 'Approche', cls: 'bg-[oklch(0.92_0.08_300)] text-[oklch(0.40_0.18_300)]' },
  suivi: { label: 'Suivi', cls: 'bg-[oklch(0.94_0.10_55)] text-[oklch(0.45_0.15_55)]' },
};

export type Order = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  offer_label: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  neighborhood?: string | null;
  car_transport?: string | null;
  status: string;
  livreur_idx: number | null;
  delivery_fee?: number | null;
  created_at: string;
};

export function OrdersTab({
  orders,
  onUpdateStatus,
  onAssignLivreur,
}: {
  orders: Order[];
  onUpdateStatus: (id: string, status: string) => void;
  onAssignLivreur: (id: string, livreurIdx: number | null) => void;
}) {
  const [filter, setFilter] = useState<string>('all');
  const { livreurs } = useLivreurs();
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const activeLivreurs = livreurs.filter((l) => l.active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Tous ({orders.length})</FilterBtn>
        {Object.entries(STATUSES).map(([k, v]) => (
          <FilterBtn key={k} active={filter === k} onClick={() => setFilter(k)}>
            {v.label} ({orders.filter((o) => o.status === k).length})
          </FilterBtn>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground bg-white rounded-2xl border-2 border-dashed border-vert-bg">
          Aucune commande dans cette catégorie.
        </div>
      )}

      <div className="grid gap-3">
        {filtered.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            livreurs={livreurs}
            activeLivreurs={activeLivreurs}
            onUpdateStatus={onUpdateStatus}
            onAssignLivreur={onAssignLivreur}
          />
        ))}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors ${
        active ? 'bg-vert-mid text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground hover:border-vert-mid'
      }`}
    >
      {children}
    </button>
  );
}

function OrderCard({
  order,
  livreurs,
  activeLivreurs,
  onUpdateStatus,
  onAssignLivreur,
}: {
  order: Order;
  livreurs: Livreur[];
  activeLivreurs: Livreur[];
  onUpdateStatus: (id: string, status: string) => void;
  onAssignLivreur: (id: string, livreurIdx: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [feeInput, setFeeInput] = useState<string>(order.delivery_fee != null ? String(order.delivery_fee) : '');
  const [savingFee, setSavingFee] = useState(false);
  const status = STATUSES[order.status] || STATUSES.pending;
  const livreur = livreurs.find((l) => l.idx === order.livreur_idx);
  const clientUrl = waClientUrl(order);
  const effFee = effectiveDeliveryFee(livreurs, order);
  const net = order.product_price - effFee;

  const saveFee = async () => {
    setSavingFee(true);
    const value = feeInput.trim() === '' ? null : Math.max(0, parseInt(feeInput, 10) || 0);
    const { error } = await supabase.from('orders').update({ delivery_fee: value }).eq('id', order.id);
    setSavingFee(false);
    if (error) toast.error(error.message);
    else toast.success(value == null ? 'Frais réinitialisés (défaut livreur)' : `Frais : ${formatFCFA(value)}`);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-vert-bg/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-vert">{order.order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${status.cls}`}>{status.label}</span>
            {livreur && <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-cream-2 text-vert">{livreur.emoji} {livreur.name}</span>}
          </div>
          <div className="text-sm text-foreground mt-1 truncate">
            {order.first_name} {order.last_name} · {order.city}
          </div>
          <div className="text-xs text-muted-foreground truncate">{order.offer_label || order.product_name}</div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <div className="font-extrabold text-vert">{formatFCFA(order.product_price)}</div>
          <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
        </div>
      </button>

      {open && (
        <div className="border-t-2 border-vert-bg p-4 bg-cream-2/40 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">WhatsApp :</span> <span className="font-bold">{order.whatsapp}</span></div>
            <div><span className="text-muted-foreground">Pays :</span> {order.country}</div>
            <div><span className="text-muted-foreground">Ville :</span> {order.city}</div>
            {order.car_transport && <div><span className="text-muted-foreground">Transport :</span> {order.car_transport}</div>}
            <div className="sm:col-span-2"><span className="text-muted-foreground">Date :</span> {new Date(order.created_at).toLocaleString('fr-FR')}</div>
          </div>

          {/* 3 boutons WhatsApp */}
          <div className="grid sm:grid-cols-3 gap-2">
            {clientUrl && (
              <a
                href={clientUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white text-center py-2.5 px-3 rounded-xl font-extrabold text-xs hover:bg-[#1da851] transition-colors"
              >
                💬 1. Confirmer client
              </a>
            )}
            {activeLivreurs.slice(0, 2).map((l, i) => (
              <a
                key={l.id}
                href={waLivreurUrl(order, l)}
                target="_blank"
                rel="noreferrer"
                className="bg-vert-mid text-white text-center py-2.5 px-3 rounded-xl font-extrabold text-xs hover:bg-vert transition-colors"
              >
                🛵 {i + 2}. Notif {l.name.split(' ')[0]}
              </a>
            ))}
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Statut</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUSES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => onUpdateStatus(order.id, k)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${v.cls} hover:scale-105 ${order.status === k ? 'ring-2 ring-vert-mid' : ''}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Assigner livreur</div>
            <select
              value={order.livreur_idx ?? ''}
              onChange={(e) => onAssignLivreur(order.id, e.target.value ? parseInt(e.target.value) : null)}
              className="text-sm border-2 border-vert-bg rounded-lg px-3 py-1.5 outline-none focus:border-vert-mid"
            >
              <option value="">— Non assigné —</option>
              {activeLivreurs.map((l) => (
                <option key={l.id} value={l.idx}>{l.emoji} {l.name} ({l.zone})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Frais de livraison</div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min="0"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                placeholder={`Défaut livreur : ${formatFCFA(livreur?.delivery_fee ?? 2000)}`}
                className="text-sm border-2 border-vert-bg rounded-lg px-3 py-1.5 outline-none focus:border-vert-mid w-44"
              />
              <button
                onClick={saveFee}
                disabled={savingFee}
                className="text-xs px-3 py-1.5 rounded-full font-extrabold bg-vert-mid text-white hover:bg-vert disabled:opacity-50"
              >
                {savingFee ? '…' : '💾 Enregistrer'}
              </button>
              {order.delivery_fee != null && (
                <button
                  onClick={() => { setFeeInput(''); }}
                  className="text-xs px-3 py-1.5 rounded-full font-bold bg-cream-2 text-vert"
                  title="Vider pour utiliser le défaut du livreur"
                >
                  ↺ Défaut
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                Effectif : <span className="font-bold text-rouge">−{formatFCFA(effFee)}</span> · Net à encaisser : <span className="font-extrabold text-vert">{formatFCFA(net)}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
