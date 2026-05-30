import { useEffect, useState } from 'react';

export type CtaVariant = 'A' | 'B';

export interface CtaCopy {
  variant: CtaVariant;
  primary: string;       // bouton principal long
  short: string;         // version courte / sticky / intermédiaires
  sizeClass: string;     // classes de taille tailwind appliquées sur le bouton
}

const VARIANTS: Record<CtaVariant, Omit<CtaCopy, 'variant'>> = {
  A: {
    primary: '✅ JE COMMANDE — Je paie à la livraison',
    short: '✅ Je commande',
    sizeClass: 'py-[18px] text-[17px] sm:text-lg min-h-[56px]',
  },
  B: {
    primary: '👉 OUI, JE VEUX MA BOUTEILLE',
    short: '👉 Je veux ma bouteille',
    sizeClass: 'py-[22px] text-[19px] sm:text-xl min-h-[64px]',
  },
};

const KEY = 'cta_variant_tonic';

function pick(): CtaVariant {
  try {
    const saved = sessionStorage.getItem(KEY) as CtaVariant | null;
    if (saved === 'A' || saved === 'B') return saved;
  } catch {}
  const v: CtaVariant = Math.random() < 0.5 ? 'A' : 'B';
  try {
    sessionStorage.setItem(KEY, v);
    // Simple tracking côté client (console + dataLayer si dispo)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: 'cta_ab_assign', variant: v });
  } catch {}
  return v;
}

export function useCtaVariant(): CtaCopy {
  // Default A for SSR; rehydrate to chosen variant on mount
  const [variant, setVariant] = useState<CtaVariant>('A');
  useEffect(() => { setVariant(pick()); }, []);
  return { variant, ...VARIANTS[variant] };
}

export function trackCtaClick(location: string) {
  try {
    const v = sessionStorage.getItem(KEY) || 'A';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: 'cta_click', variant: v, location });
  } catch {}
}
