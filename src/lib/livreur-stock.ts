import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type StockMap = Record<string, number>;

/** Calcule le stock courant par produit à partir des transactions */
export function useLivreurStock() {
  const [stock, setStock] = useState<StockMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data } = await supabase
        .from('stock_transactions')
        .select('produit, type, quantite');
      if (!alive) return;
      const map: StockMap = {};
      (data || []).forEach((t) => {
        const sign = t.type === 'entree' ? 1 : -1;
        map[t.produit] = (map[t.produit] || 0) + sign * (t.quantite || 0);
      });
      setStock(map);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel('livreur-stock')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions' }, load)
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, []);

  return { stock, loading };
}
