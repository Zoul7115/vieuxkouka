import { createFileRoute, Link } from '@tanstack/react-router';
import { KOUKA, ADMIN_WHATSAPP } from '@/lib/products';
import { VisitTracker } from '@/components/VisitTracker';
import { ProductForm } from '@/components/ProductForm';

import { FAQ, FAQ_DATA } from '@/components/FAQ';
import { ComparisonTable } from '@/components/ComparisonTable';
import { OfferComparisonTable } from '@/components/conversion/OfferComparisonTable';
import { ReassuranceBar } from '@/components/conversion/ReassuranceBar';
import { StickyOfferBarRecommended } from '@/components/StickyOfferBarRecommended';

import { useAssignedCloseuse } from '@/lib/assignedCloseuseContext';
import koukaPrep1 from '@/assets/kouka-preparation-1.jpeg.asset.json';
import koukaPrep2 from '@/assets/kouka-preparation-2.jpeg.asset.json';

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
function scrollToKouka() {
  document.getElementById('vieux-kouka')?.scrollIntoView({ behavior: 'smooth' });
}

export function HomePage() {
  const product = KOUKA;
  const assigned = useAssignedCloseuse();
  const waNumber = (assigned?.whatsapp && assigned.whatsapp.replace(/\D/g, '')) || ADMIN_WHATSAPP;
  const WA_LINK = `https://wa.me/${waNumber}`;

  // FAQ réduite à 4 questions essentielles
  const FAQ_4 = [
    FAQ_DATA[0],
    FAQ_DATA[1],
    {
      q: 'Je dois payer d\'avance ?',
      a: "Non. Le livreur passe chez toi, tu vérifies le produit, et tu paies cash à la réception. Aucune carte, aucun acompte, aucun risque. Si tu n'es pas là au moment de la livraison, on te rappelle pour fixer un nouveau rendez-vous.",
    },
    {
      q: 'Et si ça ne marche pas — je suis vraiment remboursé ?',
      a: `Oui. La garantie "Satisfait ou Remboursé" est inscrite sur le sachet. Si après la cure complète tu ne vois aucune amélioration, <a href="${WA_LINK}" target="_blank" rel="noreferrer" class="text-vert font-bold underline">contactez-nous sur WhatsApp</a> et nous traitons ton remboursement.`,
    },
  ];



  return (
    <div className="bg-background pb-16 md:pb-0">
      <StickyOfferBarRecommended product={product} stock={999} unitLabel="sachets" />
      <VisitTracker page="home" />

      {/* 1. BANDEAU STICKY */}
      <div className="bg-vert text-white text-center py-2.5 px-3 text-[13px] sm:text-sm font-bold sticky top-0 z-50 shadow">
        🌿 +200 guéris · Livraison Ouaga &amp; Niamey demain matin · ⏰ Stock limité — commandez avant 17h
      </div>

      {/* 2. HERO */}
      <section className="bg-gradient-to-b from-vert-bg to-background pt-8 pb-10 border-b-[3px] border-[oklch(0.85_0.06_145)]">
        <div className="container-kouka text-center">
          <span className="inline-block bg-vert-mid text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
            ⭐ +200 familles soulagées au Burkina &amp; Niger · 87% soulagés dès J3
          </span>

          <h1 className="text-vert mb-4 font-black leading-[0.95] tracking-tight max-w-md md:max-w-2xl mx-auto">
            <span className="block text-[34px] sm:text-[46px] md:text-[58px]">Tu souffres depuis des mois…</span>
            <span className="block text-[26px] sm:text-[36px] md:text-[46px] text-rouge mt-3">
              Voici pourquoi le Vieux Kouka guérit là où les médicaments ont échoué.
            </span>
          </h1>

          <p className="text-foreground max-w-lg mx-auto mb-5 text-base sm:text-lg leading-relaxed font-semibold">
            Hémorroïdes (koko) · Ulcères · Brûlures d'estomac · Gaz · Colopathie<br/>
            <span className="text-vert">Une seule poudre. Une vraie guérison. Payée uniquement à la livraison.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mb-6">
            {['Hémorroïdes', 'Ulcère', 'Gaz / Ballonnements', 'Brûlures', 'Colopathie'].map((t) => (
              <span key={t} className="bg-white border-2 border-vert-bg rounded-full px-3 py-1 text-sm font-bold text-foreground">✅ {t}</span>
            ))}
          </div>

          <button
            onClick={scrollToKouka}
            className="w-full sm:w-auto sm:px-10 bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            👇 Voir comment ça marche
          </button>
        </div>
      </section>

      {/* 3. TU VIS ÇA TOUS LES JOURS ? */}
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

      {/* 4. QUI EST LE VIEUX KOUKA */}
      <section id="vieux-kouka" className="sec bg-white scroll-mt-20">
        <div className="container-kouka">
          <h2 className="text-center mb-2">QUI EST LE <span className="text-vert">VIEUX KOUKA</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-xl mx-auto">
            Plus de 60 ans d'expérience dans les recettes traditionnelles africaines.
          </p>

          <div className="max-w-3xl mx-auto bg-vert-bg/40 border-2 border-vert-bg rounded-3xl overflow-hidden shadow-md">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux Kouka" className="w-full max-h-72 object-cover" />
            <div className="p-5 sm:p-6">
              <div className="text-sm font-bold text-vert mb-2">📍 Région des Kuilsés · Burkina Faso 🇧🇫</div>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Le <strong>Vieux Kouka</strong> est un thérapeute traditionnel héritier d'un savoir-faire familial transmis
                de génération en génération depuis <strong>plus de 60 ans</strong>. Sa recette est le fruit d'un héritage
                ancestral et d'une connaissance profonde des plantes africaines.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-4">
                {[
                  { i: '👴', t: "+60 ans d'expérience" },
                  { i: '🌿', t: 'Plantes africaines' },
                  { i: '📖', t: 'Recette familiale' },
                  { i: '🤝', t: 'Savoir-faire transmis' },
                ].map((x) => (
                  <div key={x.t} className="bg-white border-2 border-vert-bg rounded-xl p-2">
                    <div className="text-xl">{x.i}</div>
                    <div className="text-[11px] sm:text-xs font-bold text-vert leading-tight mt-1">{x.t}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-vert-bg rounded-xl p-3 text-sm text-foreground/90 leading-relaxed">
                ✈️ Déjà livré à <strong>Ouagadougou, Bobo, Koudougou, Banfora, Niamey, Agadez</strong> et partout au Burkina Faso et Niger.<br/>
                <strong>Paiement uniquement à la réception — aucun risque.</strong>
              </div>
              <div className="text-center mt-5">
                <button onClick={scrollToOrder} className="bg-rouge text-white px-6 py-3 rounded-xl font-extrabold shadow-md">
                  🛒 Je commande maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUIT */}
      <section className="sec bg-white">
        <div className="container-kouka text-center">
          <h2 className="text-vert mb-3">POUDRE DU VIEUX KOUKA</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-base leading-relaxed">
            La recette traditionnelle du Vieux Kouka utilisée pour <strong className="text-foreground">traiter efficacement les hémorroïdes, les ulcères gastriques, les brûlures d'estomac, la colopathie et les ballonnements</strong>.
          </p>
          <div className="w-full max-w-[500px] mx-auto mb-5 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(46,125,50,0.30)] border-[3px] border-vert-bg">
            <img src={product.heroImage} alt="Poudre du Vieux KOUKA — sachet" className="w-full block" />
          </div>


          <div>
            <a href="#formulaire" className="inline-block text-vert text-sm font-bold underline underline-offset-4 hover:text-vert-mid">
              → Commander et payer à la livraison
            </a>
          </div>
        </div>
      </section>

      {/* 6. COMMENT CONSOMMER */}
      <section className="sec bg-vert-bg">
        <div className="container-kouka">
          <h2 className="text-center mb-6">Comment consommer la <span className="text-vert">Poudre du Vieux Kouka</span> ?</h2>

          <div className="max-w-xl mx-auto bg-white border-2 border-vert-mid rounded-3xl p-7 shadow-[0_10px_30px_rgba(46,125,50,0.18)] text-center mb-6">
            <div className="text-5xl mb-3">🍵</div>
            <p className="text-lg sm:text-xl font-extrabold text-foreground leading-relaxed mb-3">
              1 cuillère à café dans l'eau tiède ou le Lipton — <span className="text-vert">matin et soir</span>.
            </p>
            <p className="text-base text-foreground/80">Peut aussi se sucer directement si tu n'as pas de boisson.</p>
          </div>

          <ul className="max-w-xl mx-auto grid gap-2 mb-7 text-sm sm:text-base text-foreground">
            {[
              'Goût légèrement amer — c\'est le signe que les plantes actives sont présentes',
              'Peut se mélanger à ta boisson habituelle du matin',
              'Déconseillé aux enfants de moins de 12 ans et aux femmes enceintes',
              'Conserver au sec, hors de portée des enfants',
            ].map((t) => (
              <li key={t} className="bg-white border border-vert-bg rounded-xl px-4 py-2.5 font-semibold">✅ {t}</li>
            ))}
          </ul>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <figure>
              <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <img src={koukaPrep1.url} alt="Sachets de Poudre du Vieux Kouka" loading="lazy" className="w-full h-auto" />
              </div>
              <figcaption className="mt-3 text-center">
                <div className="text-vert font-extrabold text-sm">PRÉPARATION TRADITIONNELLE</div>
                <p className="text-foreground/80 text-sm mt-1">Mélangez une cuillérée à café dans de l'eau tiède ou du Lipton matin et soir.</p>
              </figcaption>
            </figure>
            <figure>
              <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <img src={koukaPrep2.url} alt="Sachet de Poudre du Vieux Kouka et préparation" loading="lazy" className="w-full h-auto" />
              </div>
              <figcaption className="mt-3 text-center">
                <div className="text-vert font-extrabold text-sm">CONSOMMATION QUOTIDIENNE</div>
                <p className="text-foreground/80 text-sm mt-1">Une utilisation simple pour profiter pleinement des bienfaits du Vieux Kouka.</p>
              </figcaption>
            </figure>
          </div>

          <div className="text-center mt-7">
            <a href="#resultats" className="inline-block bg-rouge text-white px-7 py-3.5 rounded-xl text-base font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] no-underline">
              📋 Voir les résultats semaine après semaine ↓
            </a>
          </div>
        </div>
      </section>

      {/* 7. TIMELINE + AVANT/APRÈS FUSIONNÉS */}
      <section id="resultats" className="sec bg-cream-2 scroll-mt-20">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ce que nos clients <span className="text-vert">constatent jour après jour</span></h2>
          <p className="text-center text-muted-foreground mb-7">De J1 à la guérison complète</p>

          <div className="grid max-w-2xl mx-auto">
            {[
              { d: 'J 1', s: 'à J3', t: 'Premier soulagement', desc: "Les brûlures de l'ulcère diminuent. Les ballonnements s'apaisent. La zone hémorroïdale est moins enflammée." },
              { d: 'J 4', s: 'à J7', t: "Saignements qui s'arrêtent", desc: 'Les saignements stoppent. Le transit se régularise. Les gaz et fermentations disparaissent.' },
              { d: 'J 8', s: 'à J14', t: 'Guérison profonde', desc: "L'ulcère se referme. Les hémorroïdes se résorbent. Le rectum reprend sa position naturelle." },
              { d: 'FIN', s: 'résultat', t: 'Totalement guéri', desc: '"Je suis totalement guéri" — comme nos clients te le disent. Pas de rechute.' },
            ].map((x, i) => (
              <div key={i} className={`flex gap-4 py-5 ${i < 3 ? 'border-b-2 border-vert-bg' : ''}`}>
                <div className={`shrink-0 w-[76px] text-center rounded-xl py-2.5 px-1.5 ${x.d === 'FIN' ? 'bg-[oklch(0.85_0.08_145)]' : 'bg-vert-mid'}`}>
                  <span className={`block text-2xl font-extrabold leading-none ${x.d === 'FIN' ? 'text-vert' : 'text-white'}`}>{x.d}</span>
                  <span className={`text-[10px] uppercase ${x.d === 'FIN' ? 'text-muted-foreground' : 'text-white/85'}`}>{x.s}</span>
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-vert mb-1">{x.t}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{x.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AVANT / APRÈS */}
          <h3 className="text-center mt-10 mb-5 text-xl font-extrabold">Avant KOUKA <span className="text-rouge">vs</span> Après KOUKA</h3>
          <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto">
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

          <div className="bloc bloc-ok mt-7 max-w-2xl mx-auto">
            <p>
              <strong>Effets secondaires ? Zéro.</strong> Racines et écorces africaines 100% naturelles.
              Pas de dépendance. Tu arrêtes quand tu es guéri.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TÉMOIGNAGES WHATSAPP */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ils ont essayé. <span className="text-vert">Ils sont guéris.</span></h2>
          <p className="text-center mb-1 font-semibold">Voici leurs mots — pas les nôtres.</p>
          <p className="text-center text-muted-foreground mb-7 text-sm">
            🔒 Messages WhatsApp réels · Audios non montés · Reçus de livraison vérifiables
          </p>

          <div className="grid gap-4">
            {[
              { txt: "Bonsoir, je viens te remercier vraiment. Maintenant suis totalement guéri, les ballonnements sont finis, je fais correctement les selles, le rectum aussi ne sort plus.", auth: 'Moussa K., Ouagadougou · Traitement complet' },
              { txt: "Ton produit est vraiment efficace, j'ai suivi le traitement complet. Actuellement je ne souffre plus. Je recommande vraiment ce produit. Je vais commander encore 🙏", auth: 'Ibrahim S., Niamey · Renouvellement' },
              { txt: "Je prenais plusieurs médicaments, mais depuis ce traitement naturel, ma santé s'est améliorée et je me sens plus en forme.", auth: 'Fatoumata O., Bobo-Dioulasso' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-2 border-vert-bg shadow-sm">
                <div className="text-or-light text-lg mb-2">★★★★★</div>
                <p className="italic text-muted-foreground leading-relaxed mb-3">"{t.txt}"</p>
                <div className="text-xs text-muted-foreground font-bold">{t.auth}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground font-bold my-6">
            🔒 Vrais messages de nos clients — non modifiés, non montés
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
            <p className="text-sm">Tu ne paies <strong>RIEN à l'avance</strong>. Le livreur passe chez toi, tu vérifies le produit, et tu paies <strong>cash à la réception</strong>.</p>
          </div>
        </div>
      </section>

      {/* 9. COMPARATIF */}
      <section className="sec bg-vert-bg/30">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Pourquoi <span className="text-vert">de nombreuses familles choisissent le Vieux Kouka</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Compare honnêtement avec les solutions classiques. Le choix devient évident.
          </p>

          {/* Tableau desktop */}
          <div className="hidden sm:block">
            <ComparisonTable
              rows={[
                { label: 'Coût total', kouka: '20 000 F', meds: '15 000 F/mois à vie', surgery: '200–500 000 F' },
                { label: 'Traite la cause', kouka: '✅ Oui', meds: '❌ Calme', surgery: '⚠️ Parfois' },
                { label: 'Effets secondaires', kouka: '✅ Aucun', meds: '⚠️ Foie / reins', surgery: '⚠️ Risques' },
                { label: 'Rechute', kouka: '✅ Aucune', meds: '❌ Garantie', surgery: '⚠️ Possible' },
                { label: 'Hospitalisation', kouka: '✅ Aucune', meds: 'Aucune', surgery: '❌ 3–7 jours' },
                { label: 'Discrétion', kouka: '✅ 100%', meds: 'Pharmacie', surgery: '❌ Hôpital' },
                { label: 'Paiement', kouka: '✅ À la livraison', meds: "❌ D'avance", surgery: "❌ D'avance" },
              ]}
              productLabel="🌿 KOUKA"
            />
          </div>

          {/* Version mobile */}
          <div className="sm:hidden max-w-md mx-auto">
            <p className="font-extrabold text-vert text-center text-base mb-4">Pourquoi les familles choisissent KOUKA :</p>
            <ul className="space-y-2.5">
              {[
                <><strong>20 000 F une seule fois</strong> — contre 15 000 F/mois à vie pour les médicaments</>,
                <><strong>Traite la cause</strong> — les médicaments calment seulement la douleur</>,
                <><strong>Zéro effet secondaire</strong> — les médicaments abîment le foie et les reins</>,
                <><strong>Paiement à la réception</strong> — pas d'avance, pas de risque</>,
                <><strong>Discret</strong> — livraison à domicile, personne ne sait</>,
                <><strong>Pas d'hospitalisation</strong> — évite une opération à 200 000–500 000 FCFA</>,
              ].map((node, i) => (
                <li key={i} className="bg-white border-2 border-vert-bg rounded-xl px-4 py-3 text-sm leading-relaxed">
                  ✅ {node}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)]">
              🌿 Je choisis la solution naturelle
            </button>
          </div>
        </div>
      </section>

      {/* 10. FAQ — 4 questions */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Les réponses aux <span className="text-vert">questions essentielles</span></h2>
          <p className="text-center text-muted-foreground mb-4">Les vraies réponses sans détours</p>
          <FAQ items={FAQ_4} />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)]">
              🌿 OK, je commande maintenant
            </button>
          </div>
        </div>
      </section>

      {/* 11. L'ERREUR QUE FONT LA PLUPART DES CLIENTS */}
      <section className="sec bg-foreground text-white">
        <div className="container-kouka max-w-2xl">
          <div className="text-center mb-5">
            <div className="text-5xl mb-2">⚠️</div>
            <h2 className="text-white">L'erreur que font la plupart des clients</h2>
          </div>
          <div className="bg-white/5 border-2 border-[oklch(0.75_0.15_60)] rounded-2xl p-5 leading-relaxed">
            <p className="mb-3">
              Beaucoup commandent <strong className="text-[oklch(0.85_0.15_60)]">une petite quantité pour tester</strong>.
              Résultat : ils ressentent un soulagement, mais la cure est incomplète — le mal revient quelques semaines plus tard.
            </p>
            <p className="mb-0">
              👉 La <strong>cure complète (3 sachets)</strong> est ce qui garantit une vraie guérison, sans rechute.
              C'est ce que choisissent <strong>8 clients sur 10</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 12. PACKS */}
      <OfferComparisonTable product={product} />

      <ReassuranceBar />

      {/* Livraison discrète Burkina + Niger */}
      <section className="sec py-8 bg-white">
        <div className="container-kouka max-w-lg">
          <div className="bg-white border-2 border-vert-bg rounded-2xl p-5">
            <h3 className="text-vert text-center mb-3">🚚 Livraison 100% discrète</h3>
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
              💵 Paiement cash à la livraison · 📦 Colis neutre, sans logo
            </p>
          </div>
        </div>
      </section>

      {/* VALUE STACK — Tout est inclus */}
      <section className="sec bg-gradient-to-b from-white to-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">🎁 Ce que tu reçois</span>
            <h2 className="text-vert mt-2">Tout est inclus dans ta cure complète</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-vert-bg">
            <ul className="divide-y divide-vert-bg">
              {[
                { t: '3 sachets de Poudre du Vieux Kouka', v: '25 000 F' },
                { t: 'Posologie personnalisée par WhatsApp', v: 'Offert' },
                { t: 'Suivi pendant toute la cure', v: 'Offert' },
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
              <span className="font-extrabold text-foreground">Total à payer</span>
              <span className="text-3xl font-extrabold text-vert">25 000 F</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT SE PASSE LA COMMANDE */}
      <section className="sec bg-white">
        <div className="container-kouka max-w-3xl px-4">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">📦 Processus simple</span>
            <h2 className="text-vert mt-2 text-xl md:text-2xl font-extrabold uppercase">
              Comment se passe la commande ?
            </h2>
          </div>
          <ol className="grid gap-3 md:gap-4">
            {[
              { n: '1', t: 'Remplis le formulaire', d: 'Nom, numéro, ville — 30 secondes' },
              { n: '2', t: 'On t\'appelle', d: 'Un conseiller te contacte sous 2h' },
              { n: '3', t: 'On confirme ta commande', d: 'Adresse et offre validées' },
              { n: '4', t: 'On expédie ton colis', d: 'Emballage discret et soigné' },
              { n: '5', t: 'Tu paies à la livraison', d: 'Cash, à la réception du colis' },
            ].map((s) => (
              <li key={s.n} className="flex items-start gap-3 bg-vert-bg/40 rounded-2xl p-3.5 md:p-4 border border-vert-bg">
                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-vert text-white font-extrabold flex items-center justify-center shadow">{s.n}</div>
                <div className="min-w-0">
                  <div className="font-extrabold text-vert text-sm md:text-base leading-tight">{s.t}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Transition avant le formulaire */}
      <section className="py-6 bg-gradient-to-b from-white to-vert-bg">
        <div className="container-kouka max-w-2xl px-4 text-center">
          <p className="text-vert text-lg md:text-xl font-extrabold leading-tight">
            ⏱️ Tu es à 2 minutes de commencer ta cure.
          </p>
          <p className="text-foreground text-sm md:text-base mt-2 leading-relaxed">
            Remplis tes infos — on te contacte sur <strong>WhatsApp sous 2h</strong> pour confirmer ta livraison.
          </p>
          <p className="text-rouge text-sm font-bold mt-2">💵 Tu ne paies rien maintenant.</p>
        </div>
      </section>

      {/* 13. FORMULAIRE */}
      <div id="formulaire" className="scroll-mt-20">
        <ProductForm product={product} />
      </div>

      {/* 14. BLOC RÉASSURANCE FINALE */}
      <section className="sec bg-vert-bg">
        <div className="container-kouka max-w-2xl">
          <div className="bg-white border-2 border-vert-mid rounded-2xl p-6 shadow-md">
            <h3 className="text-center text-vert mb-4">Tout est sécurisé pour toi</h3>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>✅ <strong>Paiement à la livraison</strong> — tu ne paies rien avant de recevoir</li>
              <li>✅ <strong>Livraison rapide</strong> — Ouaga &amp; Niamey : lendemain matin si commande avant 17h</li>
              <li>✅ <strong>Autres villes</strong> du Burkina et du Niger : 24 à 48h</li>
              <li>✅ <strong>Satisfait ou remboursé</strong> — garantie inscrite sur le sachet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AUTRES PRODUITS */}
      <section className="sec bg-vert-bg/40">
        <div className="container-kouka">
          <h2 className="text-center mb-2">🌿 Découvre <span className="text-vert">toute la gamme du Vieux</span></h2>
          <p className="text-center text-muted-foreground mb-7 max-w-lg mx-auto text-sm">
            3 autres formules traditionnelles pour d'autres maux — toutes signées du Vieux KOUKA.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link to="/tonic-kouka" className="bg-white border-2 border-or rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform shadow-md">
              <div className="text-4xl mb-2">🌿</div>
              <div className="font-extrabold text-vert text-base mb-1">Tonic du Vieux KOUKA</div>
              <div className="text-xs text-muted-foreground mb-2">12 maux · 1 flacon</div>
              <div className="text-xs font-bold text-rouge">À partir de 8 000 F →</div>
            </Link>
            <Link to="/product/$slug" params={{ slug: 'sirop-kouka' }} className="bg-white border-2 border-vert-bg rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform shadow-md">
              <div className="text-4xl mb-2">🍯</div>
              <div className="font-extrabold text-vert text-base mb-1">Sirop KOUKA</div>
              <div className="text-xs text-muted-foreground mb-2">Faiblesse sexuelle · Libido</div>
              <div className="text-xs font-bold text-rouge">À partir de 12 000 F →</div>
            </Link>
            <Link to="/anti-diabete" className="bg-white border-2 border-vert-bg rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform shadow-md">
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
          <p className="opacity-80 mb-3">Savoir ancestral · Burkina Faso · Afrique de l'Ouest</p>
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
