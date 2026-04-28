import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** 
 * Stock affiché basé sur les commandes réelles du jour.
 * Plus il y a eu de commandes aujourd'hui, plus le stock affiché baisse.
 * Plage: 4 à 18 unités, jamais 0 (pour éviter de bloquer les conversions).
 */
export function useDynamicStock(productSlug?: string, base = 18) {
  const [stock, setStock] = useState(base);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let q = supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      if (productSlug) q = q.eq('product_slug', productSlug);
      const { count } = await q;
      if (!mounted) return;
      const ordersToday = count || 0;
      const remaining = Math.max(4, base - ordersToday);
      setStock(remaining);
    };

    load();
    const channel = supabase
      .channel(`stock-display-${productSlug || 'all'}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, load)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [productSlug, base]);

  return stock;
}
