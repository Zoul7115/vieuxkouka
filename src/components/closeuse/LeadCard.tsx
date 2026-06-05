import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type Lead, LEAD_STATUS_META, type LeadStatus, updateLeadStatus, appendLeadNote } from '@/lib/leads';
import { formatFCFA } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { RefusalModal } from './RefusalModal';

const ORDER_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'En attente',  cls: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Confirmée',   cls: 'bg-emerald-100 text-emerald-700' },
  expediee:  { label: 'Expédiée',    cls: 'bg-cyan-100 text-cyan-700' },
  delivered: { label: 'Livrée',      cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée',     cls: 'bg-red-100 text-red-700' },
};

type OrderInfo = { order_number: string | null; status: string | null; offer_label: string | null; country: string | null };
type EventRow = { id: string; event_type: string; from_status: string | null; to_status: string | null; created_at: string };

const ACTIONS: { to: LeadStatus; label: string; cls: string }[] = [
  { to: 'discussion', label: '💬 En discussion', cls: 'bg-amber-600 hover:bg-amber-700' },
  { to: 'a_relancer', label: '🔁 À relancer', cls: 'bg-orange-600 hover:bg-orange-700' },
  { to: 'valide', label: '✅ Valider', cls: 'bg-emerald-600 hover:bg-emerald-700' },
  { to: 'refusee', label: '❌ Refuser', cls: 'bg-red-600 hover:bg-red-700' },
  { to: 'annulee', label: '🚫 Annuler', cls: 'bg-gray-500 hover:bg-gray-600' },
  { to: 'perdue', label: '💀 Perdu', cls: 'bg-zinc-600 hover:bg-zinc-700' },
];

export function LeadCard({ lead }: { lead: Lead }) {
  const [busy, setBusy] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [refusalFor, setRefusalFor] = useState<LeadStatus | null>(null);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const meta = LEAD_STATUS_META[lead.status] || LEAD_STATUS_META.nouveau_lead;
  const isValidated = ['valide', 'expediee', 'livree'].includes(lead.status);
  const REFUSAL_STATUSES: LeadStatus[] = ['refusee', 'annulee', 'perdue'];

  useEffect(() => {
    let alive = true;
    (async () => {
      if (lead.order_id) {
        const { data } = await supabase
          .from('orders')
          .select('order_number,status,offer_label,country')
          .eq('id', lead.order_id)
          .maybeSingle();
        if (alive) setOrder(data as OrderInfo | null);
      }
      const { data: evs } = await supabase
        .from('lead_events')
        .select('id,event_type,from_status,to_status,created_at')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false })
        .limit(8);
      if (alive) setEvents((evs || []) as EventRow[]);
    })();
    // Realtime sur cette commande
    if (!lead.order_id) return () => { alive = false; };
    const ch = supabase
      .channel(`order-${lead.order_id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${lead.order_id}` }, (p) => {
        setOrder((prev) => ({ ...(prev || {} as OrderInfo), ...(p.new as any) }));
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [lead.id, lead.order_id, lead.status, lead.updated_at]);


  const setStatus = async (to: LeadStatus) => {
    if (to === lead.status) return;
    if (REFUSAL_STATUSES.includes(to)) { setRefusalFor(to); return; }
    setBusy(true);
    try {
      await updateLeadStatus(lead, to);
      toast.success(`Statut → ${LEAD_STATUS_META[to].label}`);
    } catch (e: any) {
      toast.error(e.message || 'Erreur');
    } finally { setBusy(false); }
  };

  const confirmRefusal = async (reason: string, comment: string) => {
    if (!refusalFor) return;
    setBusy(true);
    try {
      await updateLeadStatus(lead, refusalFor, { refusal_reason: reason, refusal_comment: comment });
      toast.success(`Statut → ${LEAD_STATUS_META[refusalFor].label}`);
      setRefusalFor(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally { setBusy(false); }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await appendLeadNote(lead, note.trim());
      toast.success('Note ajoutée');
      setNote(''); setNoteOpen(false);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  const phone = (lead.whatsapp || '').replace(/[^\d]/g, '');
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${lead.first_name || ''} 👋, c'est au sujet de votre commande ${lead.product_name}.`)}`;
  const telUrl = `tel:+${phone}`;

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-100 p-4 space-y-3 shadow-sm">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-rose-900 truncate flex items-center gap-1">
            {lead.first_name || 'Client'} {lead.last_name || ''}
            {isValidated && <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">🔒</span>}
          </div>
          <div className="text-xs text-gray-600 truncate">{lead.product_name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{lead.city || '—'} · {new Date(lead.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${meta.cls}`}>{meta.emoji} {meta.label}</span>
      </div>

      {isValidated && (
        <div className="text-[11px] bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 text-amber-900">
          🔒 <b>Commande verrouillée.</b> Les infos client ne peuvent plus être modifiées. Contacte l'admin si nécessaire.
        </div>
      )}

      {(lead as any).refusal_reason && (
        <div className="text-[11px] bg-red-50 border border-red-200 rounded-lg px-2 py-1 text-red-900">
          <b>Motif refus :</b> {(lead as any).refusal_reason}
          {(lead as any).refusal_comment ? ` — ${(lead as any).refusal_comment}` : ''}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 text-xs">
        <a href={telUrl} className="bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold">📞 Appeler</a>
        <a href={waUrl} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-3 py-1.5 rounded-full font-bold">💬 WhatsApp</a>
        <button onClick={() => setNoteOpen((v) => !v)} className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-full font-bold">📝 Note</button>
        <div className="ml-auto text-xs font-extrabold text-rose-700 self-center">{formatFCFA(lead.product_price)}</div>
      </div>

      {noteOpen && (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: rappeler demain matin"
            className="w-full px-3 py-2 border-2 border-rose-200 rounded-lg text-sm outline-none focus:border-rose-500"
            rows={2}
          />
          <button disabled={busy} onClick={saveNote} className="w-full bg-rose-600 text-white font-bold py-1.5 rounded-lg text-sm disabled:opacity-50">
            Ajouter
          </button>
        </div>
      )}

      {lead.notes && (
        <div className="text-xs bg-rose-50 border border-rose-100 rounded-lg p-2 whitespace-pre-wrap text-gray-700">
          {lead.notes}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-rose-100">
        {ACTIONS.map((a) => (
          <button
            key={a.to}
            disabled={busy || a.to === lead.status}
            onClick={() => setStatus(a.to)}
            className={`text-xs text-white font-bold px-2.5 py-1 rounded-lg disabled:opacity-40 ${a.cls}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <RefusalModal
        open={refusalFor !== null}
        title={refusalFor ? `Motif : ${LEAD_STATUS_META[refusalFor].label}` : ''}
        onCancel={() => setRefusalFor(null)}
        onConfirm={confirmRefusal}
      />
    </div>
  );
}
