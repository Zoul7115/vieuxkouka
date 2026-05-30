import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { SocialProofChatTonic } from '@/components/tonic/SocialProofChatTonic';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { TONIC_KOUKA } from '@/lib/products';
import etiquetteTonic from '@/assets/tonic-kouka-etiquette.jpg';
import bouteilleTonic from '@/assets/tonic-kouka-bouteille.jpg';

export const Route = createFileRoute('/tonic-kouka')({
  head: () => ({
    meta: [
      { title: TONIC_KOUKA.metaTitle },
      { name: 'description', content: TONIC_KOUKA.metaDesc },
      { property: 'og:title', content: TONIC_KOUKA.metaTitle },
      { property: 'og:description', content: TONIC_KOUKA.metaDesc },
      { property: 'og:image', content: bouteilleTonic },
    ],
  }),
  component: TonicKoukaPage,
});

function scrollToOrder() {
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

const MAUX = [
  'Hémorroïdes (Kooko)',
  'Ulcères d\'estomac',
  'Hypertension artérielle',
  'Diabète',
  'Fibromes / Myomes',
  'Règles douloureuses',
  'Hernie',
  'Anémie',
  'Paludisme à répétition',
  'Fatigue chronique',
  'Infections bactériennes',
  'Faiblesse sexuelle',
];

// Forest green + gold palette — distinct from the Poudre KOUKA red/green look
const DARK = '#0f2a1c';
const DARK2 = '#1a3c2a';
const GOLD = '#c9a84c';
const CREAM = '#f5f0e0';

function TonicKoukaPage() {
  const product = TONIC_KOUKA;
  const stock = useDynamicStock('tonic-kouka', 18);

  return (
    <div className="bg-[#faf7ed] pb-16 md:pb-0 font-sans">
      <VisitTracker page="tonic-kouka" />

      {/* TOP BAR — dark forest */}
      <div className="text-white text-center py-2.5 px-4 text-[13px] font-bold sticky top-0 z-40 tracking-wide" style={{ background: DARK }}>
        <span style={{ color: GOLD }}>★</span> ÉLIXIR 12-EN-1 · Livraison gratuite Ouaga & Niamey · Stock : <b style={{ color: GOLD }}>{stock}</b> flacons <span style={{ color: GOLD }}>★</span>
      </div>

      {/* HERO — dark apothecary, magazine cover style */}
      <section className="relative overflow-hidden" style={{ background: `radial-gradient(ellipse at top, ${DARK2}, ${DARK})` }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="container-kouka relative py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left — text */}
            <div className="text-white order-2 md:order-1">
              <div className="inline-flex items-center gap-2 border border-[color:var(--gold)]/50 text-[11px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-5" style={{ ['--gold' as string]: GOLD, color: GOLD }}>
                <span>✦</span> Édition Tradition · Recette du Vieux <span>✦</span>
              </div>
              <h1 className="font-serif text-white leading-[1.05] mb-5" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.6rem)' }}>
                Un flacon.<br />
                <span style={{ color: GOLD, fontStyle: 'italic' }}>Douze maux.</span><br />
                Une famille en paix.
              </h1>
              <p className="text-white/75 text-base leading-relaxed mb-7 max-w-md">
                Le <strong className="text-white">Tonic du Vieux KOUKA</strong> est un amer traditionnel ouest-africain. Hémorroïdes, ulcères, diabète, hypertension, fibromes, faiblesse sexuelle… <em style={{ color: GOLD }}>douze maux soulagés par un seul élixir</em>.
              </p>

              <div className="flex flex-wrap gap-2 mb-8 text-[12px]">
                {['100% Plantes', 'Cash à la livraison', '+60 ans de tradition', 'Burkina 🇧🇫'].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: CREAM, border: `1px solid ${GOLD}55` }}>{t}</span>
                ))}
              </div>

              <button onClick={scrollToOrder} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md text-base font-extrabold uppercase tracking-wider transition-transform hover:-translate-y-0.5 shadow-2xl" style={{ background: GOLD, color: DARK }}>
                Commander · 18 000 FCFA →
              </button>
              <p className="text-white/55 text-xs mt-3">Tu paies cash à la réception. Aucun acompte.</p>
            </div>

            {/* Right — bottle photo */}
            <div className="order-1 md:order-2 relative">
              <div className="absolute -inset-6 rounded-full blur-3xl opacity-30" style={{ background: GOLD }} />
              <img src={bouteilleTonic} alt="Bouteille Tonic du Vieux KOUKA" className="relative w-full max-w-sm mx-auto rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.5)]" width={1024} height={1280} />
              <div className="absolute -bottom-3 -right-3 md:bottom-4 md:right-0 rounded-full px-4 py-3 text-center shadow-xl rotate-[-8deg]" style={{ background: GOLD, color: DARK }}>
                <div className="text-[10px] font-bold uppercase tracking-wider">Recette</div>
                <div className="font-serif text-2xl font-extrabold leading-none">+60</div>
                <div className="text-[10px] font-bold uppercase tracking-wider">ans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIBBON — separator stats */}
      <section className="py-6" style={{ background: GOLD }}>
        <div className="container-kouka grid grid-cols-2 sm:grid-cols-4 gap-4 text-center" style={{ color: DARK }}>
          {[
            { n: '12', l: 'maux soulagés' },
            { n: '3 sem.', l: 'pour ressentir' },
            { n: '+2 000', l: 'familles servies' },
            { n: '0 F', l: 'd\'avance' },
          ].map(s => (
            <div key={s.l}>
              <div className="font-serif text-2xl md:text-3xl font-extrabold leading-none">{s.n}</div>
              <div className="text-[11px] uppercase tracking-widest font-bold opacity-80">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE 12 MAUX — magazine index style */}
      <section className="py-14">
        <div className="container-kouka max-w-5xl">
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>✦ La formule du Vieux ✦</div>
            <h2 className="font-serif" style={{ color: DARK, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>Les douze maux que l'élixir combat.</h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto italic">"Au lieu de payer cinq médecins pour cinq maux, le Vieux a réuni dans un seul flacon la sagesse de ses plantes."</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
            {MAUX.map((m, i) => (
              <div key={m} className="flex items-baseline gap-4 py-3 border-b border-dashed" style={{ borderColor: `${GOLD}50` }}>
                <span className="font-serif text-3xl font-extrabold tabular-nums" style={{ color: GOLD }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold text-[15px]" style={{ color: DARK }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT — label + mechanism */}
      <section className="py-14" style={{ background: CREAM }}>
        <div className="container-kouka max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-sm overflow-hidden shadow-2xl border-4" style={{ borderColor: DARK }}>
            <img src={etiquetteTonic} alt="Étiquette officielle Tonic du Vieux KOUKA" className="w-full block" width={1024} height={1536} loading="lazy" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>✦ Comment ça agit ✦</div>
            <h2 className="font-serif mb-5" style={{ color: DARK }}>Un seul flacon. Trois organes réveillés.</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Ce n'est pas un médicament symptomatique. C'est un <strong style={{ color: DARK }}>amer (herbal bitter)</strong> qui stimule les trois organes nettoyeurs du corps. Quand ils fonctionnent bien — la plupart des maux disparaissent d'eux-mêmes.
            </p>
            <ul className="space-y-4">
              {[
                { t: 'Le foie', d: 'Filtre les toxines · régule la glycémie · soulage estomac et ulcères.' },
                { t: 'Les reins', d: 'Évacuent l\'eau en trop · font baisser la tension · soulagent les œdèmes.' },
                { t: 'La circulation', d: 'Oxygène le sang · soulage hémorroïdes, anémie, fatigue, faiblesse sexuelle.' },
              ].map(x => (
                <li key={x.t} className="flex gap-4 items-start">
                  <span className="font-serif text-xl leading-none mt-1" style={{ color: GOLD }}>✦</span>
                  <div>
                    <div className="font-extrabold text-[15px]" style={{ color: DARK }}>{x.t}</div>
                    <div className="text-sm text-muted-foreground">{x.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — WA + FB */}
      <SocialProofChatTonic />

      {/* POSOLOGIE — apothecary card */}
      <section className="py-14" style={{ background: CREAM }}>
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <div className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>✦ Mode d'emploi ✦</div>
            <h2 className="font-serif" style={{ color: DARK }}>Posologie & précautions</h2>
          </div>

          <div className="bg-white border-2 rounded-sm overflow-hidden shadow-xl" style={{ borderColor: DARK }}>
            <div className="p-6 text-center border-b-2" style={{ borderColor: `${GOLD}66`, background: DARK, color: 'white' }}>
              <div className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: GOLD }}>Posologie officielle</div>
              <p className="font-serif text-xl md:text-2xl leading-snug">
                <span style={{ color: GOLD }}>Adulte :</span> Un verre et demi de thé,<br />
                <em>uniquement le soir,</em> avant le dîner.
              </p>
              <p className="text-xs text-white/60 mt-3">⚡ Bien remuer le flacon avant chaque emploi · Cure 30 jours renouvelable après 15 j de pause.</p>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {[
                  { i: '🚫', t: 'Pas d\'alcool', d: 'pendant toute la cure' },
                  { i: '🚫', t: 'Pas de conduite', d: 'sous l\'effet du produit' },
                  { i: '🚫', t: 'Femmes enceintes', d: 'strictement déconseillé' },
                ].map(p => (
                  <div key={p.t} className="text-center p-3 rounded" style={{ background: `${CREAM}` }}>
                    <div className="text-xl mb-1">{p.i}</div>
                    <div className="font-extrabold text-[13px]" style={{ color: DARK }}>{p.t}</div>
                    <div className="text-[11px] text-muted-foreground">{p.d}</div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4 italic">🌡️ Conserver à l'abri de la chaleur et de la lumière.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVE — minimal table */}
      <section className="py-14">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <div className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>✦ Comparatif ✦</div>
            <h2 className="font-serif" style={{ color: DARK }}>Un Tonic vs cinq ordonnances.</h2>
          </div>
          <div className="rounded-sm overflow-hidden border-2 shadow-md" style={{ borderColor: DARK }}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: DARK, color: 'white' }}>
                  <th className="text-left px-4 py-3 font-bold">Critère</th>
                  <th className="px-4 py-3 text-center font-extrabold" style={{ color: GOLD }}>Tonic KOUKA</th>
                  <th className="px-4 py-3 text-center font-bold opacity-80">5 médicaments</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Maux traités', '12 à la fois', '1 par produit'],
                  ['Coût mensuel', '18 000 F', '50 000+ F'],
                  ['Effets secondaires', 'Aucun', 'Foie, reins'],
                  ['Origine', 'Plantes Burkina', 'Chimie'],
                  ['Dépendance', 'Aucune', 'Souvent à vie'],
                  ['Paiement', 'À la livraison', 'D\'avance'],
                ].map((r, i) => (
                  <tr key={i} style={{ background: i % 2 ? CREAM : 'white' }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: DARK }}>{r[0]}</td>
                    <td className="px-4 py-3 text-center font-extrabold" style={{ color: DARK }}>{r[1]}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="py-12" style={{ background: CREAM }}>
        <div className="container-kouka max-w-2xl">
          <h3 className="font-serif text-center mb-5" style={{ color: DARK }}>🚚 Livraison Burkina · Niger</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['🇧🇫 Ouagadougou', 'Gratuite · même jour', true],
              ['🇧🇫 Autres villes BF', '1 000 F · par car', false],
              ['🇳🇪 Niamey', 'Gratuite', true],
              ['🇳🇪 Autres villes Niger', '1 500 F · par car', false],
            ].map(([city, note, free], i) => (
              <div key={i} className="bg-white border-2 rounded-sm p-3 text-center" style={{ borderColor: free ? GOLD : `${DARK}22` }}>
                <div className="font-extrabold text-[13px]" style={{ color: DARK }}>{city}</div>
                <div className="text-xs font-bold mt-1" style={{ color: free ? GOLD : 'inherit' }}>{note}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">💵 Paiement cash à la livraison · 📦 Tu vérifies avant de payer.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <div className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>✦ Questions fréquentes ✦</div>
            <h2 className="font-serif" style={{ color: DARK }}>Tu hésites encore ?</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ORDER FORM */}
      <ProductForm product={product} />

      <section className="py-8 text-center" style={{ background: DARK, color: 'white' }}>
        <Link to="/" className="font-bold text-sm" style={{ color: GOLD }}>← Retour à la page d'accueil</Link>
      </section>
    </div>
  );
}
