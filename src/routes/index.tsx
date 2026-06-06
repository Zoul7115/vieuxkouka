import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { PRODUCTS, ADMIN_WHATSAPP, formatFCFA } from '@/lib/products';
import { VisitTracker } from '@/components/VisitTracker';
import logoAsset from '@/assets/logo-vieux-kouka.png.asset.json';

const LOGO = logoAsset.url;

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Les Remèdes Naturels du Vieux KOUKA — Marque officielle' },
      {
        name: 'description',
        content:
          "Gamme officielle de remèdes naturels du Vieux KOUKA : faiblesse sexuelle, diabète, troubles digestifs, vitalité. Paiement à la livraison · Livraison Burkina Faso.",
      },
      { property: 'og:title', content: 'Les Remèdes Naturels du Vieux KOUKA' },
      {
        property: 'og:description',
        content:
          "Découvrez la gamme officielle de remèdes naturels du Vieux KOUKA. Paiement à la livraison · Assistance WhatsApp.",
      },
      { property: 'og:image', content: LOGO },
    ],
  }),
  component: BrandHomePage,
});

type CatalogItem = {
  key: string;
  emoji: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  priceFrom: number;
  image: string;
  to: string;
  params?: Record<string, string>;
  tags: string[]; // for "quel remède" filter
  /** Architecture marketing : flags optionnels */
  featured?: boolean;
  popular?: boolean;
  promo?: boolean;
  isNew?: boolean;
};

/** Architecture catalogue — modifiable sans toucher au reste du code */
const CATALOG: CatalogItem[] = [
  {
    key: 'sirop',
    emoji: '🍯',
    title: 'Sirop KOUKA — Faiblesse Sexuelle',
    description:
      "Solution naturelle pour les hommes souhaitant retrouver confiance, vitalité et performance.",
    badge: '🔥 Plus demandé',
    badgeColor: 'bg-rouge text-white',
    priceFrom: 12000,
    image: '/images/kouka-flacon.png',
    to: '/product/$slug',
    params: { slug: 'sirop-kouka' },
    tags: ['sexuel'],
    featured: true,
    popular: true,
  },
  {
    key: 'anti-diabete',
    emoji: '🩸',
    title: 'Poudre Anti-Diabète',
    description:
      "Accompagnement naturel pour stabiliser la glycémie, retrouver énergie et clarté visuelle.",
    badge: '⭐ Recommandé',
    badgeColor: 'bg-or text-foreground',
    priceFrom: 12500,
    image: '/images/anti-diabete-sachet-illustre.png',
    to: '/anti-diabete',
    tags: ['diabete'],
    featured: true,
  },
  {
    key: 'poudre',
    emoji: '🌿',
    title: 'Poudre KOUKA — Troubles Digestifs',
    description:
      "Pour les ulcères, colopathies, hémorroïdes, ballonnements et autres troubles digestifs.",
    badge: '🌿 Naturel',
    badgeColor: 'bg-vert text-white',
    priceFrom: 10000,
    image: '/images/poudre-vieux-kouka-hero.png',
    to: '/poudre-kouka',
    tags: ['digestif'],
    popular: true,
  },
  {
    key: 'tonic',
    emoji: '⚡',
    title: 'Tonic KOUKA — Vitalité',
    description: "Pour retrouver énergie, force, appétit et sommeil au quotidien.",
    badge: '⚡ Vitalité',
    badgeColor: 'bg-[oklch(0.55_0.18_45)] text-white',
    priceFrom: 11000,
    image: '/images/kouka-flacon.png',
    to: '/tonic-kouka',
    tags: ['vitalite'],
    isNew: true,
  },
];

// Récupère prix dynamique depuis products.ts si dispo
function getPriceFrom(item: CatalogItem): number {
  const slug =
    item.key === 'sirop' ? 'sirop-kouka'
    : item.key === 'anti-diabete' ? 'anti-diabete'
    : item.key === 'poudre' ? 'kouka'
    : item.key === 'tonic' ? 'tonic-kouka'
    : null;
  if (!slug) return item.priceFrom;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return item.priceFrom;
  return Math.min(...p.offers.map((o) => o.price));
}

