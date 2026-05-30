import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
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
  { i: '🩸', t: 'Hémorroïdes (Kooko)', d: 'Saignements, douleurs, rectum' },
  { i: '🔥', t: 'Ulcères d\'estomac', d: 'Brûlures, gastrite, douleurs' },
  { i: '💢', t: 'Hypertension', d: 'Tension élevée, vertiges' },
  { i: '🩺', t: 'Diabète', d: 'Glycémie instable' },
  { i: '🌸', t: 'Fibromes / Myomes', d: 'Masses utérines' },
  { i: '🌙', t: 'Règles douloureuses', d: 'Crampes, troubles' },
  { i: '⚕️', t: 'Hernie', d: 'Douleurs abdominales' },
  { i: '🫀', t: 'Anémie', d: 'Manque de sang, faiblesse' },
  { i: '🦟', t: 'Paludisme', d: 'Fièvre, courbatures' },
  { i: '😴', t: 'Fatigue chronique', d: 'Insomnie, manque d\'énergie' },
  { i: '🦠', t: 'Infections bactériennes', d: 'Infections diverses' },
  { i: '💪', t: 'Faiblesse sexuelle', d: 'Éjaculation précoce, érection' },
];

function TonicKoukaPage() {
  const product = TONIC_KOUKA;
  const stock = useDynamicStock('tonic-kouka', 18);

  return (
    <div className="bg-background pb-16 md:pb-0">
      <VisitTracker page="tonic-kouka" />

      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🌿 1 flacon · 12 maux · Livraison gratuite Ouaga & Niamey · ⏰ Stock : <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> flacons
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-[3px] border-[oklch(0.85_0.06_145)]">
        <div className="container-kouka text-center">
          <span className="inline-block bg-or text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
            🏆 Recette traditionnelle · +60 ans
          </span>
          <h1 className="text-vert mb-3 leading-tight">
            Un seul flacon.<br />
            <em className="text-rouge not-italic">12 maux soulagés.</em>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-5 text-base leading-relaxed">
            Hémorroïdes, ulcères, diabète, hypertension, fibromes, faiblesse sexuelle…
            <strong className="text-foreground"> Le Tonic du Vieux KOUKA agit sur 12 maux à la fois</strong> — 100% plantes africaines.
          </p>

          <div className="max-w-[320px] mx-auto mb-5 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(46,125,50,0.25)] border-[3px] border-or">
            <img src={bouteilleTonic} alt="Tonic du Vieux KOUKA" className="w-full block" width={1024} height={1024} />
          </div>

          {/* PRIX visible dans le hero */}
          <div className="bg-white border-2 border-rouge rounded-2xl p-4 mb-5 max-w-sm mx-auto shadow-md">
            <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">⭐ Offre populaire</div>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-3xl font-extrabold text-rouge">18 000 FCFA</span>
              <span className="text-base text-muted-foreground line-through">30 000</span>
            </div>
            <div className="text-sm font-bold text-vert">2 flacons + 1 OFFERT · Cure complète 30 jours</div>
            <div className="text-xs text-muted-foreground mt-1">📦 Livré gratuit Ouaga & Niamey · Cash à la livraison</div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
            <span>✅ 100% plantes</span>
            <span>✅ 12 maux soulagés</span>
            <span>✅ Cash à la livraison</span>
          </div>

          <button
            onClick={scrollToOrder}
            className="w-full bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            🌿 JE COMMANDE — JE PAIE À LA LIVRAISON
          </button>
          <p className="text-sm text-muted-foreground mt-3">🚚 Livraison rapide · 💵 Paiement uniquement à la réception</p>
        </div>
      </section>

      {/* RECONNAIS-TU CES MAUX ? — checklist regroupée */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Reconnais-tu <span className="text-rouge">ces signes</span> ?</h2>
          <p className="text-center text-muted-foreground mb-7 max-w-lg mx-auto text-sm">
            Coche ce que tu vis. Si tu as 2 cases ou plus → 1 seul produit peut t'aider sur plusieurs fronts.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { fam: '🩺 Digestif & ventre', items: ['Hémorroïdes qui saignent', 'Brûlures d\'estomac / ulcères', 'Ballonnements, gaz, hernie'] },
              { fam: '🫀 Circulation & vitalité', items: ['Tension élevée, vertiges', 'Glycémie qui monte/descend', 'Anémie, manque de sang, fatigue'] },
              { fam: '🌸 Santé féminine', items: ['Règles douloureuses, irrégulières', 'Fibromes / myomes', 'Infections gynécologiques'] },
              { fam: '💪 Énergie & sexualité', items: ['Faiblesse sexuelle, éjaculation précoce', 'Paludisme à répétition', 'Insomnie, fatigue chronique'] },
            ].map((g) => (
              <div key={g.fam} className="bloc">
                <p className="font-extrabold text-vert mb-3">{g.fam}</p>
                <ul className="space-y-2 text-sm">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="text-or">☐</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center italic mt-6 text-muted-foreground max-w-lg mx-auto">
            "Au lieu de payer 5 médicaments différents pour 5 maux différents, le Vieux KOUKA a réuni dans 1 seul flacon toute la sagesse de ses plantes."
          </p>
        </div>
      </section>

      {/* PRÉSENTATION DU VIEUX */}
      <section className="sec bg-vert-bg">
        <div className="container-kouka">
          <h2 className="text-center mb-3">La sagesse du <span className="text-vert">Vieux KOUKA</span></h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Le Tonic est l'élixir le plus complet de la formule traditionnelle du Vieux KOUKA —
            <strong>un amer (herbal bitter) qui stimule le foie, les reins et la circulation</strong> pour soigner plusieurs maux à la fois.
          </p>

          <div className="bloc bloc-or p-0 overflow-hidden max-w-lg mx-auto">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA" className="w-full max-h-72 object-cover" />
            <div className="p-5">
              <h3 className="text-or mb-1">📖 Vieux KOUKA</h3>
              <p className="text-xs text-muted-foreground font-semibold mb-1">
                Thérapeute traditionnel · +60 ans de pratique
              </p>
              <p className="text-sm text-vert font-bold mb-3">
                📍 Région des Kuilsés · Burkina Faso 🇧🇫
              </p>
              <p className="italic text-muted-foreground leading-relaxed text-sm">
                "Héritier d'un savoir transmis par son grand-père, le Vieux KOUKA récolte lui-même
                chaque plante de son Tonic — racines, écorces et feuilles puisées dans la brousse
                burkinabé selon les cycles de la lune."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* L'ÉTIQUETTE EN GRAND — preuve visuelle + 12 maux */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">🌿 Les <span className="text-or">12 maux</span> que le Tonic soulage</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
            Tout est écrit sur l'étiquette. Pas de promesse cachée, pas de surprise.
          </p>

          <div className="max-w-md mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-or">
            <img src={etiquetteTonic} alt="Étiquette officielle du Tonic du Vieux KOUKA — 12 maux soulagés" className="w-full block" width={1024} height={1536} loading="lazy" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {MAUX.map((m, i) => (
              <div key={m.t} className="bg-white border-2 border-vert-bg rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{m.i}</div>
                <div className="font-extrabold text-vert text-xs leading-tight">{i + 1}. {m.t}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{m.d}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-7">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🌿 Je veux le Tonic KOUKA
            </button>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA AGIT */}
      <section className="sec">
        <div className="container-kouka max-w-3xl">
          <h2 className="text-center mb-2">Comment <span className="text-vert">1 seul flacon</span> peut agir sur 12 maux ?</h2>
          <p className="text-center text-muted-foreground mb-7 max-w-lg mx-auto text-sm">
            Le secret : ce n'est pas un médicament symptomatique. C'est un <strong>amer (bitter)</strong> qui réveille les 3 organes nettoyeurs du corps.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { i: '🫁', t: 'Stimule le foie', d: 'Filtre les toxines, régule la glycémie, soulage l\'estomac et les ulcères.' },
              { i: '💧', t: 'Active les reins', d: 'Évacue l\'eau en trop, fait baisser la tension, soulage les œdèmes.' },
              { i: '🩸', t: 'Relance la circulation', d: 'Oxygène le sang, soulage hémorroïdes, fatigue, faiblesse sexuelle et anémie.' },
            ].map((x) => (
              <div key={x.t} className="bg-vert-bg border-2 border-vert-bg rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">{x.i}</div>
                <div className="font-extrabold text-vert mb-1">{x.t}</div>
                <div className="text-sm text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>

          <p className="text-center italic mt-7 text-muted-foreground max-w-lg mx-auto text-sm">
            "Quand le foie, les reins et le sang fonctionnent bien — la plupart des maux disparaissent tout seuls. C'est ça, la médecine ancestrale."
          </p>
        </div>
      </section>

      {/* POSOLOGIE + PRÉCAUTIONS */}
      <section className="sec bg-vert-bg/50">
        <div className="container-kouka max-w-3xl">
          <h2 className="text-center mb-6">💊 Mode d'emploi</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border-2 border-vert rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-vert font-extrabold mb-3">📏 Posologie</p>
              <ul className="space-y-2 text-sm">
                <li><strong>Adultes :</strong> 1 verre à liqueur (30 ml), 2 fois par jour, matin et soir après les repas.</li>
                <li><strong>Enfants (5-12 ans) :</strong> 1 cuillère à café (5 ml), 2 fois par jour après les repas.</li>
                <li><strong>Cure :</strong> 30 jours renouvelables après 15 jours de pause.</li>
                <li className="text-vert font-bold">⚡ Bien remuer avant chaque emploi.</li>
              </ul>
            </div>
            <div className="bg-white border-2 border-rouge rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-rouge font-extrabold mb-3">⚠️ Précautions</p>
              <ul className="space-y-2 text-sm">
                <li>🚫 <strong>Pas d'alcool</strong> pendant le traitement</li>
                <li>🚫 <strong>Pas de conduite</strong> sous l'effet du produit</li>
                <li>🚫 <strong>Interdit aux femmes enceintes</strong></li>
                <li>🌡️ Conserver à l'abri de la chaleur et de la lumière</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIVRAISON BF + NIGER */}
      <section className="sec">
        <div className="container-kouka">
          <div className="bg-white border-2 border-vert-bg rounded-2xl p-5 max-w-lg mx-auto">
            <h3 className="text-vert text-center mb-3">🚚 Livraison Burkina · Niger</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-vert-bg/50 rounded-lg p-2.5 text-center">
                <div className="font-extrabold">🇧🇫 Ouagadougou</div>
                <div className="text-xs text-vert font-bold">Gratuite · même jour</div>
              </div>
              <div className="bg-vert-bg/50 rounded-lg p-2.5 text-center">
                <div className="font-extrabold">🇧🇫 Autres villes BF</div>
                <div className="text-xs text-muted-foreground">1 000 FCFA · par car</div>
              </div>
              <div className="bg-vert-bg/50 rounded-lg p-2.5 text-center">
                <div className="font-extrabold">🇳🇪 Niamey</div>
                <div className="text-xs text-vert font-bold">Gratuite</div>
              </div>
              <div className="bg-vert-bg/50 rounded-lg p-2.5 text-center">
                <div className="font-extrabold">🇳🇪 Autres villes Niger</div>
                <div className="text-xs text-muted-foreground">1 500 FCFA · par car</div>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              💵 Paiement cash à la livraison · 📦 Tu vérifies avant de payer
            </p>
          </div>
        </div>
      </section>

      {/* COMPARATIF — 1 produit vs plusieurs médecins */}
      <section className="sec bg-cream-2">
        <div className="container-kouka max-w-3xl">
          <h2 className="text-center mb-2">Tonic KOUKA <span className="text-vert">vs aller voir 5 médecins différents</span></h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
            Compare honnêtement. Tu vas comprendre pourquoi tant de familles l'adoptent.
          </p>

          <div className="overflow-x-auto rounded-2xl border-2 border-vert-bg shadow-sm">
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
                  ['Paiement', '✅ À la livraison', '❌ D\'avance'],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 ? 'bg-vert-bg/30' : 'bg-white'}>
                    <td className="px-3 py-2.5 font-semibold">{row[0]}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-vert">{row[1]}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-7">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🌿 Je commande le Tonic
            </button>
          </div>
        </div>
      </section>

      {/* PAIEMENT À LA LIVRAISON — réassurance */}
      <section className="sec">
        <div className="container-kouka max-w-3xl">
          <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-5 text-center">
            <p className="font-extrabold text-vert mb-1">💵 Paiement uniquement à la livraison</p>
            <p className="text-sm">Tu ne paies <strong>RIEN à l'avance</strong>. Le livreur passe chez toi, tu vérifies le flacon, et tu payes <strong>cash à la réception</strong>. Aucun risque, zéro acompte.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Questions fréquentes</h2>
          <FAQ />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🌿 OK, je commande maintenant
            </button>
          </div>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="sec bg-cream-2">
        <div className="container-kouka text-center">
          <Link to="/" className="text-vert-mid font-bold text-sm">← Retour à la page d'accueil</Link>
        </div>
      </section>
    </div>
  );
}
