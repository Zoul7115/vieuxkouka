import { useEffect, useState } from 'react';

/**
 * Bouton flottant mobile "Commander maintenant" qui scrolle vers le formulaire.
 * Placé en bas-gauche pour ne pas chevaucher FloatingWhatsApp (bas-droite).
 * Apparaît après un petit scroll et se masque quand le formulaire est visible.
 */
export function FloatingOrderCTA({ label = '🛒 Commander maintenant' }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const target = document.getElementById('order-section');
      const scrolled = window.scrollY > 400;
      if (!target) {
        setVisible(scrolled);
        return;
      }
      const rect = target.getBoundingClientRect();
      const formInView = rect.top < window.innerHeight - 100 && rect.bottom > 0;
      setVisible(scrolled && !formInView);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
      className={`md:hidden fixed bottom-5 left-4 z-50 bg-rouge text-white px-4 py-3 rounded-full shadow-[0_4px_18px_rgba(198,40,40,0.45)] font-extrabold text-sm transition-all ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      {label}
    </button>
  );
}
