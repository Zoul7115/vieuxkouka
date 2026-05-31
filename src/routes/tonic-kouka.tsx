import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { TONIC_KOUKA } from '@/lib/products';
import { SocialProofChatTonic } from '@/components/tonic/SocialProofChatTonic';
import { StickyOfferBarTonic } from '@/components/tonic/StickyOfferBarTonic';
import { useCtaVariant, trackCtaClick } from '@/hooks/useCtaVariant';
import bouteilleTonic from '@/assets/tonic-kouka-bouteille.jpg';
import etiquetteTonic from '@/assets/tonic-kouka-etiquette.jpg';

function preselectAndScroll(offerId: number, location = 'cta') {
  trackCtaClick(location);
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

// Classes communes pour garantir une zone de tap nette sur mobile
const TAP = 'leading-none touch-manipulation select-none active:scale-[0.98] will-change-transform';

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

function scrollToOrder() { preselectAndScroll(32, 'main-cta'); }

function TonicKoukaPage() {
  const product = TONIC_KOUKA;
  const stock = useDynamicStock('tonic-kouka', 18);
  const cta = useCtaVariant();

  return (
    <div className="bg-cream pb-[180px] sm:pb-32" style={{ paddingBottom: 'calc(180px + env(safe-area-inset-bottom))' }}>
      <StickyOfferBarTonic stock={stock} />
      <VisitTracker page="tonic-kouka" />

      {/* TOP BANNER */}
      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🌿 1 bouteille = 5 maux soignés · Plus que <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> bouteilles aujourd'hui
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-vert-bg via-white to-vert-bg py-10 md:py-12 border-b-[3px] border-vert/20">
        <div className="container-kouka">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Bottle */}
            <div className="order-1 md:order-2 text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-or/20 rounded-full blur-2xl" />
                <img src={bouteilleTonic} alt="Bouteille Tonic du Vieux KOUKA" className="relative w-full max-w-[280px] mx-auto rounded-2xl shadow-2xl" width={1024} height={1280} />
                <div className="absolute -top-2 -right-2 bg-rouge text-white text-[10px] font-extrabold px-3 py-2 rounded-full rotate-[8deg] shadow-lg">
                  -40%
                </div>
              </div>
            </div>

            {/* Text + price */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <span className="inline-block bg-or text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                🌿 La vraie recette du Vieux
              </span>
              <h1 className="text-vert mb-3 leading-tight">
                Tonic du Vieux KOUKA<br />
                <span className="text-foreground text-[0.8em]">1 seule bouteille pour 5 maux.</span>
              </h1>
              <p className="text-muted-foreground mb-5 text-base leading-relaxed">
                Insomnie, manque d'appétit, fatigue, ulcères, hypertension…
                <strong className="text-foreground"> tout dans une seule bouteille, fait avec les plantes du pays.</strong>
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs font-bold text-vert mb-6">
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">🌿 100% plantes</span>
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">🇧🇫 Fait au Burkina</span>
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">💵 Tu paies à la livraison</span>
              </div>

              {/* MAIN OFFER CARD */}
              <div className="relative bg-white border-[3px] border-vert rounded-3xl p-5 shadow-[0_12px_30px_rgba(46,125,50,0.18)] text-left">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rouge text-white text-xs font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap shadow">
                  ⭐ 9 CLIENTS SUR 10 CHOISISSENT ÇA
                </div>
                <div className="text-[11px] uppercase font-extrabold text-vert tracking-wider mt-2 mb-1">
                  Traitement complet 30 jours
                </div>
                <div className="text-xl font-extrabold text-foreground leading-tight">
                  2 bouteilles + 1 GRATUITE 🎁
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-extrabold text-vert">22 000 F</span>
                  <span className="text-base text-muted-foreground line-through">33 000 F</span>
                  <span className="text-xs font-bold text-rouge bg-rouge-light px-2 py-0.5 rounded">Tu gagnes 11 000 F</span>
                </div>
                <ul className="text-sm text-foreground mt-3 space-y-1">
                  <li>✔ 3 bouteilles reçues (1 GRATUITE)</li>
                  <li>✔ Assez pour 30 jours de cure</li>
                  <li>✔ Livré chez toi à Ouaga & Niamey</li>
                </ul>
                <button onClick={scrollToOrder} className={`mt-4 w-full bg-rouge text-white ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_10px_28px_rgba(198,40,40,0.50)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}>
                  {cta.primary}
                </button>
                <p className="text-[11px] text-muted-foreground mt-2 text-center leading-snug">📦 Livré chez toi · 💵 Tu paies seulement à la réception · 🔒 Aucun risque</p>
              </div>

              {/* SECONDARY OFFER */}
              <div className="mt-3 bg-white border-2 border-vert/30 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-left">
                    <div className="text-[11px] uppercase font-extrabold text-muted-foreground tracking-wider">Pour essayer d'abord</div>
                    <div className="text-base font-extrabold text-foreground">1 bouteille</div>
                    <div className="text-xl font-extrabold text-vert">11 000 F</div>
                  </div>
                  <button onClick={() => preselectAndScroll(31, 'hero-try')} className={`bg-vert text-white px-6 py-4 rounded-xl text-base font-extrabold shadow-lg hover:-translate-y-0.5 transition-transform min-h-[52px] ${TAP}`}>
                    Je veux essayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTO-DIAGNOSTIC */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">📋 Petit test</span>
            <h2 className="text-vert mt-2">Est-ce que tu as un de ces problèmes ?</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">Coche ce qui te concerne. <strong>Si tu coches 2 cases ou plus → le Tonic peut t'aider.</strong></p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { fam: '😴 Sommeil & énergie', items: ['Insomnie, nuits sans sommeil', 'Fatigue qui ne part pas', 'Réveil sans force'] },
              { fam: '🍽️ Appétit & digestion', items: ['Manque d\'appétit', 'Ulcères, brûlures d\'estomac', 'Ventre lourd après manger'] },
              { fam: '🫀 Tension & circulation', items: ['Hypertension, vertiges', 'Maux de tête fréquents', 'Bouffées de chaleur'] },
              { fam: '💪 Force au quotidien', items: ['Tu te sens vidé sans raison', 'Pas envie de te lever le matin', 'Concentration faible'] },
            ].map((g) => (
              <div key={g.fam} className="bg-vert-bg border-l-4 border-vert rounded-r-xl p-5">
                <p className="font-extrabold text-vert mb-3">{g.fam}</p>
                <div className="space-y-2">
                  {g.items.map((it) => (
                    <label key={it} className="flex items-start gap-2 cursor-pointer text-sm">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-vert" />
                      <span>{it}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-rouge-light border-l-4 border-rouge rounded-r-2xl p-5">
            <p className="font-extrabold text-rouge mb-2">⚠️ Si tu ne fais rien, ça devient grave :</p>
            <p className="text-sm leading-relaxed">
              Insomnie → fatigue chronique · manque d'appétit → corps qui s'affaiblit · ulcères qui percent · hypertension → AVC · fatigue qui devient permanente.
            </p>
          </div>

          <div className="text-center mt-7">
            <button onClick={scrollToOrder} className={`bg-rouge text-white px-8 ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.48)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}>
              👉 Je commande maintenant
            </button>
            <p className="text-[11px] text-muted-foreground mt-2">Tu paies seulement quand le livreur arrive</p>
          </div>
        </div>
      </section>

      {/* PRÉSENTATION VIEUX KOUKA */}
      <section className="py-14 bg-gradient-to-br from-vert to-vert-mid text-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-or-light text-xs font-bold uppercase tracking-widest">🌿 La recette</span>
            <h2 className="text-white mt-2">Le Tonic du Vieux KOUKA</h2>
            <p className="text-white/85 max-w-xl mx-auto mt-3">
              Racines, écorces et feuilles ramassées au Burkina. Une recette de famille de plus de 60 ans — <strong>une boisson amère qui nettoie le foie, les reins et le sang</strong> pour soigner plusieurs maladies en même temps.
            </p>
          </div>

          <div className="bg-white text-foreground rounded-3xl overflow-hidden shadow-2xl">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA" className="w-full max-h-96 object-cover bg-vert-bg" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-vert text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold">VK</div>
                <div>
                  <div className="font-extrabold text-vert">Vieux KOUKA</div>
                  <div className="text-xs text-muted-foreground">Guérisseur traditionnel · Région des Kuilsés 🇧🇫</div>
                </div>
              </div>
              <p className="italic text-muted-foreground leading-relaxed text-sm">
                "Le Tonic, c'est ma recette la plus forte. Il soigne 5 maux à la fois — sommeil, appétit, fatigue, ulcères, tension — parce qu'il réveille ce qui nettoie ton corps à l'intérieur."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LE PRODUIT — bouteille + bénéfices */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">💊 Le produit</span>
            <h2 className="text-vert mt-2">Les 5 maux que le Tonic soigne</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-or/40 bg-cream-2">
              <img src={etiquetteTonic} alt="Étiquette officielle Tonic du Vieux KOUKA" className="w-full max-h-[500px] object-contain p-4" width={1024} height={1536} loading="lazy" />
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                'Insomnie',
                'Manque d\'appétit',
                'Fatigue',
                'Ulcères',
                'Hypertension',
              ].map((b, i) => (
                <div key={b} className="bg-vert-bg border border-vert/20 rounded-xl p-3">
                  <div className="font-extrabold text-vert text-[15px] flex items-start gap-2">
                    <span className="text-or font-extrabold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="leading-tight">{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <button onClick={scrollToOrder} className={`bg-rouge text-white px-8 ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.48)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}>
              ✅ Je commande mon Tonic
            </button>
            <p className="text-[11px] text-muted-foreground mt-2">Paiement uniquement quand tu reçois</p>
          </div>
        </div>
      </section>

      {/* POSOLOGIE */}
      <section className="py-12 bg-cream-2">
        <div className="container-kouka max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">💧 Comment prendre le Tonic</span>
            <h2 className="text-vert mt-2">Facile à prendre, une seule fois par jour</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border-l-4 border-vert rounded-r-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-vert font-extrabold mb-3">📏 La dose</p>
              <p className="text-foreground text-lg leading-relaxed font-bold">
                Adulte : <span className="text-vert">un verre et demi de thé</span>, le soir seulement, avant de manger.
              </p>
              <ul className="text-sm text-muted-foreground mt-4 space-y-1.5">
                <li>⚡ Bien secouer la bouteille avant de boire</li>
                <li>📅 Cure de 30 jours, puis 15 jours de repos</li>
                <li>🌡️ Garder loin de la chaleur</li>
              </ul>
            </div>
            <div className="bg-white border-l-4 border-rouge rounded-r-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-rouge font-extrabold mb-3">⚠️ Attention</p>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2"><span>🚫</span><span><strong>Pas d'alcool</strong> pendant toute la cure</span></li>
                <li className="flex gap-2"><span>🚫</span><span><strong>Ne pas conduire</strong> juste après avoir bu</span></li>
                <li className="flex gap-2"><span>🚫</span><span><strong>Femmes enceintes</strong> : interdit</span></li>
                <li className="flex gap-2"><span>👶</span><span><strong>Enfants 5-12 ans :</strong> 1 cuillère à café le soir</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA AGIT — 3 organes */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">🌿 Comment ça marche</span>
            <h2 className="text-vert mt-2">Pourquoi 1 bouteille soigne 5 maux</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              C'est une <strong>boisson amère</strong> qui réveille les 3 organes qui nettoient ton corps.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { i: '🫁', t: 'Nettoie le foie', d: 'Enlève les toxines · ouvre l\'appétit · calme l\'estomac et les ulcères.' },
              { i: '💧', t: 'Réveille les reins', d: 'Évacue l\'eau en trop · fait baisser la tension · enlève les gonflements.' },
              { i: '🩸', t: 'Active le sang', d: 'Apporte l\'oxygène · ramène l\'énergie · améliore le sommeil et la fatigue.' },
            ].map((x) => (
              <div key={x.t} className="bg-vert-bg border-2 border-vert/20 rounded-2xl p-5 text-center">
                <div className="text-5xl mb-3">{x.i}</div>
                <div className="font-extrabold text-vert text-lg mb-1">{x.t}</div>
                <div className="text-sm text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
          <p className="text-center italic mt-6 text-muted-foreground max-w-xl mx-auto text-sm">
            "Quand le foie, les reins et le sang travaillent bien — la plupart des maladies partent toutes seules. C'est ça, la médecine de chez nous."
          </p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <SocialProofChatTonic />

      {/* PAIEMENT À LA LIVRAISON */}
      <section className="py-10 bg-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="bg-white border-2 border-vert rounded-2xl p-5 text-center">
            <p className="font-extrabold text-vert mb-1 text-lg">💵 Tu paies SEULEMENT à la livraison</p>
            <p className="text-sm">Tu ne donnes <strong>aucun franc à l'avance</strong>. Le livreur vient chez toi, tu regardes la bouteille, et tu paies <strong>cash quand tu reçois</strong>. Zéro risque.</p>
          </div>
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className={`bg-rouge text-white px-8 ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.48)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}>
              👉 Commander maintenant
            </button>
            <p className="text-[11px] text-muted-foreground mt-2">🔒 Aucun paiement avant de recevoir</p>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">⚖️ Comparaison</span>
            <h2 className="text-vert mt-2">Tonic KOUKA contre 5 médicaments différents</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border-2 border-vert/30 shadow-sm">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-vert text-white">
                  <th className="text-left px-3 py-3 font-bold">Critère</th>
                  <th className="px-3 py-3 font-extrabold bg-vert-mid">🌿 Tonic KOUKA</th>
                  <th className="px-3 py-3 font-bold">5 médicaments</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Maladies soignées', '✅ 12 d\'un coup', '❌ 1 par produit'],
                  ['Coût par mois', '22 000 F', 'Plus de 50 000 F'],
                  ['Effets secondaires', '✅ Aucun', '⚠️ Abîme foie, reins'],
                  ['D\'où ça vient', '🌿 Plantes du Burkina', 'Produits chimiques'],
                  ['Dépendance', '✅ Aucune', '❌ Souvent à vie'],
                  ['Discrétion', '✅ 100%', 'Pharmacie au vu de tous'],
                  ['Paiement', '✅ À la livraison', '❌ Avant de recevoir'],
                ].map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-vert-bg/40'}>
                    <td className="px-3 py-3 font-bold text-foreground">{r[0]}</td>
                    <td className="px-3 py-3 text-center font-bold text-vert bg-vert-bg/60">{r[1]}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* LIVRAISON */}
      <section className="py-10 bg-cream-2">
        <div className="container-kouka max-w-2xl">
          <h3 className="text-vert text-center mb-5">🚚 Livraison Burkina · Niger</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { city: '🇧🇫 Ouagadougou', note: 'Gratuit · même jour', free: true },
              { city: '🇧🇫 Autres villes BF', note: '1 000 F · par car', free: false },
              { city: '🇳🇪 Niamey', note: 'Gratuit', free: true },
              { city: '🇳🇪 Autres villes Niger', note: '1 500 F · par car', free: false },
            ].map((x) => (
              <div key={x.city} className={`bg-white border-2 rounded-xl p-3 text-center ${x.free ? 'border-vert' : 'border-vert/20'}`}>
                <div className="font-extrabold text-foreground text-[13px]">{x.city}</div>
                <div className={`text-xs font-bold mt-1 ${x.free ? 'text-vert' : 'text-muted-foreground'}`}>{x.note}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">💵 Cash · 📦 Tu vérifies la bouteille avant de payer</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">❓ Questions</span>
            <h2 className="text-vert mt-2">Tes questions, mes réponses</h2>
          </div>
          <FAQ
            items={[
              { q: "Comment 1 seul produit peut soigner 12 maladies ?", a: "Parce que c'est une <strong>boisson amère</strong> qui ne soigne pas les symptômes un par un — elle réveille les 3 organes nettoyeurs (foie, reins, sang). Quand ces organes marchent bien, ton corps se répare tout seul sur plusieurs maladies." },
              { q: "En combien de temps je vais voir les résultats ?", a: "<strong>Dès la 1ère semaine :</strong> tu te sens plus léger, tu as plus d'énergie. <strong>Entre J15 et J30 :</strong> les douleurs (ulcère, règles, hémorroïdes) baissent, la tension et le sucre se stabilisent. <strong>À la fin de la cure :</strong> changement durable." },
              { q: "Combien de bouteilles je dois prendre ?", a: "<strong>1 bouteille</strong> = pour essayer. <strong>Pack 2 + 1 GRATUITE (22 000 F)</strong> = la cure complète conseillée (9 clients sur 10 prennent celle-là). <strong>Pack 3 + 2 GRATUITES (33 000 F)</strong> = pour toute la famille." },
              { q: "Comment je dois prendre le Tonic ?", a: "<strong>Adulte :</strong> un verre et demi de thé, <strong>seulement le soir, avant de manger</strong>. Bien secouer avant. Cure de 30 jours, puis 15 jours de repos." },
              { q: "Est-ce qu'il y a des effets secondaires ?", a: "Aucun — 100% plantes africaines, zéro chimie, zéro dépendance. <strong>Attention :</strong> pas d'alcool pendant la cure, ne pas conduire juste après, interdit aux femmes enceintes." },
              { q: "Je peux le prendre avec mes médicaments ?", a: "Oui, c'est un complément naturel. <strong>N'arrête jamais tes médicaments d'un coup</strong> — continue ton traitement et parle à ton médecin avant de changer quelque chose." },
              { q: "Comment je paie ?", a: "<strong>Cash, seulement à la livraison.</strong> Tu reçois la bouteille, tu vérifies, tu paies. Aucun acompte, aucun risque." },
              { q: "La livraison est discrète ?", a: "Oui — emballage neutre sans logo. Personne (livreur, voisin, famille) ne peut deviner ce que tu as commandé." },
            ]}
          />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className={`bg-rouge text-white px-8 ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.48)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}>
              ✅ Je commande mon Tonic
            </button>
            <p className="text-[11px] text-muted-foreground mt-2">Paiement uniquement quand tu reçois</p>
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="py-12 bg-gradient-to-b from-white to-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">🎁 Tout ce que tu reçois</span>
            <h2 className="text-vert mt-2">Tout est inclus dans la cure complète</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-vert/30">
            <ul className="divide-y divide-vert/20">
              {[
                { t: '3 bouteilles de Tonic du Vieux KOUKA (1 GRATUITE)', v: '33 000 F' },
                { t: 'Conseils personnalisés sur WhatsApp', v: 'Offert' },
                { t: 'Suivi du Vieux pendant toute la cure', v: 'Offert' },
                { t: 'Livraison à domicile (Ouaga & Niamey)', v: 'Offert' },
                { t: 'Tu paies seulement à la livraison — zéro risque', v: '✓' },
              ].map((x, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="text-vert">✓</span> {x.t}
                  </span>
                  <span className="text-sm font-extrabold text-vert whitespace-nowrap">{x.v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t-2 border-vert flex items-center justify-between">
              <div>
                <span className="font-extrabold text-foreground">Total à payer</span>
                <span className="block text-xs text-muted-foreground line-through">au lieu de 33 000 F</span>
              </div>
              <span className="text-3xl font-extrabold text-vert">22 000 F</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white rounded-xl p-3 border border-vert/20 text-center">
              <div className="text-2xl">🚚</div>
              <div className="text-[11px] font-bold text-vert mt-1">Livraison rapide</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-vert/20 text-center">
              <div className="text-2xl">💵</div>
              <div className="text-[11px] font-bold text-vert mt-1">Cash à la livraison</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-vert/20 text-center">
              <div className="text-2xl">🤝</div>
              <div className="text-[11px] font-bold text-vert mt-1">Suivi WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-10 bg-white border-t border-vert/20">
        <div className="container-kouka max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-vert font-bold mb-2">🌿 La cure conseillée</p>
          <h3 className="text-vert mb-2">2 bouteilles + 1 GRATUITE · 22 000 FCFA</h3>
          <p className="text-sm text-muted-foreground mb-4">9 clients sur 10 prennent cette offre. Plus que <b className="text-rouge">{stock}</b> bouteilles aujourd'hui.</p>
          <button onClick={scrollToOrder} className={`bg-rouge text-white px-8 ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_10px_28px_rgba(198,40,40,0.50)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}>
            ✅ JE COMMANDE — Paiement à la livraison
          </button>
          <p className="text-xs text-muted-foreground mt-3">📦 Livré à Ouaga & Niamey · 💵 Tu paies cash quand tu reçois</p>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="py-8 bg-white border-t border-vert/20">
        <div className="container-kouka text-center">
          <Link to="/" className="text-vert font-bold text-sm">← Retour à l'accueil</Link>
        </div>
      </section>
    </div>
  );
}
