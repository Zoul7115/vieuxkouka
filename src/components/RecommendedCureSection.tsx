import { formatFCFA, isTwoPlusOneOffer, type Product } from '@/lib/products';

function scrollToOrder(offerId?: number) {
  try {
    if (offerId) sessionStorage.setItem('preselect_offer_id', String(offerId));
  } catch {}
  if (offerId) {
    window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  }
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function RecommendedCureSection({ product }: { product: Product }) {
  const reco = product.offers.find((o) => o.recommended) || product.offers.find((o) => o.bestValue) || product.offers[1] || product.offers[0];
  const discovery = product.offers.find((o) => o.id !== reco.id && o.units === 1) || product.offers[0];
  const economy = Math.max(0, reco.oldPrice - reco.price);
  const isPack = reco.units > 1;

  return (
    <section className="sec bg-vert-bg/40">
      <div className="container-kouka max-w-3xl">
        {/* Titre premium */}
        <div className="text-center mb-6">
          <span className="inline-block bg-or text-foreground text-xs font-extrabold uppercase px-3 py-1.5 rounded-full mb-3">
            ⭐ Conseil du Vieux KOUKA
          </span>
          <h2 className="text-vert mb-2">Pourquoi nous recommandons la cure complète ?</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            La majorité de nos clients qui guérissent <strong className="text-foreground">durablement</strong> choisissent le pack recommandé. Voici pourquoi.
          </p>
        </div>

        {/* Comparatif visuel */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* OFFRE DÉCOUVERTE - réduite visuellement */}
          <div className="bg-white/70 rounded-2xl p-4 border border-muted opacity-80">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Offre découverte</div>
            <div className="text-lg font-bold text-foreground/70 mb-1">{discovery.units} {discovery.units > 1 ? 'unités' : 'unité'}</div>
            <div className="text-xl font-extrabold text-muted-foreground mb-3">{formatFCFA(discovery.price)}</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Pour <strong>tester</strong> le produit</li>
              <li>• Résultats <strong>limités</strong></li>
              <li>⚠️ Non recommandée pour une cure complète</li>
              <li>⚠️ Risque de rupture avant guérison</li>
            </ul>
          </div>

          {/* OFFRE RECOMMANDÉE */}
          <div className="relative bg-white rounded-2xl p-5 border-[3px] border-rouge shadow-[0_8px_28px_rgba(198,40,40,0.20)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rouge text-white text-xs font-extrabold px-4 py-1 rounded-full whitespace-nowrap shadow">
              ⭐ OFFRE LA PLUS CHOISIE
            </div>
            <div className="text-xs font-extrabold text-rouge uppercase tracking-wide mb-2 mt-1">Offre recommandée {isPack ? `${reco.paidUnits}+${reco.bonusUnits} OFFERT${reco.bonusUnits > 1 ? 'S' : ''}` : ''}</div>
            <div className="text-lg font-extrabold text-foreground mb-1">{reco.units} {reco.units > 1 ? 'unités' : 'unité'} · Cure complète</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-extrabold text-rouge">{formatFCFA(reco.price)}</span>
              {reco.oldPrice > reco.price && (
                <span className="text-sm text-muted-foreground line-through">{formatFCFA(reco.oldPrice)}</span>
              )}
            </div>
            <ul className="space-y-1.5 text-sm text-foreground">
              <li>✅ <strong>Cure complète</strong> jusqu'à guérison</li>
              <li>✅ <strong>Plus économique</strong> {economy > 0 && <span className="text-rouge font-extrabold">(tu économises {formatFCFA(economy)})</span>}</li>
              <li>✅ Évite les <strong>ruptures</strong> de traitement</li>
              <li>✅ Choisi par la <strong>majorité</strong> des clients</li>
            </ul>
            <div className="mt-3 bg-vert-bg text-vert text-center text-xs font-extrabold py-2 rounded-lg">
              👥 8 clients sur 10 choisissent cette offre
            </div>
            <button
              onClick={() => scrollToOrder(reco.id)}
              className="mt-3 w-full bg-rouge text-white py-3 rounded-xl font-extrabold shadow-[0_4px_14px_rgba(198,40,40,0.40)] active:scale-95 transition"
            >
              ✅ Je choisis la cure complète
            </button>
          </div>
        </div>

        {/* L'erreur que font la plupart des clients */}
        <div className="bg-foreground text-white rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl shrink-0">⚠️</div>
            <div>
              <h3 className="text-white text-lg font-extrabold mb-2">L'erreur que font la plupart des clients</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-3">
                Beaucoup commandent <strong>une petite quantité pour tester</strong>… puis ressentent les premiers effets positifs au bout de quelques jours.
                Mais le produit se termine <strong>avant la fin du traitement</strong>. Ils doivent recommander en urgence — parfois en pleine rupture de stock — et le mal revient.
              </p>
              <p className="text-or font-extrabold text-sm">
                👉 La cure complète évite cette erreur : tu as tout ce qu'il faut, du début à la guérison.
              </p>
            </div>
          </div>
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <button
            onClick={() => scrollToOrder(reco.id)}
            className="w-full md:w-auto md:px-10 bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            🔥 JE COMMANDE LA CURE COMPLÈTE — {formatFCFA(reco.price)}
          </button>
          <p className="text-xs text-muted-foreground mt-2">💵 Paiement uniquement à la réception · 🚚 Livraison rapide</p>
        </div>
      </div>
    </section>
  );
}
