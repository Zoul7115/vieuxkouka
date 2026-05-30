import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { TONIC_KOUKA } from '@/lib/products';
import { SocialProofChatTonic } from '@/components/tonic/SocialProofChatTonic';
import { StickyOfferBarTonic } from '@/components/tonic/StickyOfferBarTonic';
import bouteilleTonic from '@/assets/tonic-kouka-bouteille.jpg';
import etiquetteTonic from '@/assets/tonic-kouka-etiquette.jpg';

function preselectAndScroll(offerId: number) {
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

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

function scrollToOrder() { preselectAndScroll(32); }

function TonicKoukaPage() {
  const product = TONIC_KOUKA;
  const stock = useDynamicStock('tonic-kouka', 18);

  return (
    <div className="bg-cream pb-32">
      <StickyOfferBarTonic stock={stock} />
      <VisitTracker page="tonic-kouka" />

      {/* TOP BANNER */}
      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🌿 1 flacon · 12 maux · Livraison Ouaga & Niamey · Stock limité : <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> flacons
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-vert-bg via-white to-vert-bg py-10 md:py-12 border-b-[3px] border-vert/20">
        <div className="container-kouka">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Bottle */}
            <div className="order-1 md:order-2 text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-or/20 rounded-full blur-2xl" />
                <img src={bouteilleTonic} alt="Bouteille Tonic du Vieux KOUKA — élixir 12-en-1" className="relative w-full max-w-[280px] mx-auto rounded-2xl shadow-2xl" width={1024} height={1280} />
                <div className="absolute -top-2 -right-2 bg-rouge text-white text-[10px] font-extrabold px-3 py-2 rounded-full rotate-[8deg] shadow-lg">
                  -40%
                </div>
              </div>
            </div>

            {/* Text + price */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <span className="inline-block bg-or text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                🌿 Élixir 12-en-1 · Recette du Vieux
              </span>
              <h1 className="text-vert mb-3 leading-tight">
                Tonic du Vieux KOUKA<br />
                <span className="text-foreground text-[0.8em]">12 maux soulagés par un seul flacon.</span>
              </h1>
              <p className="text-muted-foreground mb-5 text-base leading-relaxed">
                Hémorroïdes, ulcères, diabète, hypertension, fibromes, faiblesse sexuelle…
                <strong className="text-foreground"> un amer traditionnel ouest-africain qui agit sur 12 maux à la fois.</strong>
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs font-bold text-vert mb-6">
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">🌿 100% plantes</span>
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">🇧🇫 Burkina Faso</span>
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">💵 Cash à la livraison</span>
              </div>

              {/* MAIN OFFER CARD */}
              <div className="relative bg-white border-[3px] border-vert rounded-3xl p-5 shadow-[0_12px_30px_rgba(46,125,50,0.18)] text-left">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rouge text-white text-xs font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap shadow">
                  ⭐ OFFRE LA PLUS CHOISIE
                </div>
                <div className="text-[11px] uppercase font-extrabold text-vert tracking-wider mt-2 mb-1">
                  Cure complète 30 jours
                </div>
                <div className="text-xl font-extrabold text-foreground leading-tight">
                  2 flacons + 1 OFFERT 🎁
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-extrabold text-vert">18 000 F</span>
                  <span className="text-base text-muted-foreground line-through">30 000 F</span>
                  <span className="text-xs font-bold text-rouge bg-rouge-light px-2 py-0.5 rounded">-40%</span>
                </div>
                <ul className="text-sm text-foreground mt-3 space-y-1">
                  <li>✔ 3 flacons reçus (1 GRATUIT)</li>
                  <li>✔ Cure complète 30 jours</li>
                  <li>✔ Livraison Ouaga & Niamey</li>
                </ul>
                <button onClick={scrollToOrder} className="mt-4 w-full bg-rouge text-white py-4 rounded-xl text-base font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.45)] hover:-translate-y-0.5 transition-transform">
                  Commander · Payer à la livraison
                </button>
                <p className="text-[11px] text-muted-foreground mt-2 text-center">📦 Livraison rapide · 💵 Cash à la réception</p>
              </div>

              {/* SECONDARY OFFER */}
              <div className="mt-3 bg-white border-2 border-vert/30 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-left">
                    <div className="text-[11px] uppercase font-extrabold text-muted-foreground tracking-wider">Offre découverte</div>
                    <div className="text-base font-extrabold text-foreground">1 flacon pour tester</div>
                    <div className="text-xl font-extrabold text-vert">8 000 F</div>
                  </div>
                  <button onClick={() => preselectAndScroll(31)} className="bg-vert text-white px-5 py-3 rounded-xl text-sm font-extrabold shadow hover:-translate-y-0.5 transition-transform">
                    Tester
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
            <span className="text-vert text-xs font-bold uppercase tracking-widest">📋 Auto-diagnostic</span>
            <h2 className="text-vert mt-2">Reconnais-tu ces signes ?</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">Coche ce que tu vis. <strong>Si 2 cases ou plus → le Tonic peut t'aider sur plusieurs fronts à la fois.</strong></p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { fam: '🩺 Digestif & ventre', items: ['Hémorroïdes qui saignent (kooko)', 'Brûlures d\'estomac, ulcères', 'Hernie, ballonnements'] },
              { fam: '🫀 Circulation & vitalité', items: ['Tension élevée, vertiges', 'Glycémie qui monte/descend', 'Anémie, fatigue chronique'] },
              { fam: '🌸 Santé féminine', items: ['Règles douloureuses, irrégulières', 'Fibromes, myomes', 'Infections gynécologiques'] },
              { fam: '💪 Énergie & sexualité', items: ['Faiblesse sexuelle, éjaculation précoce', 'Paludisme à répétition', 'Insomnie, manque d\'énergie'] },
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
            <p className="font-extrabold text-rouge mb-2">⚠️ Sans agir, ces maux empirent :</p>
            <p className="text-sm leading-relaxed">
              Hémorroïdes qui sortent → opération · ulcères qui perforent · hypertension qui mène à l'AVC · diabète qui détruit reins et yeux · fibromes qui grossissent · fatigue qui s'installe à vie.
            </p>
          </div>

          <div className="text-center mt-7">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              Je commande le Tonic
            </button>
          </div>
        </div>
      </section>

      {/* PRÉSENTATION VIEUX KOUKA */}
      <section className="py-14 bg-gradient-to-br from-vert to-vert-mid text-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-or-light text-xs font-bold uppercase tracking-widest">🌿 La formule</span>
            <h2 className="text-white mt-2">Tonic du Vieux KOUKA</h2>
            <p className="text-white/85 max-w-xl mx-auto mt-3">
              Racines, écorces et feuilles récoltées au Burkina selon les cycles de la lune. Une formule transmise depuis +60 ans — <strong>un amer (herbal bitter) qui stimule le foie, les reins et la circulation</strong> pour soigner plusieurs maux à la fois.
            </p>
          </div>

          <div className="bg-white text-foreground rounded-3xl overflow-hidden shadow-2xl">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA, thérapeute traditionnel" className="w-full max-h-96 object-cover bg-vert-bg" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-vert text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold">VK</div>
                <div>
                  <div className="font-extrabold text-vert">Vieux KOUKA</div>
                  <div className="text-xs text-muted-foreground">Thérapeute traditionnel · Région des Kuilsés 🇧🇫</div>
                </div>
              </div>
              <p className="italic text-muted-foreground leading-relaxed text-sm">
                "Le Tonic est l'élixir le plus complet de ma formule. Là où les médicaments soulagent un seul mal, le Tonic en soigne douze à la fois — parce qu'il réveille les organes qui nettoient ton corps de l'intérieur."
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
            <h2 className="text-vert mt-2">Les 12 maux que le Tonic combat</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-or/40 bg-cream-2">
              <img src={etiquetteTonic} alt="Étiquette officielle Tonic du Vieux KOUKA — 12 maux" className="w-full max-h-[500px] object-contain p-4" width={1024} height={1536} loading="lazy" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Hémorroïdes (Kooko)',
                'Ulcères d\'estomac',
                'Hypertension',
                'Diabète',
                'Fibromes / Myomes',
                'Règles douloureuses',
                'Hernie',
                'Anémie',
                'Paludisme',
                'Fatigue chronique',
                'Infections bactériennes',
                'Faiblesse sexuelle',
              ].map((b, i) => (
                <div key={b} className="bg-vert-bg border border-vert/20 rounded-xl p-3">
                  <div className="font-extrabold text-vert text-[13px] flex items-start gap-2">
                    <span className="text-or font-extrabold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="leading-tight">{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POSOLOGIE */}
      <section className="py-12 bg-cream-2">
        <div className="container-kouka max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">💧 Mode d'emploi</span>
            <h2 className="text-vert mt-2">Posologie simple, une fois par jour</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border-l-4 border-vert rounded-r-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-vert font-extrabold mb-3">📏 Posologie officielle</p>
              <p className="text-foreground text-lg leading-relaxed font-bold">
                Adulte : <span className="text-vert">un verre et demi de thé,</span> uniquement le soir, avant le dîner.
              </p>
              <ul className="text-sm text-muted-foreground mt-4 space-y-1.5">
                <li>⚡ Bien remuer le flacon avant chaque emploi</li>
                <li>📅 Cure de 30 jours renouvelable après 15 j de pause</li>
                <li>🌡️ Conserver à l'abri de la chaleur</li>
              </ul>
            </div>
            <div className="bg-white border-l-4 border-rouge rounded-r-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-rouge font-extrabold mb-3">⚠️ Précautions</p>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2"><span>🚫</span><span><strong>Pas d'alcool</strong> pendant toute la cure</span></li>
                <li className="flex gap-2"><span>🚫</span><span><strong>Pas de conduite</strong> sous l'effet du produit</span></li>
                <li className="flex gap-2"><span>🚫</span><span><strong>Femmes enceintes</strong> : strictement déconseillé</span></li>
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
            <span className="text-vert text-xs font-bold uppercase tracking-widest">🌿 Mode d'action</span>
            <h2 className="text-vert mt-2">Pourquoi 1 flacon agit sur 12 maux</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              Ce n'est pas un médicament symptomatique. C'est un <strong>amer (herbal bitter)</strong> qui réveille les 3 organes nettoyeurs du corps.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { i: '🫁', t: 'Stimule le foie', d: 'Filtre les toxines · régule la glycémie · soulage l\'estomac et les ulcères.' },
              { i: '💧', t: 'Active les reins', d: 'Évacuent l\'eau en trop · font baisser la tension · soulagent les œdèmes.' },
              { i: '🩸', t: 'Relance la circulation', d: 'Oxygène le sang · soulage hémorroïdes, anémie, fatigue, faiblesse sexuelle.' },
            ].map((x) => (
              <div key={x.t} className="bg-vert-bg border-2 border-vert/20 rounded-2xl p-5 text-center">
                <div className="text-5xl mb-3">{x.i}</div>
                <div className="font-extrabold text-vert text-lg mb-1">{x.t}</div>
                <div className="text-sm text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
          <p className="text-center italic mt-6 text-muted-foreground max-w-xl mx-auto text-sm">
            "Quand le foie, les reins et le sang fonctionnent bien — la plupart des maux disparaissent tout seuls. C'est ça, la médecine ancestrale."
          </p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <SocialProofChatTonic />

      {/* PAIEMENT À LA LIVRAISON */}
      <section className="py-10 bg-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="bg-white border-2 border-vert rounded-2xl p-5 text-center">
            <p className="font-extrabold text-vert mb-1">💵 Paiement uniquement à la livraison</p>
            <p className="text-sm">Tu ne paies <strong>RIEN à l'avance</strong>. Le livreur passe chez toi, tu vérifies le flacon, et tu règles <strong>cash à la réception</strong>. Aucun risque, zéro acompte.</p>
          </div>
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              Commander maintenant
            </button>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">⚖️ Comparatif</span>
            <h2 className="text-vert mt-2">Tonic KOUKA vs 5 médicaments différents</h2>
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
                  ['Maux traités', '✅ 12 à la fois', '❌ 1 par produit'],
                  ['Coût mensuel', '18 000 F', '50 000+ F'],
                  ['Effets secondaires', '✅ Aucun', '⚠️ Foie, reins'],
                  ['Origine', '🌿 Plantes Burkina', 'Chimie'],
                  ['Dépendance', '✅ Aucune', '❌ Souvent à vie'],
                  ['Discrétion', '✅ 100%', 'Pharmacie'],
                  ['Paiement', '✅ À la livraison', '❌ D\'avance'],
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
              { city: '🇧🇫 Ouagadougou', note: 'Gratuite · même jour', free: true },
              { city: '🇧🇫 Autres villes BF', note: '1 000 F · par car', free: false },
              { city: '🇳🇪 Niamey', note: 'Gratuite', free: true },
              { city: '🇳🇪 Autres villes Niger', note: '1 500 F · par car', free: false },
            ].map((x) => (
              <div key={x.city} className={`bg-white border-2 rounded-xl p-3 text-center ${x.free ? 'border-vert' : 'border-vert/20'}`}>
                <div className="font-extrabold text-foreground text-[13px]">{x.city}</div>
                <div className={`text-xs font-bold mt-1 ${x.free ? 'text-vert' : 'text-muted-foreground'}`}>{x.note}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">💵 Paiement cash · 📦 Tu vérifies avant de payer</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">❓ FAQ</span>
            <h2 className="text-vert mt-2">Questions fréquentes</h2>
          </div>
          <FAQ
            items={[
              { q: "Comment 1 seul produit peut soigner 12 maux différents ?", a: "Parce que c'est un <strong>amer (herbal bitter)</strong> qui ne soigne pas les symptômes un par un — il réveille les 3 organes nettoyeurs (foie, reins, circulation). Quand ces organes fonctionnent bien, ton corps se répare lui-même sur plusieurs fronts à la fois." },
              { q: "En combien de temps je vois les résultats ?", a: "<strong>Dès la 1ère semaine :</strong> tu te sens plus léger, plus d'énergie. <strong>Entre J15 et J30 :</strong> les douleurs (ulcères, règles, hémorroïdes) diminuent, la tension et la glycémie se stabilisent. <strong>Au bout de la cure complète :</strong> changement durable." },
              { q: "Combien de flacons dois-je prendre ?", a: "<strong>1 flacon</strong> = pour tester. <strong>Pack 2 + 1 OFFERT (18 000 F)</strong> = la cure complète recommandée (90% de nos clients choisissent celle-ci). <strong>Pack 3 + 2 OFFERTS (25 000 F)</strong> = pour toute la famille." },
              { q: "Quelle est la posologie ?", a: "<strong>Adulte :</strong> un verre et demi de thé, <strong>uniquement le soir, avant le dîner</strong>. Bien remuer avant chaque emploi. Cure de 30 jours renouvelable après 15 jours de pause." },
              { q: "Y a-t-il des effets secondaires ?", a: "Aucun — 100% plantes africaines, aucune chimie, aucune dépendance. <strong>Précautions :</strong> pas d'alcool pendant la cure, pas de conduite sous l'effet, déconseillé aux femmes enceintes." },
              { q: "Je peux le prendre avec mes médicaments ?", a: "Oui, c'est un complément naturel. <strong>Ne stoppe jamais brutalement tes médicaments</strong> — continue ton traitement et parle à ton médecin avant toute modification." },
              { q: "Comment je paie ?", a: "<strong>Cash à la livraison uniquement.</strong> Tu reçois le flacon, tu vérifies, tu paies. Aucun acompte, aucun risque." },
              { q: "La livraison est-elle discrète ?", a: "Oui — emballage neutre sans logo. Personne (livreur, voisin, famille) ne peut deviner ce que tu as commandé." },
            ]}
          />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              Commander le Tonic
            </button>
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="py-12 bg-gradient-to-b from-white to-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">🎁 Ce que tu reçois</span>
            <h2 className="text-vert mt-2">Tout est inclus dans ta cure complète</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-vert/30">
            <ul className="divide-y divide-vert/20">
              {[
                { t: '3 flacons de Tonic du Vieux KOUKA (1 OFFERT)', v: '27 000 F' },
                { t: 'Posologie personnalisée par WhatsApp', v: 'Offert' },
                { t: 'Suivi du Vieux pendant toute la cure', v: 'Offert' },
                { t: 'Livraison à domicile (Ouaga & Niamey)', v: 'Offert' },
                { t: 'Paiement à la livraison — zéro risque', v: '✓' },
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
                <span className="block text-xs text-muted-foreground line-through">au lieu de 30 000 F</span>
              </div>
              <span className="text-3xl font-extrabold text-vert">18 000 F</span>
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
          <p className="text-xs uppercase tracking-widest text-vert font-bold mb-2">🌿 Cure recommandée</p>
          <h3 className="text-vert mb-2">2 flacons + 1 OFFERT · 18 000 FCFA</h3>
          <p className="text-sm text-muted-foreground mb-4">L'offre la plus choisie. Stock limité — restant : <b className="text-rouge">{stock}</b> flacons</p>
          <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
            Commander la cure complète
          </button>
          <p className="text-xs text-muted-foreground mt-3">📦 Livraison Ouaga & Niamey · Cash à la livraison</p>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="py-8 bg-white border-t border-vert/20">
        <div className="container-kouka text-center">
          <Link to="/" className="text-vert font-bold text-sm">← Retour à la page d'accueil</Link>
        </div>
      </section>
    </div>
  );
}
