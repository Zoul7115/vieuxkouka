import { formatFCFA, isTwoPlusOneOffer, type Product } from '@/lib/products';

function scrollToOrder(offerId?: number) {
  try {
    if (offerId) sessionStorage.setItem('preselect_offer_id', String(offerId));
  } catch {}
  if (offerId) window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function OfferComparisonTable({ product }: { product: Product }) {
  const discovery = product.offers.find((o) => o.units === 1 && !o.recommended && !o.bestValue) || product.offers[0];
  const reco = product.offers.find((o) => o.recommended) || product.offers[1] || product.offers[0];
  const premium = product.offers.find((o) => o.bestValue) || product.offers[product.offers.length - 1];

  const cell = (txt: string, ok = true) => (
    <li className="flex items-start gap-1.5">
      <span className={ok ? 'text-vert' : 'text-muted-foreground'}>{ok ? '✔' : '·'}</span>
      <span>{txt}</span>
    </li>
  );

  return (
    <section className="sec bg-white">
      <div className="container-kouka max-w-5xl">
        <div className="text-center mb-6">
          <h2 className="text-foreground mb-2">Comparez les 3 offres</h2>
          <p className="text-muted-foreground text-sm">Choisissez la formule qui vous correspond le mieux.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Découverte */}
          <div className="rounded-2xl border-2 border-muted bg-white p-4 opacity-90">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Offre découverte</div>
            <div className="text-lg font-extrabold text-foreground/80 mb-1">{discovery.units} {discovery.units > 1 ? 'unités' : 'unité'}</div>
            <div className="text-xl font-extrabold text-muted-foreground mb-3">{formatFCFA(discovery.price)}</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
              {cell('Pour tester')}
              {cell('Quantité limitée')}
            </ul>
            <button
              onClick={() => scrollToOrder(discovery.id)}
              className="w-full bg-white border-2 border-muted text-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-vert-bg/60 transition"
            >
              Choisir
            </button>
          </div>

          {/* Recommandée */}
          <div className="relative rounded-2xl border-[3px] border-rouge bg-white p-5 shadow-[0_8px_28px_rgba(198,40,40,0.18)] md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rouge text-white text-xs font-extrabold px-4 py-1 rounded-full whitespace-nowrap shadow">
              ⭐ OFFRE LA PLUS CHOISIE
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-rouge mb-1 mt-1">Offre recommandée</div>
            {isTwoPlusOneOffer(reco) && (
              <div className="mb-1.5 inline-flex items-center gap-1 bg-vert-bg text-vert text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                🎁 + 1 Traitement complet de 40 jours OFFERT
              </div>
            )}
            <div className="text-lg font-extrabold text-foreground mb-1">{reco.units} {reco.units > 1 ? 'unités' : 'unité'} · Cure complète</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-extrabold text-rouge">{formatFCFA(reco.price)}</span>
              {reco.oldPrice > reco.price && (
                <span className="text-xs text-muted-foreground line-through">{formatFCFA(reco.oldPrice)}</span>
              )}
            </div>
            <ul className="space-y-1.5 text-sm text-foreground mb-4">
              {cell('Cure complète')}
              {cell('Plus économique')}
              {cell('Évite les ruptures')}
              {cell('Plus choisie')}
            </ul>
            <button
              onClick={() => scrollToOrder(reco.id)}
              className="w-full bg-rouge text-white py-3 rounded-xl font-extrabold shadow-[0_4px_14px_rgba(198,40,40,0.40)] active:scale-95 transition"
            >
              ✅ Je choisis cette offre
            </button>
            <div className="text-center text-[11px] font-extrabold text-vert mt-2">
              👥 8 clients sur 10 choisissent cette offre
            </div>
          </div>

          {/* Premium */}
          <div className="relative rounded-2xl border-[3px] border-or bg-white p-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-or text-foreground text-xs font-extrabold px-4 py-1 rounded-full whitespace-nowrap shadow">
              👑 ÉCONOMIE MAXIMALE
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-or mb-1 mt-1">Offre premium</div>
            <div className="text-lg font-extrabold text-foreground mb-1">{premium.units} unités</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-extrabold text-foreground">{formatFCFA(premium.price)}</span>
              {premium.oldPrice > premium.price && (
                <span className="text-xs text-muted-foreground line-through">{formatFCFA(premium.oldPrice)}</span>
              )}
            </div>
            <ul className="space-y-1.5 text-sm text-foreground mb-4">
              {cell('Économie maximale')}
              {cell('Stock longue durée')}
              {cell('Accompagnement optimal')}
            </ul>
            <button
              onClick={() => scrollToOrder(premium.id)}
              className="w-full bg-or text-foreground py-2.5 rounded-xl font-extrabold hover:opacity-90 transition"
            >
              Choisir le pack premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
