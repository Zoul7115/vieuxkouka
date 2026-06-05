import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LeadStatus =
  | 'nouveau_lead'
  | 'discussion'
  | 'a_relancer'
  | 'valide'
  | 'expediee'
  | 'livree'
  | 'refusee'
  | 'annulee'
  | 'perdue';

export const LEAD_STATUS_META: Record<LeadStatus, { label: string; emoji: string; cls: string }> = {
  nouveau_lead: { label: 'Nouveau lead', emoji: '🆕', cls: 'bg-blue-100 text-blue-700' },
  discussion: { label: 'En discussion', emoji: '💬', cls: 'bg-amber-100 text-amber-700' },
  a_relancer: { label: 'À relancer', emoji: '🔁', cls: 'bg-orange-100 text-orange-700' },
  valide: { label: 'Validée', emoji: '✅', cls: 'bg-emerald-100 text-emerald-700' },
  expediee: { label: 'Expédiée', emoji: '📦', cls: 'bg-cyan-100 text-cyan-700' },
  livree: { label: 'Livrée', emoji: '🎉', cls: 'bg-green-100 text-green-700' },
  refusee: { label: 'Refusée', emoji: '❌', cls: 'bg-red-100 text-red-700' },
  annulee: { label: 'Annulée', emoji: '🚫', cls: 'bg-gray-200 text-gray-700' },
  perdue: { label: 'Perdue', emoji: '💀', cls: 'bg-zinc-200 text-zinc-700' },
};

export const LEAD_STATUSES: LeadStatus[] = [
  'nouveau_lead', 'discussion', 'a_relancer', 'valide', 'expediee', 'livree', 'refusee', 'annulee', 'perdue',
];

export type Lead = {
  id: string;
  closeuse_idx: number;
  closeuse_slug: string;
  product_slug: string;
  product_name: string;
  offer_label: string | null;
  product_price: number;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  neighborhood: string | null;
  address_detail: string | null;
  status: LeadStatus;
  notes: string | null;
  client_ip: string | null;
  source: string | null;
  validated_at: string | null;
  order_id: string | null;
  created_at: string;
  updated_at: string;
};

const db = supabase as any;

export async function logLeadEvent(args: {
  lead_id: string;
  closeuse_idx?: number | null;
  event_type: string;
  from_status?: string | null;
  to_status?: string | null;
  payload?: Record<string, unknown>;
}) {
  await db.from('lead_events').insert({
    lead_id: args.lead_id,
    closeuse_idx: args.closeuse_idx ?? null,
    event_type: args.event_type,
    from_status: args.from_status ?? null,
    to_status: args.to_status ?? null,
    payload: args.payload ?? {},
  });
}

export function useLeads(closeuseIdx?: number | null) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let q = db.from('leads').select('*').order('created_at', { ascending: false }).limit(1000);
    if (typeof closeuseIdx === 'number') q = q.eq('closeuse_idx', closeuseIdx);
    const { data } = await q;
    setLeads((data || []) as Lead[]);
    setLoading(false);
  }, [closeuseIdx]);

  useEffect(() => {
    load();
    const filter = typeof closeuseIdx === 'number' ? `closeuse_idx=eq.${closeuseIdx}` : undefined;
    const ch = supabase
      .channel(`leads-${closeuseIdx ?? 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads', ...(filter ? { filter } : {}) }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [closeuseIdx, load]);

  return { leads, loading, reload: load };
}

export async function updateLeadStatus(lead: Lead, to: LeadStatus, opts?: { note?: string; refusal_reason?: string; refusal_comment?: string }) {
  const patch: Record<string, unknown> = { status: to };
  if (to === 'valide' && !lead.validated_at) patch.validated_at = new Date().toISOString();
  if (opts?.note) patch.notes = opts.note;
  if (opts?.refusal_reason) patch.refusal_reason = opts.refusal_reason;
  if (opts?.refusal_comment) patch.refusal_comment = opts.refusal_comment;
  const { error } = await db.from('leads').update(patch).eq('id', lead.id);
  if (error) throw error;
  await logLeadEvent({
    lead_id: lead.id,
    closeuse_idx: lead.closeuse_idx,
    event_type: 'status_change',
    from_status: lead.status,
    to_status: to,
    payload: { note: opts?.note, refusal_reason: opts?.refusal_reason, refusal_comment: opts?.refusal_comment },
  });

  // Touch closeuse activity
  try {
    await db.from('closeuses').update({ last_activity_at: new Date().toISOString() }).eq('idx', lead.closeuse_idx);
  } catch {}

  // Quand le lead est validé, on crée la commande dans `orders` (et le trigger DB la verrouille automatiquement)
  if (to === 'valide' && !lead.order_id) {
    const order_number = `LD${Date.now().toString().slice(-7)}`;
    const { data: created, error: oErr } = await db.from('orders').insert({
      order_number,
      product_name: lead.product_name,
      product_slug: lead.product_slug,
      product_price: lead.product_price,
      offer_label: lead.offer_label,
      first_name: lead.first_name,
      last_name: lead.last_name,
      whatsapp: lead.whatsapp,
      country: lead.country,
      city: lead.city,
      neighborhood: lead.neighborhood,
      address_detail: lead.address_detail,
      status: 'confirmed',
      closeuse_idx: lead.closeuse_idx,
      closeuse_slug: lead.closeuse_slug,
      lead_id: lead.id,
      assigned_at: new Date().toISOString(),
      client_ip: lead.client_ip,
      source: lead.source || 'closeuse-lead',
      locked: true,
    }).select('id').single();
    if (!oErr && created) {
      await db.from('leads').update({ order_id: created.id }).eq('id', lead.id);
    }
  }
}

export async function appendLeadNote(lead: Lead, note: string) {
  const merged = lead.notes ? `${lead.notes}\n[${new Date().toLocaleString('fr-FR')}] ${note}` : `[${new Date().toLocaleString('fr-FR')}] ${note}`;
  await db.from('leads').update({ notes: merged }).eq('id', lead.id);
  await logLeadEvent({
    lead_id: lead.id,
    closeuse_idx: lead.closeuse_idx,
    event_type: 'note_added',
    payload: { note },
  });
}
