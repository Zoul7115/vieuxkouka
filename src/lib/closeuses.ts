import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Closeuse = {
  id: string;
  idx: number;
  name: string;
  whatsapp: string;
  emoji: string | null;
  active: boolean;
  password_hash?: string | null;
  last_login_at?: string | null;
};

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

/** Commission par commande livrée saisie par une closeuse */
export const COMMISSION_PAR_COMMANDE = 1000;
