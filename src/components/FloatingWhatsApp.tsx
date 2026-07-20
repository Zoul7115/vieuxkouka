import { useEffect, useState } from 'react';
import { ADMIN_WHATSAPP } from '@/lib/products';
import { useAssignedCloseuse } from '@/lib/assignedCloseuseContext';
import { useInputFocused } from '@/hooks/useInputFocused';

export function FloatingWhatsApp() {
  const assigned = useAssignedCloseuse();
  const number = (assigned?.whatsapp && assigned.whatsapp.replace(/\D/g, '')) || ADMIN_WHATSAPP;
  const url = `https://wa.me/${number}?text=${encodeURIComponent("Bonjour, j'ai une question sur les produits KOUKA")}`;
  const inputFocused = useInputFocused();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const hidden = inputFocused;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter sur WhatsApp"
      className={[
        'fixed z-[9999] bg-[#25D366] text-white font-extrabold shadow-[0_3px_12px_rgba(0,0,0,0.28)] transition-all duration-300',
        // Mobile : icône ronde à droite, plus discrète
        'bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-xl',
        // Desktop : pilule classique conservée
        'md:bottom-6 md:right-5 md:w-auto md:h-auto md:rounded-full md:px-5 md:py-3 md:text-sm md:gap-2 md:flex md:items-center pulse-ring',
        mounted && !hidden ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
    >
      <span className="md:hidden">💬</span>
      <span className="hidden md:inline">💬 WhatsApp</span>
    </a>
  );
}
