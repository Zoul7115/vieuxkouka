import { useState } from 'react';
import { QuickOrderModal } from '../QuickOrderModal';
import { formatFCFA, type Product, type Offer } from '@/lib/products';

export type StoryHeroProps = {
  product: Product;
  /** Galerie : images additionnelles à montrer en miniatures. La 1re est l'image principale. */
  gallery?: string[];
  /** Note moyenne et nombre d'avis */
  rating?: { stars: number; count: number };
  /** Sous-titre court */
  subtitle?: string;
  /** Bullets bénéfices clés */
  bullets?: string[];
  ctaLabel?: string;
  /** Couleur du CTA principal */
  ctaTone?: 'vert' | 'rouge';
};

export function StoryHero({
  product,
  gallery,
  rating = { stars: 4.9, count: 217 },
  subtitle,
  bullets,
  ctaLabel = '⚡ Commander en 30 secondes',
  ctaTone = 'vert',
}: StoryHeroProps) {
  const images = (gallery && gallery.length > 0 ? gallery : [product.heroImage]).filter(Boolean);
  const [active, setActive] = useState(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const reco = product.offers.find((o) => o.recommended) || product.offers[0];
  const recoOld = reco.oldPrice > reco.price ? reco.oldPrice : null;

  const ctaClass =
    ctaTone === 'rouge'
      ? 'bg-rouge hover:brightness-110 text-white shadow-[0_8px_24px_rgba(198,40,40,0.35)]'
      : 'bg-vert-mid hover:bg-vert text-white shadow-[0_8px_24px_rgba(46,125,50,0.35)]';

  return (
    <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
      <div className="container-story py-4 md:py-12 grid md:grid-cols-2 gap-5 md:gap-14">
        {/* GALERIE — compacte sur mobile (max 60vw de hauteur) */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-[oklch(0.92_0.02_130)] bg-cream-2 aspect-[4/3] md:aspect-square max-h-[55vh] md:max-h-none flex items-center justify-center">
            <img
              src={images[active]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-2 md:mt-3">
              {images.slice(0, 5).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all bg-cream-2 ${
                    active === i ? 'border-vert-mid' : 'border-transparent hover:border-vert-bg'
                  }`}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFOS */}
        <div className="flex flex-col">
          <div className="story-eyebrow mb-1.5">{product.pathology.split('·')[0].trim()}</div>
          <h1 className="text-foreground mb-2 leading-tight" style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.6rem)' }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <span className="story-stars text-base">★★★★★</span>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{rating.stars}/5</strong> · {rating.count} avis
            </span>
          </div>

          {subtitle && <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">{subtitle}</p>}

          {/* PRIX */}
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl md:text-4xl font-extrabold text-vert">{formatFCFA(reco.price)}</span>
            {recoOld && (
              <>
                <span className="text-base text-muted-foreground line-through pb-1">{formatFCFA(recoOld)}</span>
                <span className="bg-rouge text-white text-xs font-extrabold px-2 py-1 rounded">
                  -{Math.round(((recoOld - reco.price) / recoOld) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            💵 Paiement à la livraison · 🚚 Livraison gratuite Ouaga
          </p>

          {/* BULLETS — compactés sur mobile */}
          {bullets && (
            <ul className="grid gap-1.5 md:gap-2 mb-5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="text-vert font-bold mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* SÉLECTEUR D'OFFRES — visible aussi sur MOBILE maintenant */}
          <div className="mb-4">
            <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
              Choisis ton pack
            </div>
            <MiniOfferList offers={product.offers} onPick={() => setQuickOpen(true)} />
          </div>

          <button
            onClick={() => setQuickOpen(true)}
            className={`w-full md:w-auto md:self-start px-6 py-4 rounded-xl text-base md:text-lg font-extrabold transition-all hover:-translate-y-0.5 ${ctaClass}`}
          >
            {ctaLabel}
          </button>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
            <span>🛡️ Remboursé si pas satisfait</span>
            <span>📦 Colis discret</span>
            <span>📞 Appel sous 2h</span>
          </div>
        </div>
      </div>

      <QuickOrderModal open={quickOpen} onClose={() => setQuickOpen(false)} product={product} />
    </section>
  );
}

function MiniOfferList({ offers, onPick }: { offers: Offer[]; onPick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {offers.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={onPick}
          className={`rounded-lg border-2 px-2 py-2 text-center transition-all hover:-translate-y-0.5 ${
            o.recommended ? 'border-rouge bg-rouge-light' : o.bestValue ? 'border-or bg-[oklch(0.97_0.06_92)]' : 'border-vert-bg bg-white hover:border-vert-mid'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">
            {o.units} {o.units > 1 ? 'unités' : 'unité'}
          </div>
          <div className="text-sm font-extrabold text-vert leading-none mt-1">{formatFCFA(o.price)}</div>
          {o.recommended && <div className="text-[9px] text-rouge font-extrabold mt-1">⭐ POPULAIRE</div>}
          {o.bestValue && <div className="text-[9px] text-or font-extrabold mt-1">🔥 MEILLEURE</div>}
        </button>
      ))}
    </div>
  );
}
