import { createFileRoute, Link } from '@tanstack/react-router';
import { KOUKA } from '@/lib/products';
import { VisitTracker } from '@/components/VisitTracker';
import { ProductForm } from '@/components/ProductForm';
import { RecommendedCureSection } from '@/components/RecommendedCureSection';
import { FAQ } from '@/components/FAQ';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LiveSocialProof } from '@/components/LiveSocialProof';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { DiagnosticQuiz } from '@/components/conversion/DiagnosticQuiz';
import { OfferComparisonTable } from '@/components/conversion/OfferComparisonTable';
import { ReassuranceBar } from '@/components/conversion/ReassuranceBar';



export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: KOUKA.metaTitle },
      { name: 'description', content: KOUKA.metaDesc },
      { property: 'og:title', content: KOUKA.metaTitle },
      { property: 'og:description', content: KOUKA.metaDesc },
      { property: 'og:image', content: KOUKA.heroImage },
    ],
  }),
  component: HomePage,
});

function scrollToOrder() {
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

function HomePage() {
  const product = KOUKA;
  const stock = useDynamicStock('kouka', 18);

  return (
    <div className="bg-background pb-16 md:pb-0">
      <VisitTracker page="home" />
      <LiveSocialProof product="Poudre KOUKA" />
      {/* StickyMobileCTA, ExitIntentPopup, AbandonRecovery removed for conversion */}

      {/* Bandeau urgence */}
      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🌿 +200 guéris · Livraison gratuite Ouaga & Niamey · ⏰ Stock restant : <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> sachets
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-[3px] border-[oklch(0.85_0.06_145)]">
        <div className="container-kouka text-center">
          <div className="bg-[oklch(0.97_0.06_92)] border-2 border-or-light rounded-xl px-4 py-2.5 mb-5">
            <span className="text-[oklch(0.40_0.10_82)] font-bold">
              🚀 Commande avant 17h → Livraison <strong className="text-vert">demain matin</strong> à Ouaga & Niamey
            </span>
          </div>

          <span className="inline-block bg-vert-mid text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            ⭐ +200 clients guéris · 87% soulagés dès J3
          </span>

          <h1 className="text-vert mb-3">
            Hémorroïdes, ulcères, gaz dans le ventre (colopathie) ?<br />
            <em className="text-rouge not-italic">Soulagé en 3 jours.</em>
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto mb-5 text-base leading-relaxed">
            Saignements, brûlures d'estomac, ballonnements — <strong className="text-foreground">la Poudre du Vieux KOUKA traite la cause, pas le symptôme.</strong>
          </p>

          {/* Photo produit */}
          <div className="max-w-[420px] mx-auto mb-5 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(46,125,50,0.25)] border-[3px] border-[oklch(0.85_0.06_145)]">
            <img src={product.heroImage} alt={product.name} className="w-full block" />
          </div>

          {/* 3 OFFRES dans le hero */}
          <div className="max-w-md mx-auto mb-5">
            <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2 text-center">💰 Choisis ton pack</div>
            <div className="grid grid-cols-3 gap-2">
              {product.offers.map((o) => (
                <button
                  key={o.id}
                  onClick={scrollToOrder}
                  className={`rounded-xl p-2.5 border-2 text-center transition-transform hover:-translate-y-0.5 ${
                    o.recommended
                      ? 'bg-white border-rouge shadow-md ring-2 ring-rouge/20'
                      : 'bg-white border-vert-bg'
                  }`}
                >
                  {o.recommended && (
                    <div className="text-[9px] font-extrabold text-rouge uppercase mb-0.5">⭐ Top</div>
                  )}
                  <div className="text-[11px] font-bold text-vert leading-tight mb-1">
                    {o.units} sachet{o.units > 1 ? 's' : ''}
                    {o.bonusUnits > 0 && <span className="block text-[10px] text-rouge">{o.paidUnits}+{o.bonusUnits} offert{o.bonusUnits > 1 ? 's' : ''}</span>}
                  </div>
                  <div className={`text-base font-extrabold ${o.recommended ? 'text-rouge' : 'text-foreground'}`}>
                    {(o.price / 1000).toFixed(0)}k
                  </div>
                  {o.oldPrice > o.price && (
                    <div className="text-[10px] text-muted-foreground line-through">{(o.oldPrice / 1000).toFixed(0)}k</div>
                  )}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">📦 Livré gratuitement à Ouaga & Niamey · Cash à réception</div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
            <span>✅ 100% plantes africaines</span>
            <span>✅ Sans effets secondaires</span>
            <span>✅ Tu paies seulement à la livraison</span>
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

      {/* PREUVE SOCIALE LIVE — vraies stats BDD */}
      

      {/* UN SEUL PRODUIT — 5 PATHOLOGIES */}
      <section className="sec bg-vert-bg/40">
        <div className="container-kouka">
          <h2 className="text-center mb-2">UN seul produit · <span className="text-vert">5 pathologies digestives</span></h2>
          <p className="text-center text-muted-foreground mb-7 max-w-lg mx-auto">
            La Poudre du Vieux KOUKA agit sur tout le système digestif. Une formule unique, plusieurs maux soulagés.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { i: '🩸', t: 'Hémorroïdes', d: 'Saignements, douleurs, koko' },
              { i: '🔥', t: 'Ulcères', d: 'Brûlures d\'estomac, gastrite' },
              { i: '💨', t: 'Ballonnements', d: 'Ventre gonflé, lourd' },
              { i: '🌀', t: 'Gaz dans le ventre (colopathie)', d: 'Côlon irritable, transit' },
              { i: '😤', t: 'Gaz chroniques', d: 'Fermentations, pets' },
            ].map((x) => (
              <div key={x.t} className="bg-white border-2 border-vert-bg rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{x.i}</div>
                <div className="font-extrabold text-vert text-sm">{x.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-6">Tu vis ça <span className="text-rouge">tous les jours</span> ?</h2>

          <div className="bloc bloc-r">
            <p className="text-rouge font-extrabold mb-3 text-lg">Coche ce que tu vis en ce moment :</p>
            <ul className="ckl ckl-r">
              <li>Aller aux toilettes = torture. Tu saignes. Tu serres les dents. Tu repousses</li>
              <li>Après chaque repas, ton estomac brûle comme du feu — l'ulcère te ronge de l'intérieur</li>
              <li>Ton ventre gonfle, tu lâches des gaz toute la journée — la honte au bureau, en famille</li>
              <li>Le rectum sort et tu dois le remettre à la main — tu n'oses en parler à personne</li>
              <li>Diarrhée le matin, constipation le soir — ton côlon te trahit sans prévenir</li>
              <li>Tu as dépensé des dizaines de milliers en médicaments — ça calme 3 jours, puis ça revient</li>
              <li>Tu commences à avoir peur que ça empire — opération, perforation, hospitalisation…</li>
            </ul>
          </div>

          <div className="bloc bloc-or mt-5">
            <p className="text-[oklch(0.40_0.10_82)] font-extrabold mb-3">⚠️ Ce qui t'attend si tu ne fais rien :</p>
            <ul className="ckl">
              <li>Hémorroïdes → thrombose → opération chirurgicale (coût : 200 000 à 500 000 FCFA)</li>
              <li>Ulcère non traité → perforation → urgence vitale aux urgences</li>
              <li>Colopathie chronique → carences, fatigue extrême, dépression digestive</li>
              <li>Plus tu attends, plus le traitement devient long et difficile</li>
              <li>Personne ne guérit "tout seul" — ces maladies progressent, jamais elles ne reculent</li>
            </ul>
          </div>

          <p className="text-center italic mt-6 text-muted-foreground max-w-lg mx-auto">
            "Si les médicaments classiques fonctionnaient, tu serais déjà guéri. Le problème : ils calment la douleur sans toucher la cause. La Poudre KOUKA fait l'inverse."
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="sec bg-vert-bg">
        <div className="container-kouka">
          <h2 className="text-center mb-3">La solution : <span className="text-vert">{product.name}</span></h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Un savoir ancestral africain transmis de génération en génération. Trois plantes récoltées dans trois pays.
            Une formule unique qui ne calme pas — qui traite à la racine.
          </p>

          <div className="bloc bloc-or p-0 overflow-hidden">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA" className="w-full max-h-80 object-cover" />
            <div className="p-5">
              <h3 className="text-or mb-1">📖 Vieux KOUKA</h3>
              <p className="text-xs text-muted-foreground font-semibold mb-1">
                Thérapeute traditionnel · +60 ans de pratique
              </p>
              <p className="text-sm text-vert font-bold mb-3">
                📍 Région des Kuilsés · Burkina Faso 🇧🇫
              </p>
              <p className="italic text-muted-foreground leading-relaxed">
                "Kouka est un guérisseur traditionnel de la région des Kuilsés, héritier d'un savoir transmis par
                son grand-père il y a plus de 60 ans. Sa formule est le fruit de
                <strong className="not-italic"> trois plantes récoltées manuellement dans trois pays différents</strong>
                — chacune choisie pour une action précise sur le système digestif."
              </p>
            </div>
          </div>

          <div className="bloc mt-5">
            <h3 className="text-vert mb-3">🌍 Plantes récoltées dans 3 pays africains</h3>
            <div className="flex flex-wrap gap-2">
              {['🇧🇫 Burkina Faso', '🇧🇯 Bénin', '🇬🇭 Ghana'].map((t) => (
                <span key={t} className="bg-vert-bg border-2 border-[oklch(0.80_0.10_145)] text-vert px-3.5 py-1.5 rounded-full font-bold text-sm">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ✈️ <strong>Déjà livré à</strong> Ouagadougou, Bobo, Koudougou, Banfora, Ouahigouya, Kaya, Tenkodogo, Fada, Dédougou, Houndé…
            </p>
          </div>

          <div className="bloc mt-4">
            <h3 className="text-vert mb-3">Ce que la poudre fait concrètement</h3>
            <ul className="ckl">
              <li><strong>Élimine l'inflammation hémorroïdale</strong> — les saignements stoppent, la douleur disparaît</li>
              <li><strong>Répare la muqueuse gastrique</strong> — les ulcères se referment naturellement</li>
              <li><strong>Nettoie l'intestin en profondeur</strong> — élimine les fermentations et les gaz chroniques</li>
              <li><strong>Régule le transit</strong> — colopathie et constipation disparaissent progressivement</li>
              <li><strong>Apaise les ballonnements</strong> — le ventre se dégonfle, les gaz s'évacuent normalement</li>
              <li><strong>Renforce la paroi intestinale</strong> — le rectum reprend sa position normale</li>
              <li><strong>Traite à la racine</strong> — pas de dépendance, pas de traitement à vie</li>
            </ul>
          </div>

          <div className="text-center mt-7">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🌿 Je veux la {product.shortName}
            </button>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ce qui se passe <span className="text-vert">semaine par semaine</span></h2>
          <p className="text-center text-muted-foreground mb-7">Les résultats que tu vas vivre avec le traitement complet</p>

          <div className="grid">
            {[
              { d: 'J 1', s: 'à J3', t: 'Premier soulagement', desc: "Les brûlures de l'ulcère diminuent. Les ballonnements s'apaisent. La zone hémorroïdale est moins enflammée." },
              { d: 'J 4', s: 'à J7', t: 'Saignements qui s\'arrêtent', desc: 'Les saignements stoppent. Le transit se régularise. Les gaz et fermentations disparaissent.' },
              { d: 'J 8', s: 'à J14', t: 'Guérison profonde', desc: "L'ulcère se referme. Les hémorroïdes se résorbent. Le rectum reprend sa position naturelle. Le côlon est apaisé." },
              { d: 'FIN', s: 'résultat', t: 'Totalement guéri', desc: '"Je suis totalement guéri" — comme nos clients te le disent. Pas de rechute.' },
            ].map((x, i) => (
              <div key={i} className={`flex gap-4 py-5 ${i < 3 ? 'border-b-2 border-vert-bg' : ''}`}>
                <div className={`shrink-0 w-[76px] text-center rounded-xl py-2.5 px-1.5 ${x.d === 'FIN' ? 'bg-[oklch(0.85_0.08_145)]' : 'bg-vert-mid'}`}>
                  <span className={`block text-2xl font-extrabold leading-none ${x.d === 'FIN' ? 'text-vert' : 'text-white'}`}>
                    {x.d}
                  </span>
                  <span className={`text-[10px] uppercase ${x.d === 'FIN' ? 'text-muted-foreground' : 'text-white/85'}`}>
                    {x.s}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-vert mb-1">{x.t}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{x.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bloc bloc-ok mt-5">
            <p><strong>Effets secondaires ?</strong> Zéro. Racines et écorces africaines 100% naturelles.</p>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ils ont essayé. <span className="text-vert">Ils sont guéris.</span></h2>
          <p className="text-center mb-1 font-semibold">Voici leurs mots — pas les nôtres.</p>
          <p className="text-center text-muted-foreground mb-7 text-sm">
            🔒 Messages WhatsApp réels · Audios non montés · Reçus de livraison vérifiables
          </p>

          <div className="grid gap-4">
            {[
              { txt: "Bonsoir, je viens te remercier vraiment. Maintenant suis totalement guéri, les ballonnements sont finis, je fais correctement les selles, le rectum aussi ne sort plus.", auth: 'Client WhatsApp · Traitement complet' },
              { txt: "Ton produit est vraiment efficace, j'ai suivi le traitement complet. Actuellement je ne souffre plus. Je recommande vraiment ce produit. Je vais commander encore 🙏", auth: 'Client WhatsApp · Renouvellement' },
              { txt: "Je prenais plusieurs médicaments, mais depuis ce traitement naturel, ma santé s'est améliorée et je me sens plus en forme.", auth: 'Client WhatsApp' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-2 border-vert-bg shadow-sm">
                <div className="text-or-light text-lg mb-2">★★★★★</div>
                <p className="italic text-muted-foreground leading-relaxed mb-3">"{t.txt}"</p>
                <div className="text-xs text-muted-foreground font-bold">{t.auth}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground font-bold my-6">
            📱 Vrais messages WhatsApp de nos clients — non modifiés
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <img key={n} loading="lazy" src={`/images/temo-wa${n}.webp`} alt={`Témoignage WhatsApp ${n}`} className="rounded-xl border-2 border-vert-bg w-full" />
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground font-bold mt-7 mb-3">
            🎙️ Messages audio originaux de nos clients
          </p>
          <div className="grid gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 border-2 border-vert-bg shadow-sm">
                <div className="font-bold text-vert mb-2">Témoignage audio {n}</div>
                <audio controls preload="none" className="w-full">
                  <source src={`/audio/temoignage${n}.opus`} type="audio/ogg; codecs=opus" />
                </audio>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground font-bold mt-7 mb-3">
            📦 Preuves de livraison
          </p>
          <div className="grid grid-cols-2 gap-3">
            <img loading="lazy" src="/images/preuve4.jpg" alt="Reçu Rakieta" className="rounded-xl border-2 border-vert-bg" />
            <img loading="lazy" src="/images/preuve5.jpg" alt="Reçu TSR" className="rounded-xl border-2 border-vert-bg" />
          </div>

          <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-5 text-center mt-7">
            <p className="font-bold mb-1">💵 Paiement uniquement à la livraison</p>
            <p className="text-sm">Tu ne paies <strong>RIEN à l'avance</strong>. Le livreur passe chez toi, tu vérifies le produit, et tu paies <strong>cash à la réception</strong>. Aucun risque, aucune carte, aucun acompte.</p>
          </div>
        </div>
      </section>

      {/* AVANT / APRÈS visuel */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Avant KOUKA <span className="text-rouge">vs</span> Après KOUKA</h2>
          <p className="text-center text-muted-foreground mb-7 text-sm">Le changement concret en 14 jours</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-rouge/40 rounded-2xl p-4">
              <div className="text-center bg-rouge text-white font-extrabold py-2 rounded-lg mb-3 text-sm">😣 AVANT</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🩸 Saignements aux toilettes</li>
                <li>🔥 Brûlures d'estomac chaque repas</li>
                <li>💨 Ventre gonflé toute la journée</li>
                <li>😰 Honte au bureau, en famille</li>
                <li>💸 Médicaments à vie qui calment 3 jours</li>
                <li>😴 Fatigue, irritabilité</li>
              </ul>
            </div>
            <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-4">
              <div className="text-center bg-vert-mid text-white font-extrabold py-2 rounded-lg mb-3 text-sm">😊 APRÈS</div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>✅ Selles normales, sans douleur</li>
                <li>✅ Estomac apaisé, plus de brûlures</li>
                <li>✅ Ventre plat, transit régulier</li>
                <li>✅ Confiance retrouvée</li>
                <li>✅ Une seule cure de 14 jours · 20 000 F</li>
                <li>✅ Énergie, sommeil, bonne humeur</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="sec bg-vert-bg/30">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Pourquoi KOUKA <span className="text-vert">plutôt qu'autre chose</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Compare honnêtement avec les solutions classiques. Le choix devient évident.
          </p>
          <ComparisonTable
            rows={[
              { label: 'Coût total', kouka: '20 000 F', meds: '15 000 F/mois à vie', surgery: '200–500 000 F' },
              { label: 'Traite la cause', kouka: '✅ Oui', meds: '❌ Calme', surgery: '⚠️ Parfois' },
              { label: 'Effets secondaires', kouka: '✅ Aucun', meds: '⚠️ Foie / reins', surgery: '⚠️ Risques' },
              { label: 'Rechute', kouka: '✅ Aucune', meds: '❌ Garantie', surgery: '⚠️ Possible' },
              { label: 'Hospitalisation', kouka: '✅ Aucune', meds: 'Aucune', surgery: '❌ 3–7 jours' },
              { label: 'Discrétion', kouka: '✅ 100%', meds: 'Pharmacie', surgery: '❌ Hôpital' },
              { label: 'Paiement', kouka: '✅ À la livraison', meds: '❌ D\'avance', surgery: '❌ D\'avance' },
            ]}
            productLabel="🌿 KOUKA"
          />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🌿 Je choisis la solution naturelle
            </button>
          </div>
        </div>
      </section>

      {/* FAQ — avant le formulaire pour lever les objections */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Tes questions</h2>
          <p className="text-center text-muted-foreground mb-4">Les vraies réponses sans détours</p>
          <FAQ />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🌿 OK, je commande maintenant
            </button>
          </div>
        </div>
      </section>

      <DiagnosticQuiz
        title="Quels symptômes ressentez-vous ?"
        questions={[
          'Ulcère / brûlures d\'estomac',
          'Colopathie / ballonnements',
          'Hémorroïdes (koko)',
          'Constipation chronique',
        ]}
      />

      <OfferComparisonTable product={product} />

      <RecommendedCureSection product={product} />

      <ReassuranceBar />

      <ProductForm product={product} />

      <FloatingOrderCTA />

      {/* DÉCOUVRE LES AUTRES PRODUITS DU VIEUX KOUKA */}
      <section className="sec bg-vert-bg/40">
        <div className="container-kouka">
          <h2 className="text-center mb-2">🌿 Découvre <span className="text-vert">toute la gamme du Vieux</span></h2>
          <p className="text-center text-muted-foreground mb-7 max-w-lg mx-auto text-sm">
            3 autres formules traditionnelles pour d'autres maux — toutes signées du Vieux KOUKA.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              to="/tonic-kouka"
              className="bg-white border-2 border-or rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform shadow-md"
            >
              <div className="text-4xl mb-2">🌿</div>
              <div className="font-extrabold text-vert text-base mb-1">Tonic du Vieux KOUKA</div>
              <div className="text-xs text-muted-foreground mb-2">12 maux · 1 flacon</div>
              <div className="text-xs font-bold text-rouge">À partir de 8 000 F →</div>
            </Link>
            <Link
              to="/product/$slug"
              params={{ slug: 'sirop-kouka' }}
              className="bg-white border-2 border-vert-bg rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform shadow-md"
            >
              <div className="text-4xl mb-2">🍯</div>
              <div className="font-extrabold text-vert text-base mb-1">Sirop KOUKA</div>
              <div className="text-xs text-muted-foreground mb-2">Faiblesse sexuelle · Libido</div>
              <div className="text-xs font-bold text-rouge">À partir de 12 000 F →</div>
            </Link>
            <Link
              to="/anti-diabete"
              className="bg-white border-2 border-vert-bg rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform shadow-md"
            >
              <div className="text-4xl mb-2">🩸</div>
              <div className="font-extrabold text-vert text-base mb-1">Anti-Diabète</div>
              <div className="text-xs text-muted-foreground mb-2">Glycémie · Fatigue · Vision</div>
              <div className="text-xs font-bold text-rouge">À partir de 12 500 F →</div>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-vert text-white text-center py-8 text-sm">
        <div className="container-kouka">
          <div className="font-extrabold mb-2">🌿 KOUKA Thérapies</div>
          <p className="opacity-80 mb-4">Savoir ancestral · Burkina Faso · Afrique de l'Ouest</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/tonic-kouka" className="text-white/80 hover:text-white">🌿 Tonic du Vieux KOUKA</Link>
            <span className="text-white/30">·</span>
            <Link to="/anti-diabete" className="text-white/80 hover:text-white">🩸 Poudre Anti-Diabète</Link>
            <span className="text-white/30">·</span>
            <Link to="/product/$slug" params={{ slug: 'sirop-kouka' }} className="text-white/80 hover:text-white">🍯 Sirop KOUKA</Link>
            <span className="text-white/30">·</span>
            <Link to="/diagnostic" className="text-white/70 hover:text-white">Diagnostic gratuit</Link>
            <span className="text-white/30">·</span>
            <Link to="/admin" className="text-white/60 hover:text-white">Espace admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
