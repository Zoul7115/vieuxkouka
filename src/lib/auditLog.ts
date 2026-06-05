import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

export type AuditEntry = {
  id: string;
  actor_type: 'admin' | 'closeuse' | 'system';
  actor_id: string | null;
  actor_name: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export async function logAudit(entry: Omit<AuditEntry, 'id' | 'created_at'>) {
  await db.from('audit_log').insert(entry);
}

export function useAuditLog(limit = 200) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await db.from('audit_log').select('*').order('created_at', { ascending: false }).limit(limit);
    setEntries((data || []) as AuditEntry[]);
    setLoading(false);
  }, [limit]);

  useEffect(() => { load(); }, [load]);
  return { entries, loading, reload: load };
}
