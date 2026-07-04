import { formatFCFA, isTwoPlusOneOffer, type Offer } from '@/lib/products';

export function OfferSelector({
  offers,
  selectedId,
  onSelect,
}: {
  offers: Offer[];
  selectedId: number;
  onSelect: (offer: Offer) => void;
}) {
  // Tri: recommandée d'abord, puis bestValue (premium), puis le reste
  const sorted = [...offers].sort((a, b) => {
    const rank = (o: Offer) => (o.recommended ? 0 : o.bestValue ? 1 : 2);
    return rank(a) - rank(b);
  });

  return (
    <div className="grid gap-3.5 mb-6">
      {sorted.map((o) => {
        const sel = selectedId === o.id;
        const isReco = !!o.recommended;
        const isPremium = !isReco && !!o.bestValue;
        const isHero = isReco || isPremium;
        const isDiscovery = !isHero && o.units === 1;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => onSelect(o)}
            className={`relative text-left bg-white rounded-2xl transition-all border-[3px] ${
              isHero ? 'p-5 pt-7' : 'p-3.5 pt-5'
            } ${
              sel
                ? 'border-rouge bg-rouge-light shadow-[0_6px_22px_rgba(198,40,40,0.20)]'
                : isReco
                ? 'border-rouge/60 shadow-[0_4px_16px_rgba(198,40,40,0.10)] hover:border-rouge'
                : isPremium
                ? 'border-or shadow-[0_4px_16px_rgba(212,175,55,0.18)] hover:border-or'
                : isDiscovery
                ? 'border-muted opacity-75 hover:opacity-100 hover:border-vert-mid'
                : 'border-vert-bg hover:border-vert-mid hover:bg-vert-bg/50'
            }`}
          >
            {isReco && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rouge text-white text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shadow">
                ⭐ OFFRE LA PLUS CHOISIE
              </div>
            )}
            {isPremium && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-or text-foreground text-[11px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shadow">
                👑 ÉCONOMIE MAXIMALE
              </div>
            )}
            {o.badge && !isHero && (
              <div className="absolute -top-3 right-3.5 bg-rouge text-white text-xs font-extrabold px-3 py-1 rounded-full">
                {o.badge}
              </div>
            )}
            {sel && (
              <div className="absolute -top-3 right-3.5 bg-vert text-white text-[11px] font-extrabold px-3 py-1 rounded-full">
                ✓ SÉLECTIONNÉ
              </div>
            )}
            {isDiscovery && (
              <div className="text-[10px] uppercase tracking-wide font-bold text-muted-foreground mb-1">
                Option secondaire · pour tester
              </div>
            )}
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div
                  className={`font-extrabold leading-tight transition-colors ${
                    isHero ? 'text-lg' : isDiscovery ? 'text-sm text-foreground/80' : 'text-base'
                  } ${sel ? 'text-rouge' : isHero ? 'text-foreground' : ''}`}
                >
                  {o.label}
                </div>
                <div className={`mt-1 ${isDiscovery ? 'text-xs text-muted-foreground' : 'text-sm text-muted-foreground'}`}>
                  {o.description}
                </div>
                {isTwoPlusOneOffer(o) && (
                  <div className="mt-1.5 inline-flex items-center gap-1 bg-vert-bg text-vert text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                    🎁 + 1 Traitement complet de 40 jours OFFERT
                  </div>
                )}
                {o.saving && isHero && (
                  <div className={`text-xs font-extrabold mt-1.5 ${isPremium ? 'text-or' : 'text-rouge'}`}>{o.saving}</div>
                )}
              </div>
              <div className="text-right shrink-0">
                {o.oldPrice > o.price && (
                  <div className="text-xs text-muted-foreground line-through">{formatFCFA(o.oldPrice)}</div>
                )}
                <div
                  className={`font-extrabold leading-none whitespace-nowrap ${
                    isHero ? 'text-2xl text-vert' : isDiscovery ? 'text-lg text-muted-foreground' : 'text-xl text-vert'
                  }`}
                >
                  {formatFCFA(o.price)}
                </div>
              </div>
            </div>
            {isReco && (
              <div className="mt-3 bg-vert-bg text-vert text-center text-[11px] font-extrabold py-1.5 rounded-lg">
                👥 8 clients sur 10 choisissent cette offre
              </div>
            )}
            {isPremium && (
              <div className="mt-3 bg-or/20 text-foreground text-center text-[11px] font-extrabold py-1.5 rounded-lg">
                💰 Stock longue durée · Économie maximale
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
