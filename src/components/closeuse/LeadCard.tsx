import { useState } from 'react';
import { toast } from 'sonner';
import { type Lead, LEAD_STATUS_META, type LeadStatus, updateLeadStatus } from '@/lib/leads';
import { formatFCFA } from '@/lib/products';
import { buildClientMessage, buildLivreurMessage, waUrl, type WAOrder } from '@/lib/whatsappMessages';

const LIVREUR_GROUP_URL = 'https://chat.whatsapp.com/IeoZRclWk6H0rsHaOiO1dc';

// Statuts simples demandés
const SIMPLE_STATUSES: { to: LeadStatus; label: string; emoji: string; cls: string }[] = [
  { to: 'nouveau_lead', label: 'En attente', emoji: '🕒', cls: 'bg-blue-600 hover:bg-blue-700' },
  { to: 'discussion',   label: 'Approche',   emoji: '💬', cls: 'bg-amber-600 hover:bg-amber-700' },
  { to: 'a_relancer',   label: 'Suivi',      emoji: '🔁', cls: 'bg-orange-600 hover:bg-orange-700' },
  { to: 'valide',       label: 'Confirmée',  emoji: '✅', cls: 'bg-emerald-600 hover:bg-emerald-700' },
  { to: 'livree',       label: 'Livrée',     emoji: '🎉', cls: 'bg-green-700 hover:bg-green-800' },
  { to: 'annulee',      label: 'Annulée',    emoji: '🚫', cls: 'bg-red-600 hover:bg-red-700' },
];

// Mapping statut interne → libellé simple affiché en pastille
const SIMPLE_LABEL: Partial<Record<LeadStatus, { label: string; emoji: string; cls: string }>> = {
  nouveau_lead: { label: 'En attente', emoji: '🕒', cls: 'bg-blue-100 text-blue-700' },
  discussion:   { label: 'Approche',   emoji: '💬', cls: 'bg-amber-100 text-amber-700' },
  a_relancer:   { label: 'Suivi',      emoji: '🔁', cls: 'bg-orange-100 text-orange-700' },
  valide:       { label: 'Confirmée',  emoji: '✅', cls: 'bg-emerald-100 text-emerald-700' },
  expediee:     { label: 'Confirmée',  emoji: '✅', cls: 'bg-emerald-100 text-emerald-700' },
  livree:       { label: 'Livrée',     emoji: '🎉', cls: 'bg-green-100 text-green-700' },
  annulee:      { label: 'Annulée',    emoji: '🚫', cls: 'bg-gray-200 text-gray-700' },
  refusee:      { label: 'Annulée',    emoji: '🚫', cls: 'bg-gray-200 text-gray-700' },
  perdue:       { label: 'Annulée',    emoji: '🚫', cls: 'bg-gray-200 text-gray-700' },
};

export function LeadCard({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const badge = SIMPLE_LABEL[lead.status] || { label: LEAD_STATUS_META[lead.status]?.label || lead.status, emoji: '•', cls: 'bg-gray-100 text-gray-700' };

  const setStatus = async (to: LeadStatus) => {
    if (to === lead.status || busy) return;
    setBusy(true);
    try {
      await updateLeadStatus(lead, to);
      toast.success(`Statut → ${SIMPLE_LABEL[to]?.label || to}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur');
    } finally { setBusy(false); }
  };

  const wa: WAOrder = {
    order_number: lead.id.slice(0, 7).toUpperCase(),
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
    car_transport: null,
    delivery_slot: null,
  };

  const clientUrl = lead.whatsapp ? waUrl(lead.whatsapp, buildClientMessage(wa)) : null;

  const openLivreurGroup = async () => {
    try {
      await navigator.clipboard?.writeText(buildLivreurMessage(wa));
      toast.success('Message livreur copié 📋 — colle-le dans le groupe');
    } catch {
      toast.message('Ouverture du groupe livreur…');
    }
    window.open(LIVREUR_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex justify-between items-center gap-2 hover:bg-rose-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-rose-900 truncate">
            {lead.first_name || 'Client'} {lead.last_name || ''}
          </div>
          <div className="text-xs text-gray-600 truncate">{lead.product_name}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {lead.city || '—'} · {new Date(lead.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.emoji} {badge.label}</span>
          <span className="text-xs font-extrabold text-rose-700">{formatFCFA(lead.product_price)}</span>
          <span className="text-[10px] text-rose-400">{open ? '▲ Fermer' : '▼ Ouvrir'}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-rose-100 p-3 space-y-3 bg-rose-50/40">
          {/* Infos client */}
          <div className="text-xs bg-white border border-rose-100 rounded-lg p-2 space-y-0.5">
            <div>📞 <b>{lead.whatsapp || '—'}</b></div>
            <div>📍 {[lead.city, lead.neighborhood, lead.address_detail].filter(Boolean).join(' · ') || '—'}</div>
            {lead.offer_label && <div>🎁 {lead.offer_label}</div>}
          </div>

          {/* WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            {clientUrl ? (
              <a href={clientUrl} target="_blank" rel="noreferrer"
                 className="bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold px-3 py-2.5 rounded-xl text-center">
                💬 Confirmation client
              </a>
            ) : (
              <span className="bg-gray-200 text-gray-500 text-xs font-extrabold px-3 py-2.5 rounded-xl text-center">
                💬 Pas de WhatsApp
              </span>
            )}
            <button onClick={openLivreurGroup}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-extrabold px-3 py-2.5 rounded-xl text-center">
              🛵 Notif livreur
            </button>
          </div>

          {/* Statuts */}
          <div>
            <div className="text-[11px] font-extrabold text-rose-900 uppercase mb-1.5">Statut de la commande</div>
            <div className="grid grid-cols-3 gap-1.5">
              {SIMPLE_STATUSES.map((s) => {
                const active = s.to === lead.status || (s.to === 'valide' && lead.status === 'expediee');
                return (
                  <button
                    key={s.to}
                    disabled={busy || active}
                    onClick={() => setStatus(s.to)}
                    className={`text-xs text-white font-bold px-2 py-2 rounded-lg disabled:opacity-100 ${s.cls} ${active ? 'ring-2 ring-offset-1 ring-rose-400' : ''}`}
                  >
                    {s.emoji} {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
