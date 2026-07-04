import { ADMIN_WHATSAPP } from '@/lib/products';

export function PreFormWhatsApp({ productName }: { productName: string }) {
  const text = encodeURIComponent(`Bonjour, j'hésite à commander ${productName}. J'aimerais poser une question avant.`);
  const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`;
  return (
    <div className="max-w-[480px] mx-auto mb-4 bg-white/95 border-2 border-[#25D366]/40 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
      <div className="text-2xl shrink-0">💬</div>
      <div className="flex-1 text-sm">
        <div className="font-extrabold text-foreground leading-tight">Une hésitation ?</div>
        <div className="text-muted-foreground text-xs">Pose ta question au Vieux KOUKA avant de commander.</div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="bg-[#25D366] text-white px-3 py-2 rounded-lg text-xs font-extrabold shrink-0 hover:scale-105 transition-transform"
      >
        WhatsApp
      </a>
    </div>
  );
}
