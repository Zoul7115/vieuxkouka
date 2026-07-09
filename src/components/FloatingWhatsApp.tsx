import { ADMIN_WHATSAPP } from '@/lib/products';
import { useAssignedCloseuse } from '@/lib/assignedCloseuseContext';

export function FloatingWhatsApp() {
  const assigned = useAssignedCloseuse();
  const number = (assigned?.whatsapp && assigned.whatsapp.replace(/\D/g, '')) || ADMIN_WHATSAPP;
  const url = `https://wa.me/${number}?text=${encodeURIComponent('Bonjour, j\'ai une question sur les produits KOUKA')}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-5 z-[9999] bg-[#25D366] text-white px-5 py-3 rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.28)] font-extrabold text-sm flex items-center gap-2 hover:scale-105 transition-transform pulse-ring"
      aria-label="Contacter sur WhatsApp"
    >
      💬 WhatsApp
    </a>
  );
}
