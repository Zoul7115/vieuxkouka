import { useMemo, useState } from 'react';
import { useAuditLog } from '@/lib/auditLog';

export function AuditLogTab() {
  const { entries, loading } = useAuditLog(500);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return entries;
    const s = q.toLowerCase();
    return entries.filter((e) =>
      [e.actor_name, e.actor_type, e.entity_type, e.entity_id, e.action, JSON.stringify(e.payload)]
        .some((v) => v?.toString().toLowerCase().includes(s))
    );
  }, [entries, q]);

  if (loading) return <div className="text-center text-gray-500 py-6">Chargement…</div>;

  return (
    <div className="space-y-3">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer (acteur, action, entité…)"
        className="w-full px-3 py-2 border-2 border-vert-bg rounded-lg text-sm" />
      <div className="bg-white rounded-2xl border-2 border-vert-bg overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.map((e) => (
            <div key={e.id} className="border-b border-vert-bg/40 px-3 py-2 text-xs">
              <div className="flex justify-between gap-2">
                <div className="font-bold">
                  <span className="text-vert">{e.actor_type}</span> · {e.actor_name || e.actor_id || '—'} → <span className="text-rouge">{e.action}</span> ({e.entity_type})
                </div>
                <div className="text-[10px] text-gray-500 shrink-0">{new Date(e.created_at).toLocaleString('fr-FR')}</div>
              </div>
              {Object.keys(e.payload || {}).length > 0 && (
                <pre className="text-[10px] text-gray-600 mt-1 whitespace-pre-wrap">{JSON.stringify(e.payload)}</pre>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="p-6 text-center text-gray-500">Aucune entrée.</div>}
        </div>
      </div>
    </div>
  );
}
