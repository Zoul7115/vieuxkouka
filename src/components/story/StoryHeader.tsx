import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

type NavLink = { label: string; href: string; type?: 'route' | 'anchor' };

export function StoryHeader({
  brand = '🌿 KOUKA Thérapies',
  links = [
    { label: 'Boutique', href: '#order-section', type: 'anchor' },
    { label: 'Témoignages', href: '#story-reviews', type: 'anchor' },
    { label: 'FAQ', href: '#story-faq', type: 'anchor' },
    { label: 'Suivi commande', href: 'https://wa.me/22658444818', type: 'anchor' },
  ],
  ctaLabel = 'Commander',
}: {
  brand?: string;
  links?: NavLink[];
  ctaLabel?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white'
      } border-b border-[oklch(0.92_0.02_130)]`}
    >
      <div className="container-story flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="font-extrabold text-vert text-base md:text-lg tracking-tight">
          {brand}
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-semibold text-foreground/80 hover:text-vert transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#order-section"
            className="hidden sm:inline-flex bg-vert-mid hover:bg-vert text-white text-sm font-extrabold px-4 py-2 rounded-full transition-colors"
          >
            {ctaLabel}
          </a>
          <button
            aria-label="Menu"
            className="md:hidden p-2"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[oklch(0.92_0.02_130)] bg-white">
          <div className="container-story py-3 flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-semibold text-foreground/80"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
