import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { waSAVUrl } from '@/lib/whatsappMessages';
import type { Order } from './OrdersTab';

type SAVOrder = Order & {
  sav_followed_up_at?: string | null;
  sav_notes?: string | null;
};

const DAYS_BEFORE_SAV = 7;
const SAV_WINDOW_HOURS = 24; // Fenêtre de visibilité après J+7

function daysSince(iso: string | null | undefined): number {
  if (!iso) return 0;
  const d = new Date(iso).getTime();
  return Math.floor((Date.now() - d) / 86400000);
}

function hoursSince(iso: string | null | undefined): number {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

type SubTab = 'todo' | 'done' | 'feedback';

export function SAVTab({ orders, onChange }: { orders: Order[]; onChange: () => void }) {
  const [sub, setSub] = useState<SubTab>('todo');
  const [productFilter, setProductFilter] = useState<'all' | 'kouka' | 'sirop'>('all');
  const [savingId, setSavingId] = useState<string | null>(null);

  const all = orders as SAVOrder[];

  const delivered = useMemo(
    () => all.filter((o) => o.status === 'delivered'),
    [all]
  );

  const filterByProduct = (list: SAVOrder[]) =>
    productFilter === 'all'
      ? list
      : list.filter((o) =>
          productFilter === 'sirop'
            ? /sirop/i.test(o.product_name)
            : !/sirop/i.test(o.product_name)
        );

  // À relancer = livré il y a entre J+7 et J+8 (fenêtre de 24h) ET pas encore relancé
  const todo = useMemo(
    () =>
      filterByProduct(
        delivered.filter((o) => {
          if (o.sav_followed_up_at) return false; // relancé → disparaît immédiatement
          const d = daysSince(o.created_at);
          return d >= DAYS_BEFORE_SAV && d < DAYS_BEFORE_SAV + 1;
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delivered, productFilter]
  );

  // Relancés visibles = relancés dans les 24h dernières heures uniquement
  const done = useMemo(
    () =>
      filterByProduct(
        delivered
          .filter((o) => o.sav_followed_up_at && hoursSince(o.sav_followed_up_at) < SAV_WINDOW_HOURS)
          .sort(
            (a, b) =>
              new Date(b.sav_followed_up_at!).getTime() -
              new Date(a.sav_followed_up_at!).getTime()
          )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delivered, productFilter]
  );

  const feedback = useMemo(
    () => filterByProduct(delivered.filter((o) => o.sav_notes && o.sav_notes.trim().length > 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delivered, productFilter]
  );

  // KPIs (basés sur l'historique complet, pas sur la liste affichée)
  const startWeek = new Date(Date.now() - 7 * 86400000);
  const allDoneEver = delivered.filter((o) => o.sav_followed_up_at);
  const doneThisWeek = allDoneEver.filter(
    (o) => new Date(o.sav_followed_up_at!).getTime() >= startWeek.getTime()
  ).length;
  const feedbackRate =
    allDoneEver.length > 0 ? Math.round((feedback.length / allDoneEver.length) * 100) : 0;

  const list = sub === 'todo' ? todo : sub === 'done' ? done : feedback;

  const markFollowed = async (id: string, undo = false) => {
    setSavingId(id);
    const { error } = await supabase
      .from('orders')
      .update({ sav_followed_up_at: undo ? null : new Date().toISOString() })
      .eq('id', id);
    setSavingId(null);
    if (error) toast.error(error.message);
    else {
      toast.success(undo ? 'Marqué à relancer' : 'Marqué comme relancé ✅');
      onChange();
    }
  };

  const saveNotes = async (id: string, notes: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ sav_notes: notes })
      .eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Note enregistrée');
      onChange();
    }
  };

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <KPI label="À relancer" value={todo.length} color="bg-rouge" />
        <KPI label="Relancés (7j)" value={doneThisWeek} color="bg-vert-mid" />
        <KPI label="Taux retour" value={`${feedbackRate}%`} color="bg-or text-vert" />
      </div>

      {/* Sous-onglets */}
      <div className="flex gap-1 mb-3 bg-white p-1 rounded-2xl border-2 border-vert-bg overflow-x-auto">
        <SubBtn active={sub === 'todo'} onClick={() => setSub('todo')}>
          🔔 À relancer ({todo.length})
        </SubBtn>
        <SubBtn active={sub === 'done'} onClick={() => setSub('done')}>
          ✅ Relancés ({done.length})
        </SubBtn>
        <SubBtn active={sub === 'feedback'} onClick={() => setSub('feedback')}>
          📝 Retours ({feedback.length})
        </SubBtn>
      </div>

      {/* Filtre produit */}
      <div className="flex flex-wrap gap-2 mb-4">
        <ChipBtn active={productFilter === 'all'} onClick={() => setProductFilter('all')}>
          Tous
        </ChipBtn>
        <ChipBtn active={productFilter === 'kouka'} onClick={() => setProductFilter('kouka')}>
          🌿 Poudre
        </ChipBtn>
        <ChipBtn active={productFilter === 'sirop'} onClick={() => setProductFilter('sirop')}>
          🍯 Sirop
        </ChipBtn>
      </div>

      {list.length === 0 && (
        <div className="text-center py-10 text-muted-foreground bg-white rounded-2xl border-2 border-dashed border-vert-bg">
          {sub === 'todo'
            ? '🎉 Aucun client à relancer pour le moment.'
            : sub === 'done'
              ? 'Aucune relance enregistrée.'
              : 'Aucun retour client enregistré.'}
        </div>
      )}

      <div className="grid gap-3">
        {list.map((o) => (
          <SAVCard
            key={o.id}
            order={o}
            sub={sub}
            saving={savingId === o.id}
            onMark={() => markFollowed(o.id, sub === 'done')}
            onSaveNotes={(notes) => saveNotes(o.id, notes)}
          />
        ))}
      </div>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className={`${color} text-white rounded-2xl p-3 text-center`}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-[11px] opacity-90 font-semibold">{label}</div>
    </div>
  );
}

function SubBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-fit px-3 py-2 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap ${
        active ? 'bg-vert-mid text-white shadow' : 'text-muted-foreground hover:bg-vert-bg/50'
      }`}
    >
      {children}
    </button>
  );
}

function ChipBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
        active ? 'bg-vert text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground hover:border-vert-mid'
      }`}
    >
      {children}
    </button>
  );
}

function SAVCard({
  order,
  sub,
  saving,
  onMark,
  onSaveNotes,
}: {
  order: SAVOrder;
  sub: SubTab;
  saving: boolean;
  onMark: () => void;
  onSaveNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(order.sav_notes || '');
  const [editing, setEditing] = useState(false);
  const days = daysSince(order.created_at);
  const fullName = [order.first_name, order.last_name].filter(Boolean).join(' ') || '—';
  const waUrl = waSAVUrl({
    order_number: order.order_number,
    product_name: order.product_name,
    product_slug: order.product_slug ?? null,
    product_price: order.product_price,
    offer_label: order.offer_label,
    first_name: order.first_name,
    last_name: order.last_name,
    whatsapp: order.whatsapp,
    country: order.country,
    city: order.city,
    neighborhood: order.neighborhood,
    car_transport: order.car_transport,
  });

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-vert-bg shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="font-extrabold text-foreground truncate">
            {fullName} <span className="text-muted-foreground font-normal text-sm">· #{order.order_number}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {/sirop/i.test(order.product_name) ? '🍯 Sirop KOUKA' : '🌿 Poudre KOUKA'} · {order.city || '—'}
          </div>
        </div>
        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
          days >= 14 ? 'bg-rouge-light text-rouge' : 'bg-vert-bg text-vert'
        }`}>
          J+{days}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-fit text-center bg-[#25D366] text-white font-extrabold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            💬 Envoyer le message SAV
          </a>
        ) : (
          <span className="text-xs text-muted-foreground italic px-2">Pas de numéro WhatsApp</span>
        )}

        <button
          onClick={onMark}
          disabled={saving}
          className={`px-4 py-2.5 rounded-xl text-sm font-extrabold transition-colors disabled:opacity-50 ${
            sub === 'done'
              ? 'bg-white border-2 border-rouge text-rouge hover:bg-rouge-light'
              : 'bg-vert text-white hover:bg-vert-mid'
          }`}
        >
          {sub === 'done' ? '↩ Annuler' : '✅ Marqué comme relancé'}
        </button>
      </div>

      {/* Notes */}
      <div className="mt-3 pt-3 border-t border-vert-bg">
        {!editing && !order.sav_notes && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-vert-mid font-bold hover:underline"
          >
            + Ajouter le retour du client
          </button>
        )}

        {!editing && order.sav_notes && (
          <div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase mb-1">📝 Retour client</div>
            <div className="text-sm text-foreground bg-vert-bg/40 rounded-lg p-2.5 whitespace-pre-wrap">{order.sav_notes}</div>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-vert-mid font-bold hover:underline mt-1.5"
            >
              ✏ Modifier
            </button>
          </div>
        )}

        {editing && (
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Très satisfait, plus de saignements depuis J5. Veut recommander à son cousin."
              rows={3}
              className="w-full px-3 py-2 border-2 border-vert-bg rounded-lg outline-none focus:border-vert-mid text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { onSaveNotes(notes); setEditing(false); }}
                className="bg-vert text-white px-3 py-1.5 rounded-lg text-xs font-extrabold hover:bg-vert-mid"
              >
                💾 Enregistrer
              </button>
              <button
                onClick={() => { setNotes(order.sav_notes || ''); setEditing(false); }}
                className="bg-white border-2 border-vert-bg text-muted-foreground px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
