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
      className="fixed bottom-5 right-4 z-50 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-[0_4px_18px_rgba(37,211,102,0.45)] font-extrabold flex items-center gap-2 hover:scale-105 transition-transform pulse-ring"
    >
      💬 Une question ?
    </a>
  );
}
