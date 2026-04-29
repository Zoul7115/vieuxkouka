import { createFileRoute } from '@tanstack/react-router';
import { KOUKA } from '@/lib/products';
import { VisitTracker } from '@/components/VisitTracker';
import { ProductForm } from '@/components/ProductForm';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LiveSocialProof } from '@/components/LiveSocialProof';
import { MiniDiagnostic } from '@/components/MiniDiagnostic';
import { UrgencyTimer } from '@/components/UrgencyTimer';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AbandonRecovery } from '@/components/AbandonRecovery';

import { StoryHeader } from '@/components/story/StoryHeader';
import { StoryAnnouncement } from '@/components/story/StoryAnnouncement';
import { StoryHero } from '@/components/story/StoryHero';
import { StoryUSPBar } from '@/components/story/StoryUSPBar';
import { StoryFeaturedRow } from '@/components/story/StoryFeaturedRow';
import { StoryIconGrid } from '@/components/story/StoryIconGrid';
import { StoryReviews } from '@/components/story/StoryReviews';
import { StoryFAQ } from '@/components/story/StoryFAQ';
import { StoryGuarantee } from '@/components/story/StoryGuarantee';
import { StoryAtcSticky } from '@/components/story/StoryAtcSticky';
import { StoryFooter } from '@/components/story/StoryFooter';

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

