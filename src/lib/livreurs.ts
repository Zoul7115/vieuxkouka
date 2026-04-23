import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Livreur = {
  id: string;
  idx: number;
  name: string;
  whatsapp: string;
  zone: string | null;
  emoji: string | null;
  active: boolean;
};

/** Hook: charge les livreurs depuis la BD avec rafraîchissement */
export function useLivreurs() {
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('livreurs')
      .select('*')
      .order('idx', { ascending: true });
    if (!error && data) setLivreurs(data as Livreur[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { livreurs, loading, reload: load };
}

export const getLivreur = (livreurs: Livreur[], idx: number | null | undefined) =>
  idx == null ? null : livreurs.find((l) => l.idx === idx) || null;

/** Format E.164 sans le + pour wa.me */
export const cleanPhone = (raw: string | null | undefined) =>
  (raw || '').replace(/\D/g, '');
