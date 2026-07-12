import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Closeuse = {
  id: string;
  idx: number;
  name: string;
  whatsapp: string;
  emoji: string | null;
  active: boolean;
  slug?: string | null;
  password_hash?: string | null;
  last_login_at?: string | null;
  admin_orders_access?: boolean | null;
};

export function slugify(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function useCloseuses() {
  const [closeuses, setCloseuses] = useState<Closeuse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('closeuses').select('*').order('idx', { ascending: true });
    setCloseuses((data || []) as Closeuse[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { closeuses, loading, reload: load };
}

/** Commission par commande livrée — valeur historique (utilisée si pas encore configurée en BDD) */
export const COMMISSION_PAR_COMMANDE = 1000;