function HomePage() {
  const product = KOUKA;

  return (
    <div className="bg-background pb-24 md:pb-20">
      <VisitTracker page="home" />
      <LiveSocialProof product="Poudre KOUKA" />
      <ExitIntentPopup productName="Poudre KOUKA" />
      <AbandonRecovery productName="Poudre KOUKA" />
      <StoryAtcSticky product={product} ctaLabel="Commander" tone="vert" />

      {/* HEADER */}
      <StoryAnnouncement />
      <StoryHeader brand="🌿 KOUKA Thérapies" />

      {/* HERO produit (galerie + infos + CTA) */}
      <StoryHero
        product={product}
        gallery={[
          product.heroImage,
          '/images/kouka-solution.png',
          '/images/kouka-banner-investissement.png',
          '/images/kouka-temoignages.webp',
          '/images/vieux-kouka.jpg',
        ]}
        rating={{ stars: 4.9, count: 217 }}
        subtitle="Hémorroïdes, ulcères, ballonnements, colopathie : la formule ancestrale du Vieux KOUKA traite la cause profonde — pas le symptôme. Soulagement dès J3, guérison en 7 à 14 jours. 100% plantes africaines."
        bullets={[
          '+200 personnes guéries au Burkina Faso',
          '87% soulagés dès le 3ᵉ jour',
          'Sans effets secondaires · Sans rechute',
          'Livraison gratuite Ouaga · Paiement à la livraison',
        ]}
        ctaLabel="⚡ Commander en 30 sec — Paie à la livraison"
      />

      {/* USP bar */}
      <StoryUSPBar />

      {/* 5 PATHOLOGIES */}
      <StoryIconGrid
        eyebrow="Une formule, plusieurs maux"
        title="UN seul produit · 5 pathologies digestives"
        subtitle="La Poudre du Vieux KOUKA agit sur tout le système digestif. Une formule unique, plusieurs maux soulagés."
        cols={5}
        bg="cream"
        items={[
          { icon: '🩸', title: 'Hémorroïdes', desc: 'Saignements, douleurs, koko' },
          { icon: '🔥', title: 'Ulcères', desc: "Brûlures d'estomac, gastrite" },
          { icon: '💨', title: 'Ballonnements', desc: 'Ventre gonflé, lourd' },
          { icon: '🌀', title: 'Colopathie', desc: 'Côlon irritable, transit' },
          { icon: '😤', title: 'Gaz chroniques', desc: 'Fermentations, pets' },
        ]}
      />

      {/* PROBLÈME — featured row */}
      <StoryFeaturedRow
        eyebrow="Tu vis ça tous les jours ?"
        title="Et si tu ne fais rien… ça s'aggrave."
        image="/images/kouka-solution.png"
        imageAlt="Personne souffrante"
        bg="white"
        reverse
      >
        <ul className="ckl ckl-r">
          <li>Aller aux toilettes = torture. Tu saignes. Tu serres les dents.</li>
          <li>Après chaque repas, ton estomac brûle comme du feu — l'ulcère te ronge.</li>
          <li>Ton ventre gonfle, tu lâches des gaz toute la journée — la honte au bureau, en famille.</li>
          <li>Le rectum sort et tu dois le remettre à la main — tu n'oses en parler à personne.</li>
          <li>Tu as dépensé des dizaines de milliers en médicaments — ça calme 3 jours, puis ça revient.</li>
        </ul>
        <p className="text-rouge font-bold mt-3">
          ⚠️ Hémorroïdes → thrombose → opération chirurgicale (200 000 à 500 000 FCFA). Plus tu attends, plus c'est grave.
        </p>
      </StoryFeaturedRow>

      {/* SOLUTION — featured row */}
      <StoryFeaturedRow
        eyebrow="La solution ancestrale"
        title="Le Vieux KOUKA — Maître guérisseur depuis 60 ans"
        image="/images/vieux-kouka.jpg"
        imageAlt="Le Vieux KOUKA, thérapeute traditionnel du Burkina Faso"
        bg="cream"
      >
        <p>
          <strong>Vieux KOUKA</strong> est un thérapeute traditionnel de la région des Kuilsés, héritier d'un savoir transmis par
          son grand-père il y a plus de 60 ans.
        </p>
        <p>
          Sa formule est le fruit de <strong>trois plantes récoltées manuellement dans trois pays différents</strong> —
          🇧🇫 Burkina Faso · 🇨🇮 Côte d'Ivoire · 🇧🇯 Bénin — chacune choisie pour une action précise sur le système digestif.
        </p>
        <ul className="ckl mt-3">
          <li>Élimine l'inflammation hémorroïdale</li>
          <li>Répare la muqueuse gastrique (ulcères)</li>
          <li>Nettoie l'intestin en profondeur</li>
          <li>Régule le transit · apaise les ballonnements</li>
          <li>Traite à la racine — pas de dépendance</li>
        </ul>
      </StoryFeaturedRow>

      {/* TIMELINE */}
      <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story py-14 md:py-16">
          <div className="text-center mb-10">
            <div className="story-eyebrow mb-2">Résultats jour après jour</div>
            <h2 className="story-h2 mb-2">Ce qui se passe semaine par semaine</h2>
            <p className="text-muted-foreground">Les résultats que tu vas vivre avec le traitement complet.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { d: 'J1-J3', t: 'Premier soulagement', desc: "Brûlures qui diminuent. Ballonnements qui s'apaisent. Zone hémorroïdale moins enflammée." },
              { d: 'J4-J7', t: "Saignements qui s'arrêtent", desc: 'Le transit se régularise. Les gaz et fermentations disparaissent.' },
              { d: 'J8-J14', t: 'Guérison profonde', desc: "L'ulcère se referme. Les hémorroïdes se résorbent. Le côlon est apaisé." },
              { d: 'FIN', t: 'Totalement guéri', desc: '"Je suis totalement guéri" — comme nos clients te le disent. Pas de rechute.' },
            ].map((x, i) => (
              <div key={i} className="story-card p-5 relative">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold mb-3 ${
                  x.d === 'FIN' ? 'bg-vert text-white' : 'bg-vert-bg text-vert'
                }`}>
                  {x.d}
                </div>
                <div className="font-extrabold text-foreground mb-1">{x.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="bg-cream-2 border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story py-14 md:py-16">
          <div className="text-center mb-8">
            <div className="story-eyebrow mb-2">Comparatif honnête</div>
            <h2 className="story-h2 mb-2">Pourquoi KOUKA plutôt qu'autre chose ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare avec les solutions classiques. Le choix devient évident.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ComparisonTable
              rows={[
                { label: 'Coût total', kouka: '20 000 F', meds: '15 000 F/mois à vie', surgery: '200–500 000 F' },
                { label: 'Traite la cause', kouka: '✅ Oui', meds: '❌ Calme', surgery: '⚠️ Parfois' },
                { label: 'Effets secondaires', kouka: '✅ Aucun', meds: '⚠️ Foie / reins', surgery: '⚠️ Risques' },
                { label: 'Rechute', kouka: '✅ Aucune', meds: '❌ Garantie', surgery: '⚠️ Possible' },
                { label: 'Discrétion', kouka: '✅ 100%', meds: 'Pharmacie', surgery: '❌ Hôpital' },
                { label: 'Garantie', kouka: '✅ Remboursé', meds: '❌ Non', surgery: '❌ Non' },
              ]}
              productLabel="🌿 KOUKA"
            />
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <StoryReviews
        rating={4.9}
        count={217}
        reviews={[
          {
            name: 'Client WhatsApp · Ouaga',
            stars: 5,
            title: 'Totalement guéri',
            text: "Je viens te remercier vraiment. Maintenant je suis totalement guéri, les ballonnements sont finis, je fais correctement les selles, le rectum aussi ne sort plus.",
          },
          {
            name: 'Client WhatsApp · Bobo',
            stars: 5,
            title: 'Je vais commander encore',
            text: "Ton produit est vraiment efficace, j'ai suivi le traitement complet. Actuellement je ne souffre plus. Je recommande vraiment ce produit. 🙏",
          },
          {
            name: 'Client WhatsApp · Koudougou',
            stars: 5,
            title: 'Ma santé s\'est améliorée',
            text: "Je prenais plusieurs médicaments, mais depuis ce traitement naturel, ma santé s'est améliorée et je me sens plus en forme.",
          },
        ]}
      />

      {/* PREUVES — galerie */}
      <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="story-eyebrow mb-2">Preuves réelles</div>
            <h2 className="story-h2 mb-2">📱 Messages WhatsApp & livraisons vérifiées</h2>
            <p className="text-muted-foreground">Captures non modifiées de nos clients.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <img
                key={n}
                loading="lazy"
                src={`/images/temo-wa${n}.webp`}
                alt={`Témoignage WhatsApp ${n}`}
                className="rounded-xl border border-[oklch(0.92_0.02_130)] w-full"
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="story-card p-5">
                <div className="font-extrabold text-vert mb-2">🎙️ Témoignage audio {n}</div>
                <audio controls preload="none" className="w-full">
                  <source src={`/audio/temoignage${n}.opus`} type="audio/ogg; codecs=opus" />
                </audio>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 max-w-xl mx-auto">
            <img loading="lazy" src="/images/preuve4.jpg" alt="Reçu Rakieta" className="rounded-xl border border-[oklch(0.92_0.02_130)]" />
            <img loading="lazy" src="/images/preuve5.jpg" alt="Reçu TSR" className="rounded-xl border border-[oklch(0.92_0.02_130)]" />
          </div>
        </div>
      </section>

      {/* GARANTIE */}
      <StoryGuarantee
        title='Garantie "Guéri ou Remboursé"'
        text="Tu suis le traitement complet sans aucun résultat ? On te rembourse 100% — sans question, sans débat. Tu n'as littéralement rien à perdre."
      />

      {/* MINI-DIAGNOSTIC */}
      <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story-narrow py-14 md:py-16">
          <div className="text-center mb-8">
            <div className="story-eyebrow mb-2">Conseil personnalisé</div>
            <h2 className="story-h2 mb-2">Quelle cure te convient ?</h2>
            <p className="text-muted-foreground">3 questions · réponse personnalisée en 30 secondes.</p>
          </div>
          <MiniDiagnostic
            questions={[
              { q: 'Depuis combien de temps tu souffres ?', options: ['Moins de 3 mois', 'Entre 3 mois et 1 an', "Plus d'1 an", 'Plus de 3 ans'] },
              { q: 'Combien de personnes dans ta famille ont aussi des soucis digestifs ?', options: ['Juste moi', '1 personne', '2-3 personnes', 'Plus de 3'] },
              { q: "Tu as déjà essayé d'autres traitements ?", options: ['Oui, beaucoup — sans résultat', 'Oui, un peu', 'Pas encore'] },
            ]}
            recommendation={(a) => {
              if (a[1] >= 2) return { offerHint: 'Cure FAMILIALE 3+2 (27 000 FCFA)', message: 'Plusieurs personnes concernées : prends le pack famille pour traiter tout le monde et économiser 23 000 FCFA.' };
              if (a[0] >= 2) return { offerHint: 'Traitement COMPLET 2+1 (20 000 FCFA)', message: 'Souffrance ancienne : il faut un traitement complet pour traiter à la racine.' };
              return { offerHint: 'Traitement COMPLET 2+1 (20 000 FCFA)', message: "L'offre la plus choisie : 1 sachet OFFERT, traitement complet garanti." };
            }}
          />
        </div>
      </section>

      {/* FAQ */}
      <StoryFAQ
        items={[
          {
            q: "Est-ce que je paie à la commande ou à la livraison ?",
            a: 'Tu paies UNIQUEMENT à la livraison, en cash, à notre livreur (Ouagadougou) ou à la gare de transport (hors Ouaga). Aucun paiement en ligne, aucun acompte.',
          },
          {
            q: 'Combien de temps pour la livraison ?',
            a: 'À Ouagadougou : 24h après confirmation WhatsApp. Hors Ouaga : 48h à 72h selon la compagnie de transport choisie.',
          },
          {
            q: 'Est-ce vraiment efficace ?',
            a: '+200 clients guéris au Burkina Faso. Soulagement observé dès J3 dans 87% des cas, guérison complète en 7 à 14 jours pour le traitement complet. Si tu n\'as aucun résultat, on te rembourse à 100%.',
          },
          {
            q: 'Y a-t-il des effets secondaires ?',
            a: 'Aucun. La poudre est composée de 3 plantes africaines 100% naturelles, récoltées à la main et sans produit chimique. Compatible avec la plupart des traitements en cours, mais demande conseil à ton médecin si grossesse ou maladie chronique.',
          },
          {
            q: 'Le colis est-il discret ?',
            a: 'Oui, totalement. Emballage neutre sans logo ni mention du contenu. Le livreur lui-même ne sait pas ce qu\'il livre. Personne ne saura.',
          },
          {
            q: 'Que se passe-t-il si je ne suis pas satisfait ?',
            a: 'Tu suis le traitement complet et tu n\'observes aucune amélioration ? Contacte-nous sur WhatsApp, on te rembourse 100% sans aucune question.',
          },
        ]}
      />

      {/* URGENCY + FORMULAIRE */}
      <section className="bg-vert-bg/40 border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story-narrow pt-10">
          <UrgencyTimer />
        </div>
      </section>
      <ProductForm product={product} />

      {/* FOOTER */}
      <StoryFooter />
    </div>
  );
}
