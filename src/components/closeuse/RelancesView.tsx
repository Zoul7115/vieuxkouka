import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Lead } from '@/lib/leads';
import { touchCloseuseActivity } from '@/lib/closeuseActivity';

type Relance = {
  id: string;
  lead_id: string;
  closeuse_idx: number;
  scheduled_at: string;
  kind: string;
  done_at: string | null;
  notes: string | null;
};

export function RelancesView({ closeuseIdx, leads }: { closeuseIdx: number; leads: Lead[] }) {
  const [relances, setRelances] = useState<Relance[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('lead_relances').select('*').eq('closeuse_idx', closeuseIdx).is('done_at', null).order('scheduled_at');
    setRelances((data || []) as Relance[]);
    setLoading(false);
  }, [closeuseIdx]);

  useEffect(() => { load(); }, [load]);

  const markDone = async (r: Relance, kind: 'called' | 'wa' | 'note') => {
    await (supabase as any).from('lead_relances').update({ done_at: new Date().toISOString(), notes: kind }).eq('id', r.id);
    await (supabase as any).from('lead_events').insert({ lead_id: r.lead_id, closeuse_idx: closeuseIdx, event_type: 'relance_done', payload: { kind: r.kind, action: kind } });
    await touchCloseuseActivity(closeuseIdx);
    toast.success('Relance effectuée');
    load();
  };

  const byLead = new Map(leads.map((l) => [l.id, l]));
  const now = Date.now();
  const due = relances.filter((r) => new Date(r.scheduled_at).getTime() <= now);
  const upcoming = relances.filter((r) => new Date(r.scheduled_at).getTime() > now);

  if (loading) return <div className="text-center text-rose-700 py-4">Chargement…</div>;
  if (relances.length === 0) return <div className="bg-white rounded-2xl p-6 text-center text-gray-500 border-2 border-rose-100">Aucune relance prévue.</div>;

  const Row = ({ r }: { r: Relance }) => {
    const lead = byLead.get(r.lead_id);
    if (!lead) return null;
    const phone = (lead.whatsapp || '').replace(/[^\d]/g, '');
    const wa = `https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${lead.first_name || ''} 👋, on en avait parlé pour ${lead.product_name}.`)}`;
    return (
      <div className="bg-white border-2 border-orange-100 rounded-xl p-3 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <div className="font-bold text-rose-900 truncate">{lead.first_name || 'Client'} · {lead.city}</div>
            <div className="text-xs text-gray-500 truncate">{lead.product_name}</div>
          </div>
          <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">{r.kind}</span>
        </div>
        <div className="flex gap-1.5 text-xs">
          <a href={`tel:+${phone}`} onClick={() => markDone(r, 'called')} className="bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold">📞 Appeler</a>
          <a href={wa} target="_blank" rel="noreferrer" onClick={() => markDone(r, 'wa')} className="bg-green-600 text-white px-3 py-1.5 rounded-full font-bold">💬 WA</a>
          <button onClick={() => markDone(r, 'note')} className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-full font-bold">✓ Fait</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {due.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-extrabold text-orange-700">🔥 À faire maintenant ({due.length})</div>
          {due.map((r) => <Row key={r.id} r={r} />)}
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-extrabold text-gray-700">⏰ À venir ({upcoming.length})</div>
          {upcoming.map((r) => <Row key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );
}
