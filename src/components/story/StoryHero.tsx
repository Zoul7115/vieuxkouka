import { useState } from 'react';
import { OfferSelector } from '../OfferSelector';
import { formatFCFA, type Product, type Offer } from '@/lib/products';

export type StoryHeroProps = {
  product: Product;
  /** Galerie : images additionnelles à montrer en miniatures. La 1re est l'image principale. */
  gallery?: string[];
  /** Note moyenne et nombre d'avis */
  rating?: { stars: number; count: number };
  /** Sous-titre court (ex: "Traitement naturel · 100% plantes africaines") */
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
  ctaLabel = '🌿 Commander — Paiement à la livraison',
  ctaTone = 'vert',
}: StoryHeroProps) {
  const images = (gallery && gallery.length > 0 ? gallery : [product.heroImage]).filter(Boolean);
  const [active, setActive] = useState(0);
  const reco = product.offers.find((o) => o.recommended) || product.offers[0];
  const recoOld = reco.oldPrice > reco.price ? reco.oldPrice : null;

  const ctaClass =
    ctaTone === 'rouge'
      ? 'bg-rouge hover:brightness-110 text-white shadow-[0_8px_24px_rgba(198,40,40,0.35)]'
      : 'bg-vert-mid hover:bg-vert text-white shadow-[0_8px_24px_rgba(46,125,50,0.35)]';

  const scrollToOrder = () =>
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
      <div className="container-story py-6 md:py-12 grid md:grid-cols-2 gap-8 md:gap-14">
        {/* GALERIE */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-[oklch(0.92_0.02_130)] bg-cream-2 aspect-square flex items-center justify-center">
            <img
              src={images[active]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
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
          <div className="story-eyebrow mb-2">{product.pathology.split('·')[0].trim()}</div>
          <h1 className="text-foreground mb-2" style={{ fontSize: 'clamp(1.7rem, 3.6vw, 2.6rem)' }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <span className="story-stars text-base">★★★★★</span>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{rating.stars}/5</strong> · {rating.count} avis vérifiés
            </span>
          </div>

          {subtitle && <p className="text-base text-muted-foreground mb-4 leading-relaxed">{subtitle}</p>}

          {/* PRIX */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl md:text-4xl font-extrabold text-vert">{formatFCFA(reco.price)}</span>
            {recoOld && (
              <>
                <span className="text-lg text-muted-foreground line-through pb-1">{formatFCFA(recoOld)}</span>
                <span className="bg-rouge text-white text-xs font-extrabold px-2 py-1 rounded">
                  -{Math.round(((recoOld - reco.price) / recoOld) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground -mt-2 mb-5">
            💵 Tu paies seulement à la livraison · 🚚 Livraison gratuite à Ouagadougou
          </p>

          {/* BULLETS */}
          {bullets && (
            <ul className="grid gap-2 mb-6">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="text-vert font-bold mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* SÉLECTEUR D'OFFRES (mini, pour donner un avant-goût) */}
          <div className="hidden md:block mb-4">
            <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
              Choisis ton pack
            </div>
            <MiniOfferList offers={product.offers} />
          </div>

          <button
            onClick={scrollToOrder}
            className={`w-full md:w-auto md:self-start px-8 py-4 rounded-xl text-base md:text-lg font-extrabold transition-all hover:-translate-y-0.5 ${ctaClass}`}
          >
            {ctaLabel}
          </button>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-4">
            <span>🛡️ Garantie remboursée</span>
            <span>📦 Colis discret</span>
            <span>📞 Support WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniOfferList({ offers }: { offers: Offer[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {offers.map((o) => (
        <div
          key={o.id}
          className={`rounded-lg border px-2 py-2 text-center ${
            o.recommended ? 'border-rouge bg-rouge-light' : 'border-vert-bg bg-white'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">
            {o.units} {o.units > 1 ? 'unités' : 'unité'}
          </div>
          <div className="text-sm font-extrabold text-vert leading-none mt-1">{formatFCFA(o.price)}</div>
          {o.recommended && <div className="text-[9px] text-rouge font-extrabold mt-1">⭐ POPULAIRE</div>}
          {o.bestValue && <div className="text-[9px] text-or font-extrabold mt-1">🔥 MEILLEURE</div>}
        </div>
      ))}
    </div>
  );
}