const WHATSAPP_URL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('Bonjour, je viens du site Les Remèdes Naturels du Vieux KOUKA.')}`;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BrandHomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <VisitTracker page="brand-home" />

      {/* HEADER fixe */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-vert-bg shadow-sm">
        <div className="container-kouka flex items-center justify-between py-2.5">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={LOGO} alt="Logo Vieux KOUKA" className="h-10 md:h-12 w-auto" />
            <span className="hidden md:block font-extrabold text-vert leading-tight text-sm">
              LES REMÈDES NATURELS<br />
              <span className="text-or">DU VIEUX KOUKA</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-foreground/80">
            <button onClick={() => scrollToId('top')} className="hover:text-vert">Accueil</button>
            <button onClick={() => scrollToId('catalogue')} className="hover:text-vert">Nos Remèdes</button>
            <button onClick={() => scrollToId('temoignages')} className="hover:text-vert">Témoignages</button>
            <button onClick={() => scrollToId('faq')} className="hover:text-vert">FAQ</button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-3.5 py-2 rounded-lg font-extrabold hover:scale-105 transition-transform">
              💬 WhatsApp
            </a>
          </nav>
          <button
            onClick={() => setMobileMenu((v) => !v)}
            className="md:hidden p-2 rounded-lg border border-vert-bg"
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-vert mb-1" />
            <span className="block w-5 h-0.5 bg-vert mb-1" />
            <span className="block w-5 h-0.5 bg-vert" />
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-vert-bg bg-white">
            <div className="container-kouka py-3 grid gap-2 text-sm font-bold">
              <button onClick={() => { scrollToId('top'); setMobileMenu(false); }} className="text-left py-2">🏠 Accueil</button>
              <button onClick={() => { scrollToId('catalogue'); setMobileMenu(false); }} className="text-left py-2">🌿 Nos Remèdes</button>
              <button onClick={() => { scrollToId('temoignages'); setMobileMenu(false); }} className="text-left py-2">⭐ Témoignages</button>
              <button onClick={() => { scrollToId('faq'); setMobileMenu(false); }} className="text-left py-2">❓ FAQ</button>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-3 py-2.5 rounded-lg text-center">💬 WhatsApp</a>
            </div>
          </div>
        )}
      </header>

      <span id="top" />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-vert-bg via-background to-background border-b border-vert-bg">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, oklch(0.55 0.15 145), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.78 0.14 85), transparent 50%)' }} />
        <div className="container-kouka relative text-center py-10 md:py-16">
          <img src={LOGO} alt="Les Remèdes Naturels du Vieux KOUKA" className="mx-auto h-44 md:h-64 w-auto mb-4 drop-shadow-md" />
          <h1 className="text-vert font-extrabold text-2xl md:text-4xl leading-tight mb-3">
            LES REMÈDES NATURELS DU VIEUX KOUKA
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-5">
            Découvrez une gamme de remèdes naturels reconnus pour accompagner efficacement les personnes souffrant de <strong className="text-foreground">faiblesse sexuelle, diabète, troubles digestifs, ulcères, colopathies, hémorroïdes</strong> et autres problèmes de santé du quotidien.
          </p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm font-semibold text-vert mb-6">
            <span>✔ Produits naturels</span>
            <span>✔ Paiement à la livraison</span>
            <span>✔ Livraison partout au Burkina Faso</span>
            <span>✔ Assistance WhatsApp</span>
          </div>

          <button
            onClick={() => scrollToId('catalogue')}
            className="bg-vert text-white px-8 py-4 rounded-xl text-base md:text-lg font-extrabold shadow-[0_8px_24px_rgba(46,125,50,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            🌿 Découvrir nos remèdes
          </button>
        </div>
      </section>

      {/* POURQUOI CHOISIR */}
      <section className="sec bg-white">
        <div className="container-kouka">
          <h2 className="text-center text-vert mb-2">Pourquoi tant de personnes font confiance au Vieux KOUKA ?</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">Une marque burkinabè reconnue pour la qualité de ses formules et la satisfaction de ses clients.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {[
              { i: '🌿', t: 'Formules naturelles', d: 'Plantes africaines sélectionnées avec soin.' },
              { i: '📦', t: 'Livraison rapide', d: 'Partout au Burkina Faso · Ouaga 24h.' },
              { i: '💵', t: 'Paiement à la livraison', d: 'Vous payez uniquement à la réception.' },
              { i: '⭐', t: 'Des centaines de clients', d: 'Accompagnés et satisfaits depuis des années.' },
              { i: '📞', t: 'Conseils personnalisés', d: 'Notre équipe répond à vos questions.' },
              { i: '🏆', t: 'Expérience & savoir-faire', d: 'Une expertise reconnue du Vieux KOUKA.' },
            ].map((c) => (
              <div key={c.t} className="bg-vert-bg/50 border border-vert-bg rounded-2xl p-4 md:p-5 hover:-translate-y-0.5 transition-transform">
                <div className="text-3xl md:text-4xl mb-2">{c.i}</div>
                <div className="font-extrabold text-vert text-sm md:text-base mb-1">{c.t}</div>
                <div className="text-xs md:text-sm text-muted-foreground leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOGUE */}
      <ProductCatalog id="catalogue" />

      {/* QUIZ NAVIGATION */}
      <section className="sec bg-white">
        <div className="container-kouka">
          <h2 className="text-center text-vert mb-2">Quel est votre besoin principal ?</h2>
          <p className="text-center text-muted-foreground mb-7 max-w-xl mx-auto">Choisissez votre situation — nous vous orientons vers le bon remède.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { i: '👨', t: 'Faiblesse sexuelle', to: '/product/$slug', params: { slug: 'sirop-kouka' } as Record<string, string> },
              { i: '🩸', t: 'Diabète', to: '/anti-diabete' },
              { i: '🌿', t: 'Troubles digestifs', to: '/poudre-kouka' },
              { i: '⚡', t: 'Vitalité', to: '/tonic-kouka' },
            ].map((q) => (
              <Link
                key={q.t}
                to={q.to}
                {...(q.params ? { params: q.params } : {})}
                className="bg-gradient-to-br from-vert-bg/60 to-white border-2 border-vert-bg rounded-2xl p-5 text-center hover:-translate-y-1 hover:border-vert transition-all shadow-sm"
              >
                <div className="text-4xl md:text-5xl mb-2">{q.i}</div>
                <div className="font-extrabold text-vert text-sm md:text-base">{q.t}</div>
                <div className="text-xs text-rouge font-bold mt-1.5">Voir le remède →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section id="temoignages" className="sec bg-vert-bg/30">
        <div className="container-kouka">
          <h2 className="text-center text-vert mb-2">Ils nous ont fait confiance</h2>
          <p className="text-center text-muted-foreground mb-7">Témoignages réels de clients du Vieux KOUKA</p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { txt: "Je suis totalement guérie. Les ballonnements sont finis, le rectum ne sort plus. Merci au Vieux KOUKA 🙏", auth: 'Cliente WhatsApp · Burkina Faso' },
              { txt: "Ton produit est vraiment efficace. J'ai suivi la cure complète et je ne souffre plus. Je recommande.", auth: 'Client WhatsApp · Renouvellement' },
              { txt: "Depuis ce traitement naturel ma santé s'est améliorée et je me sens plus en forme qu'avant.", auth: 'Client WhatsApp' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-2 border-vert-bg shadow-sm">
                <div className="text-or text-lg mb-2">★★★★★</div>
                <p className="italic text-muted-foreground leading-relaxed mb-3 text-sm">"{t.txt}"</p>
                <div className="text-xs text-vert font-bold">{t.auth}</div>
              </div>
            ))}
          </div>

          {/* Carrousel mobile + grid desktop des captures WhatsApp */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
            <div className="flex gap-3 pb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <img
                  key={n}
                  loading="lazy"
                  src={`/images/temo-wa${n}.webp`}
                  alt={`Témoignage WhatsApp ${n}`}
                  className="rounded-xl border-2 border-vert-bg w-[72%] flex-shrink-0 snap-center"
                />
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <img key={n} loading="lazy" src={`/images/temo-wa${n}.webp`} alt={`Témoignage WhatsApp ${n}`} className="rounded-xl border-2 border-vert-bg w-full" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="sec bg-white">
        <div className="container-kouka max-w-3xl">
          <h2 className="text-center text-vert mb-2">Questions fréquentes</h2>
          <p className="text-center text-muted-foreground mb-7">Tout ce que vous devez savoir avant de commander</p>
          <div className="grid gap-3">
            {[
              { q: 'Comment commander ?', a: "Cliquez sur le remède qui vous correspond, choisissez votre formule, remplissez le formulaire et nous vous rappelons pour confirmer la livraison." },
              { q: 'Le paiement se fait-il à la livraison ?', a: "Oui — vous payez uniquement à la réception, en espèces. Aucun acompte, aucune carte requise." },
              { q: 'Livrez-vous partout au Burkina Faso ?', a: "Oui. Livraison gratuite à Ouagadougou. Pour les autres villes, livraison par car de transport (frais : 1 000 FCFA)." },
              { q: 'Comment utiliser les produits ?', a: "Chaque produit est livré avec un mode d'emploi clair. Notre équipe WhatsApp vous accompagne pendant toute la cure." },
              { q: 'Puis-je commander pour un proche ?', a: "Oui — indiquez simplement le nom, le numéro et l'adresse de la personne lors de la commande." },
              { q: 'Sous combien de temps suis-je livré ?', a: "Ouagadougou : 24h après confirmation. Autres villes : 24 à 72h via car de transport." },
            ].map((f, i) => (
              <div key={i} className="bg-white border-2 border-vert-bg rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left p-4 font-bold text-vert hover:bg-vert-bg/40 transition-colors"
                >
                  <span className="pr-4">{f.q}</span>
                  <span className="text-xl shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-vert-bg pt-3">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="sec bg-gradient-to-b from-vert-bg to-white">
        <div className="container-kouka text-center">
          <h2 className="text-vert mb-2">Choisissez le remède adapté à votre besoin</h2>
          <p className="text-muted-foreground mb-7 max-w-xl mx-auto">Tous nos remèdes sont 100% naturels, payables à la livraison.</p>
          <ProductGrid />
          <button
            onClick={() => scrollToId('catalogue')}
            className="mt-8 bg-vert text-white px-8 py-4 rounded-xl text-base md:text-lg font-extrabold shadow-[0_8px_24px_rgba(46,125,50,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            🌿 Découvrir nos remèdes
          </button>
        </div>
      </section>

      {/* WhatsApp flottant */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-4 z-40 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-[0_4px_18px_rgba(37,211,102,0.45)] font-extrabold flex items-center gap-2 hover:scale-105 transition-transform"
      >
        💬 Une question ?
      </a>

      {/* FOOTER */}
      <footer className="bg-vert text-white pt-10 pb-8">
        <div className="container-kouka">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <img src={LOGO} alt="Logo" className="h-16 w-auto bg-white/95 rounded-lg p-1 mb-3" />
              <p className="text-xs text-white/80 leading-relaxed">
                Marque officielle des Remèdes Naturels du Vieux KOUKA. Burkina Faso 🇧🇫
              </p>
            </div>
            <div>
              <h4 className="font-extrabold mb-3 text-or">Informations</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>💵 Paiement à la livraison</li>
                <li>📦 Livraison Burkina Faso</li>
                <li>🌿 Produits 100% naturels</li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3 text-or">Nos Remèdes</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/product/$slug" params={{ slug: 'sirop-kouka' }} className="text-white/80 hover:text-white">🍯 Sirop KOUKA</Link></li>
                <li><Link to="/anti-diabete" className="text-white/80 hover:text-white">🩸 Anti-Diabète</Link></li>
                <li><Link to="/poudre-kouka" className="text-white/80 hover:text-white">🌿 Poudre KOUKA</Link></li>
                <li><Link to="/tonic-kouka" className="text-white/80 hover:text-white">⚡ Tonic KOUKA</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3 text-or">Contact</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white">💬 WhatsApp : +226 58 44 48 18</a>
                </li>
                <li className="text-xs">Réponse rapide tous les jours</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/15 pt-5 text-center text-xs text-white/70">
            © {new Date().getFullYear()} Les Remèdes Naturels du Vieux KOUKA · Mentions légales · Paiement à la livraison
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCatalog({ id }: { id?: string }) {
  return (
    <section id={id} className="sec bg-vert-bg/30">
      <div className="container-kouka">
        <div className="text-center mb-8">
          <span className="inline-block bg-or text-foreground text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
            🌿 Gamme officielle
          </span>
          <h2 className="text-vert mb-2">Nos remèdes naturels</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Chaque formule est conçue pour un besoin précis — sélectionnée et préparée avec le savoir-faire du Vieux KOUKA.</p>
        </div>
        <ProductGrid />
      </div>
    </section>
  );
}

function ProductGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {CATALOG.map((p) => {
        const price = getPriceFrom(p);
        return (
          <Link
            key={p.key}
            to={p.to}
            {...(p.params ? { params: p.params } : {})}
            className="group bg-white rounded-2xl border-2 border-vert-bg overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(46,125,50,0.18)] transition-all"
          >
            <div className="relative aspect-square bg-gradient-to-br from-vert-bg/40 to-white overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
              <span className={`absolute top-3 left-3 ${p.badgeColor} text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow`}>
                {p.badge}
              </span>
              {p.isNew && (
                <span className="absolute top-3 right-3 bg-vert text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  NOUVEAU
                </span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-2xl mb-1">{p.emoji}</div>
              <h3 className="font-extrabold text-vert text-base leading-snug mb-1.5">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{p.description}</p>
              <div className="flex items-end justify-between gap-2 mt-auto">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground font-bold">À partir de</div>
                  <div className="text-lg font-extrabold text-rouge leading-none">{formatFCFA(price)}</div>
                </div>
                <span className="bg-vert text-white text-xs font-extrabold px-3 py-2 rounded-lg group-hover:bg-vert-mid transition-colors">
                  Voir le remède →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
