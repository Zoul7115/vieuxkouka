import { useEffect, useState } from 'react';

export function MobileOrderBar() {
  const [visible, setVisible] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // La barre apparaît une fois le hero dépassé (hero = ~100vh)
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const formEl = document.getElementById('order-section');
    if (!formEl) return () => window.removeEventListener('scroll', onScroll);

    const io = new IntersectionObserver(
      ([entry]) => setAtForm(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    );
    io.observe(formEl);

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const show = visible && !atForm;

  return (
    <div
      className={[
        'md:hidden fixed inset-x-0 bottom-0 z-[55] bg-white/95 backdrop-blur border-t border-bleu/10',
        'shadow-[0_-8px_24px_rgba(0,0,0,0.10)] transition-transform duration-300 ease-out',
        show ? 'translate-y-0' : 'translate-y-full pointer-events-none',
      ].join(' ')}
      aria-hidden={!show}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="container-kouka flex items-center justify-between gap-3 py-3 px-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">Cure complète</p>
          <p className="text-base font-extrabold text-rouge leading-none">25 000 FCFA</p>
        </div>
        <button
          type="button"
          onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="shrink-0 rounded-xl bg-rouge px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
        >
          Je commande
        </button>
      </div>
    </div>
  );
}
