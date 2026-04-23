import type { Offer } from '@/lib/products';
import { formatFCFA } from '@/lib/products';

export function OfferSelector({
  offers,
  selectedId,
  onSelect,
}: {
  offers: Offer[];
  selectedId: number;
  onSelect: (offer: Offer) => void;
}) {
  return (
    <div className="grid gap-3.5 mb-6">
      {offers.map((o) => {
        const sel = selectedId === o.id;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => onSelect(o)}
            className={`relative text-left bg-white rounded-2xl p-4 pt-5 transition-all border-[3px] ${
              sel
                ? 'border-rouge bg-rouge-light shadow-[0_4px_16px_rgba(198,40,40,0.15)]'
                : 'border-vert-bg hover:border-vert-mid hover:bg-vert-bg/50'
            }`}
          >
            {o.badge && (
              <div className="absolute -top-3 right-3.5 bg-rouge text-white text-xs font-extrabold px-3 py-1 rounded-full">
                {o.badge}
              </div>
            )}
            {sel && (
              <div className="absolute -top-3 left-3.5 bg-rouge text-white text-xs font-extrabold px-3 py-1 rounded-full">
                ✓ SÉLECTIONNÉ
              </div>
            )}
            {o.recommended && (
              <div className="text-xs text-vert font-extrabold mb-2">⭐ Recommandé</div>
            )}
            {o.bestValue && (
              <div className="text-xs text-or font-extrabold mb-1.5">🔥 Meilleure valeur</div>
            )}
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className={`font-extrabold text-lg leading-tight transition-colors ${sel ? 'text-rouge' : 'text-foreground'}`}>
                  {o.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{o.description}</div>
                {o.saving && <div className="text-xs font-extrabold text-rouge mt-1.5">{o.saving}</div>}
              </div>
              <div className="text-right shrink-0">
                {o.oldPrice > o.price && (
                  <div className="text-sm text-muted-foreground line-through">{formatFCFA(o.oldPrice)}</div>
                )}
                <div className="text-2xl font-extrabold text-vert leading-none whitespace-nowrap">
                  {formatFCFA(o.price)}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
