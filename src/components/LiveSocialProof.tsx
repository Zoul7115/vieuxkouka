import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ProofItem = { name: string; product: string; mins: number };

// Fallback (si pas de commandes récentes en BDD) — pondéré BF
const NAMES_FALLBACK = [
  'Awa de Bobo', 'Ibrahim de Ouaga', 'Salif de Koudougou', 'Fatim de Banfora',
  'Moussa de Kaya', 'Aminata de Tenkodogo', 'Issouf de Fada', 'Rasmata de Pô',
  'Boukary de Dori', 'Karim de Ouahigouya',
];

// Anonymise un prénom : "Ibrahim" -> "Ibrahim", "I." si trop court
const firstNameOnly = (first: string | null, last: string | null) => {
  const f = (first || '').trim();
  if (f.length >= 2) return f;
  const l = (last || '').trim();
  return l.length >= 2 ? l : 'Un client';
};

const cityShort = (city: string | null, country: string | null) => {
  const c = (city || '').split('/')[0].trim();
  if (c.length >= 2) return c;
  return (country || '').trim() || 'Burkina';
};

const minsAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(1, Math.floor(diff / 60000));
};

export function LiveSocialProof({ product = 'Poudre KOUKA' }: { product?: string }) {
  const [items, setItems] = useState<ProofItem[]>([]);
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<ProofItem | null>(null);

  // Charge les vraies commandes des dernières 72h
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const since = new Date(Date.now() - 72 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from('orders')
        .select('first_name, last_name, city, country, product_name, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(40);

      if (!mounted) return;

      const real: ProofItem[] = (data || []).map((o) => ({
        name: `${firstNameOnly(o.first_name, o.last_name)} de ${cityShort(o.city, o.country)}`,
        product: /sirop/i.test(o.product_name || '') ? 'Sirop KOUKA' : 'Poudre KOUKA',
        mins: minsAgo(o.created_at as string),
      }));

      // Si peu de vraies commandes, complète avec fallback (pour ne pas avoir un vide)
      if (real.length < 5) {
        const filler = NAMES_FALLBACK.map((n) => ({
          name: n,
          product,
          mins: Math.floor(Math.random() * 14) + 2,
        }));
        setItems([...real, ...filler]);
      } else {
        setItems(real);
      }
    };
    load();

    // Realtime : nouvelle commande -> on l'ajoute en tête
    const channel = supabase
      .channel('proof-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const o = payload.new as any;
        const item: ProofItem = {
          name: `${firstNameOnly(o.first_name, o.last_name)} de ${cityShort(o.city, o.country)}`,
          product: /sirop/i.test(o.product_name || '') ? 'Sirop KOUKA' : 'Poudre KOUKA',
          mins: 1,
        };
        setItems((prev) => [item, ...prev].slice(0, 50));
        // Affiche immédiatement la nouvelle commande
        setCurrent(item);
        setShow(true);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [product]);

  // Cycle d'affichage
  useEffect(() => {
    if (items.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;
    let idx = 0;

    const cycle = () => {
      setCurrent(items[idx % items.length]);
      idx++;
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
        timer = setTimeout(cycle, 12000 + Math.random() * 8000);
      }, 6000);
    };

    const start = setTimeout(cycle, 8000);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [items]);

  if (!show || !current) return null;

  return (
    <div className="fixed bottom-20 left-3 z-40 max-w-[280px] bg-white border-2 border-vert-mid rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] p-3 flex items-start gap-2.5 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse mt-1.5 shrink-0" />
      <div className="text-xs leading-snug">
        <div className="font-extrabold text-foreground">{current.name}</div>
        <div className="text-muted-foreground">vient de commander <strong className="text-vert">{current.product}</strong></div>
        <div className="text-[10px] text-muted-foreground mt-0.5">il y a {current.mins} min</div>
      </div>
    </div>
  );
}
