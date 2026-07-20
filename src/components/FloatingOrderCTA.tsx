import { useEffect, useState } from 'react';
import { useInputFocused } from '@/hooks/useInputFocused';

/**
 * Bouton flottant mobile "Commander" (action principale).
 * Placé en bas-gauche. Masqué quand le formulaire est visible ou quand
 * l'utilisateur saisit dans un champ (clavier ouvert).
 */
export function FloatingOrderCTA({ label = '🛒 Commander' }: { label?: string }) {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputFocused = useInputFocused();

  useEffect(() => {
    const onScroll = () => {
      setScrolledEnough(window.scrollY > 400);
      const target = document.getElementById('order-section');
      if (!target) { setFormInView(false); return; }
      const rect = target.getBoundingClientRect();
      setFormInView(rect.top < window.innerHeight - 100 && rect.bottom > 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(() => setMounted(true), 60);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  const visible = mounted && scrolledEnough && !formInView && !inputFocused;

  return (
    <button
      onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
      className={[
        'md:hidden fixed bottom-3 left-3 z-[9999] bg-rouge text-white px-4 h-12 rounded-full',
        'shadow-[0_4px_18px_rgba(198,40,40,0.45)] font-extrabold text-sm transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
      aria-hidden={!visible}
    >
      {label}
    </button>
  );
}
