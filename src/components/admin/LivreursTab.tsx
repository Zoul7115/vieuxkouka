import { useMemo } from 'react';
import { LIVREURS } from '@/lib/livreurs';
import { formatFCFA } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Order = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  city: string | null;
  status: string;
  livreur_idx: number | null;
  created_at: string;
};

export function LivreursTab({ orders, onChange }: { orders: Order[]; onChange: () => void }) {
  const assigned = useMemo(() => {
    const map: Record<number, Order[]> = {};
    LIVREURS.forEach((l) => { map[l.idx] = []; });
    orders.forEach((o) => {
      if (o.livreur_idx != null && map[o.livreur_idx]) {
        map[o.livreur_idx].push(o);
      }
    });
    return map;
  }, [orders]);

  const unassigned = orders.filter((o) => o.livreur_idx == null && o.status !== 'cancelled' && o.status !== 'delivered');

  const assign = async (orderId: string, livreurIdx: number | null) => {
    const { error } = await supabase.from('orders').update({ livreur_idx: livreurIdx }).eq('id', orderId);
    if (error) toast.error(error.message);
    else {
      toast.success(livreurIdx != null ? `Assigné à ${LIVREURS.find((l) => l.idx === livreurIdx)?.name}` : 'Désassigné');
      onChange();
    }
  };

  return (
    <div className="space-y-5">
      {/* Cartes livreurs */}
      <div className="grid sm:grid-cols-2 gap-3">
        {LIVREURS.map((l) => {
          const ods = assigned[l.idx] || [];
          const enCours = ods.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
          const livrees = ods.filter((o) => o.status === 'delivered');
          const ca = livrees.reduce((s, o) => s + o.product_price, 0);
          const waUrl = `https://wa.me/${l.whatsapp}`;
          return (
            <div key={l.idx} className="bg-white rounded-2xl border-2 border-vert-bg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-extrabold text-vert text-lg">{l.emoji} {l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.zone}</div>
                </div>
                <a href={waUrl} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white text-xs px-3 py-1.5 rounded-full font-bold hover:bg-[#1da851]">
                  💬 WA
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Mini label="En cours" value={enCours.toString()} />
                <Mini label="Livrées" value={livrees.length.toString()} />
                <Mini label="CA" value={formatFCFA(ca)} small />
              </div>
            </div>
          );
        })}
      </div>

      {/* Non assignées */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">📋 Non assignées ({unassigned.length})</h3>
        {unassigned.length === 0 && <div className="text-sm text-muted-foreground">Toutes les commandes sont assignées 🎉</div>}
        <div className="space-y-2">
          {unassigned.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-vert-bg/40 pb-2">
              <div className="text-sm">
                <div className="font-bold text-vert">{o.order_number}</div>
                <div className="text-xs text-muted-foreground">{o.first_name} · {o.city} · {o.product_name}</div>
              </div>
              <select
                onChange={(e) => assign(o.id, e.target.value ? parseInt(e.target.value) : null)}
                defaultValue=""
                className="text-sm border-2 border-vert-bg rounded-lg px-2 py-1.5 outline-none focus:border-vert-mid"
              >
                <option value="">Assigner à…</option>
                {LIVREURS.map((l) => (
                  <option key={l.idx} value={l.idx}>{l.emoji} {l.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Détail par livreur */}
      {LIVREURS.map((l) => {
        const ods = (assigned[l.idx] || []).filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
        if (ods.length === 0) return null;
        return (
          <div key={l.idx} className="bg-white rounded-2xl border-2 border-vert-bg p-5">
            <h3 className="font-extrabold text-vert mb-3">{l.emoji} {l.name} — {ods.length} en cours</h3>
            <div className="space-y-2">
              {ods.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b border-vert-bg/40 pb-2">
                  <div>
                    <div className="font-bold">{o.order_number} — {o.first_name}</div>
                    <div className="text-xs text-muted-foreground">{o.city} · {o.whatsapp}</div>
                  </div>
                  <button onClick={() => assign(o.id, null)} className="text-xs text-rouge font-bold hover:underline">
                    Désassigner
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Mini({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-cream rounded-lg p-2">
      <div className="text-[10px] uppercase font-bold text-muted-foreground">{label}</div>
      <div className={`font-extrabold text-vert ${small ? 'text-xs' : 'text-base'}`}>{value}</div>
    </div>
  );
}
