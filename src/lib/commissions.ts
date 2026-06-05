import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

export type CommissionSettings = {
  commission_per_validated_order: number;
  commission_per_delivered_order: number;
};

export type CommissionPayout = {
  id: string;
  closeuse_idx: number;
  period_month: string; // YYYY-MM-DD
  validated_count: number;
  delivered_count: number;
  amount_due: number;
  amount_paid: number;
  paid_at: string | null;
  notes: string | null;
};

export function useCommissionSettings() {
  const [settings, setSettings] = useState<CommissionSettings>({
    commission_per_validated_order: 1000,
    commission_per_delivered_order: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await db.from('commission_settings').select('*').eq('id', 1).maybeSingle();
    if (data) setSettings({
      commission_per_validated_order: data.commission_per_validated_order,
      commission_per_delivered_order: data.commission_per_delivered_order,
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (s: CommissionSettings) => {
    await db.from('commission_settings').upsert({ id: 1, ...s, updated_at: new Date().toISOString() });
    setSettings(s);
  };

  return { settings, loading, save, reload: load };
}

export function usePayouts() {
  const [payouts, setPayouts] = useState<CommissionPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await db.from('commission_payouts').select('*').order('period_month', { ascending: false });
    setPayouts((data || []) as CommissionPayout[]);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  return { payouts, loading, reload: load };
}

export function monthStart(d: Date = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function monthKey(d: Date = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}
