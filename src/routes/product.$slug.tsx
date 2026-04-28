import { createFileRoute, redirect } from '@tanstack/react-router';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LiveSocialProof } from '@/components/LiveSocialProof';
import { MiniDiagnostic } from '@/components/MiniDiagnostic';
import { UrgencyTimer } from '@/components/UrgencyTimer';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AbandonRecovery } from '@/components/AbandonRecovery';
import { SIROP_KOUKA } from '@/lib/products';

import { StoryHeader } from '@/components/story/StoryHeader';
import { StoryAnnouncement } from '@/components/story/StoryAnnouncement';
import { StoryHero } from '@/components/story/StoryHero';
import { StoryUSPBar } from '@/components/story/StoryUSPBar';
import { StoryFeaturedRow } from '@/components/story/StoryFeaturedRow';
import { StoryReviews } from '@/components/story/StoryReviews';
import { StoryFAQ } from '@/components/story/StoryFAQ';
import { StoryGuarantee } from '@/components/story/StoryGuarantee';
import { StoryAtcSticky } from '@/components/story/StoryAtcSticky';
import { StoryFooter } from '@/components/story/StoryFooter';

export const Route = createFileRoute('/product/$slug')({
  beforeLoad: ({ params }) => {
    if (params.slug !== 'sirop-kouka') throw redirect({ to: '/' });
  },
  head: () => ({
    meta: [
      { title: SIROP_KOUKA.metaTitle },
      { name: 'description', content: SIROP_KOUKA.metaDesc },
      { property: 'og:title', content: SIROP_KOUKA.metaTitle },
      { property: 'og:description', content: SIROP_KOUKA.metaDesc },
      { property: 'og:image', content: SIROP_KOUKA.heroImage },
    ],
  }),
  component: SiropPage,
});

function SiropPage() {
  const product = SIROP_KOUKA;

  return (
    <div className="bg-background pb-24 md:pb-20">
      <VisitTracker page="sirop-kouka" />
      <LiveSocialProof product="Sirop KOUKA" />
      <ExitIntentPopup productName="Sirop KOUKA" />
      <AbandonRecovery productName="Sirop KOUKA" />
      <StoryAtcSticky product={product} ctaLabel="Commander discrètement" tone="rouge" />

      <StoryAnnouncement
        messages={[
          '🤐 100% discret · Le livreur ne sait pas ce qu\'il y a dedans',
          '💵 Paiement à la livraison · Cash uniquement',
          '🛡️ Performant ou Remboursé 100%',
          '🚚 Livraison 24-48h partout au Burkina',
        ]}
      />
      <StoryHeader
        brand="🌿 KOUKA Thérapies"
        ctaLabel="Commander"
        links={[
          { label: 'Boutique', href: '#order-section' },
          { label: 'Avis', href: '#story-reviews' },
          { label: 'Discrétion', href: '#story-discretion' },
          { label: 'FAQ', href: '#story-faq' },
        ]}
      />

      <StoryHero
        product={product}
        gallery={[
          product.heroImage,
          '/images/kouka-solution.png',
          '/images/kouka-banner-investissement.png',
          '/images/kouka-temoignages.webp',
        ]}
        rating={{ stars: 4.9, count: 156 }}
        subtitle="Éjaculation précoce, érection molle, libido en panne ? Le Sirop du Vieux KOUKA réveille ta puissance naturelle dès la 2ᵉ nuit. 100% plantes africaines. Livraison 100% discrète."
        bullets={[
          'Tiens 30 minutes au lieu de 2',
          'Érection ferme dès J2 — sans pilule chimique',
          'Désir et confiance qui reviennent naturellement',
          'Colis 100% neutre · Personne ne saura',
        ]}
        ctaLabel="🍯 Commander discrètement — Paie à la livraison"
        ctaTone="rouge"
      />

      <StoryUSPBar
        items={[
          { icon: '🤐', title: 'Colis 100% discret', desc: 'Aucune mention' },
          { icon: '🍯', title: 'Effet dès J2', desc: '100% plantes' },
          { icon: '💵', title: 'Paiement livraison', desc: 'Cash à réception' },
          { icon: '🛡️', title: 'Remboursé', desc: 'Si pas satisfait' },
        ]}
      />

      {/* DISCRÉTION — featured row sombre */}
      <section id="story-discretion" className="bg-foreground text-white border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story py-14 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="story-eyebrow mb-2 text-or-light">Promesse n°1 : la discrétion</div>
            <h2 className="story-h2 text-white mb-5">🤐 Personne ne saura. Promis.</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-left text-white/90">
              <li className="flex items-start gap-2"><span className="text-vert-light mt-0.5">✓</span> Colis <strong className="text-white">neutre, sans logo, sans nom du produit</strong></li>
              <li className="flex items-start gap-2"><span className="text-vert-light mt-0.5">✓</span> Le livreur ne sait <strong className="text-white">pas ce qu'il y a dedans</strong></li>
              <li className="flex items-start gap-2"><span className="text-vert-light mt-0.5">✓</span> Numéro WhatsApp <strong className="text-white">jamais partagé</strong>, jamais revendu</li>
              <li className="flex items-start gap-2"><span className="text-vert-light mt-0.5">✓</span> Aucun appel public — message discret seulement</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROBLÈME */}
      <StoryFeaturedRow
        eyebrow="Tu vis ça en silence ?"
        title="Ce que beaucoup d'hommes vivent — sans oser le dire."
        image="/images/kouka-solution.png"
        imageAlt="Sirop KOUKA"
        bg="cream"
      >
        <ul className="ckl ckl-r">
          <li>Tu finis avant elle — souvent en 2 minutes ou moins.</li>
          <li>L'érection ne tient pas au moment de pénétrer.</li>
          <li>Tu n'as plus envie. Tu inventes des excuses (fatigue, travail).</li>
          <li>Tu sens que ta femme se retient de te le dire.</li>
          <li>Tu as essayé Viagra, gingembre, miel… sans vrai résultat ou avec effets secondaires.</li>
        </ul>
        <p className="text-foreground font-bold mt-3">
          ⚠️ Si tu coches 2 cases ou plus, ton corps t'envoie un signal. Plus tu attends, plus c'est dur à inverser.
        </p>
      </StoryFeaturedRow>

      {/* SOLUTION */}
      <StoryFeaturedRow
        eyebrow="La solution naturelle"
        title="Le Sirop du Vieux KOUKA"
        image="/images/kouka-banner-investissement.png"
        imageAlt="Sirop du Vieux KOUKA"
        bg="white"
        reverse
      >
        <p>
          Une formule traditionnelle africaine — racines et écorces récoltées au Burkina, Côte d'Ivoire et Bénin —
          pour <strong>réveiller la circulation sanguine, prolonger l'érection et relancer la libido naturelle.</strong>
        </p>
        <p className="text-foreground font-bold">
          Pas un excitant chimique. Une vraie restauration de ta vitalité.
        </p>
        <ul className="ckl mt-3">
          <li>Effet dès la 2ᵉ nuit · jusqu'à 30 min au lit</li>
          <li>Érection ferme et durable</li>
          <li>Désir et confiance retrouvés</li>
          <li>Aucun risque cardiaque · Zéro effet secondaire</li>
        </ul>
      </StoryFeaturedRow>

      {/* TIMELINE */}
      <section className="bg-cream-2 border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story py-14 md:py-16">
          <div className="text-center mb-10">
            <div className="story-eyebrow mb-2">Résultats jour après jour</div>
            <h2 className="story-h2 mb-2">⚡ Ce qui se passe jour après jour</h2>
            <p className="text-muted-foreground">Résultats observés par +150 clients en 2024.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              ['J1-J2', 'Le moteur redémarre', "Dès la 2ᵉ nuit : afflux d'énergie. L'envie revient toute seule."],
              ['J3-J5', 'Érection ferme et durable', 'Tu rentres dur, tu restes dur. Plus de panique de "redescendre".'],
              ['J6-J10', 'Tu tiens 20-30 minutes', "Le contrôle revient. Tu choisis quand finir."],
              ['J11-J15', 'Confiance totale retrouvée', "Tu redeviens l'homme que tu étais à 25 ans."],
            ].map(([day, title, desc]) => (
              <div key={day} className="story-card p-5">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold mb-3 bg-rouge text-white">
                  {day}
                </div>
                <div className="font-extrabold text-foreground mb-1">{title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story py-14 md:py-16">
          <div className="text-center mb-8">
            <div className="story-eyebrow mb-2">Comparatif honnête</div>
            <h2 className="story-h2 mb-2">Pourquoi le Sirop KOUKA plutôt que Viagra & co ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare honnêtement. Tu vas comprendre pourquoi tant d'hommes basculent sur le naturel.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ComparisonTable
              rows={[
                { label: 'Effet sur', kouka: 'Cause profonde', meds: 'Symptôme', surgery: 'Symptôme' },
                { label: "Durée d'action", kouka: '15+ jours', meds: '4 heures', surgery: '4 heures' },
                { label: 'Effets secondaires', kouka: '✅ Aucun', meds: '⚠️ Maux de tête, cœur', surgery: '⚠️ Bouffées' },
                { label: 'Risque cœur', kouka: '✅ Zéro', meds: '❌ Réel', surgery: '❌ Réel' },
                { label: 'Discrétion', kouka: '✅ 100%', meds: 'Pharmacie', surgery: 'Pharmacie' },
                { label: 'Désir / libido', kouka: '✅ Restauré', meds: '❌ Mécanique', surgery: '❌ Mécanique' },
                { label: 'Garantie', kouka: '✅ Remboursé', meds: '❌ Non', surgery: '❌ Non' },
              ]}
              productLabel="🍯 Sirop KOUKA"
              medsLabel="Viagra & co"
              surgeryLabel="Pompes/gadgets"
            />
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <StoryReviews
        rating={4.9}
        count={156}
        reviews={[
          { name: 'M.K · 38 ans', stars: 5, title: 'Ma femme l\'a remarqué dès la 3ᵉ nuit', text: "J'ai commencé le flacon le lundi. Mercredi soir, ma femme m'a dit 'tu vas bien ?' avec un sourire. C'était il y a 2 mois — depuis, on est repartis comme avant." },
          { name: 'I.D · 45 ans', stars: 5, title: 'Le contrôle est revenu', text: "Avant je finissais en 2 minutes. Après le traitement complet, je tiens facilement 20-25 min. Ma confiance est revenue. Je recommande à tous les hommes." },
          { name: 'O.S · 52 ans', stars: 5, title: 'Plus de Viagra pour moi', text: "J'utilisais Viagra depuis 5 ans, ça me donnait des maux de tête. Le Sirop KOUKA m'a remis en marche naturellement. Aucun effet secondaire. Je rachète encore." },
        ]}
      />

      {/* GARANTIE */}
      <StoryGuarantee
        title='Garantie "Performant ou Remboursé"'
        text="Tu finis le flacon sans aucune amélioration ? Remboursement 100%, sans justification. Tu testes sans aucun risque."
      />

      {/* MINI-DIAGNOSTIC */}
      <section className="bg-white border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story-narrow py-14 md:py-16">
          <div className="text-center mb-8">
            <div className="story-eyebrow mb-2">Conseil personnalisé</div>
            <h2 className="story-h2 mb-2">Quelle cure te convient ?</h2>
            <p className="text-muted-foreground">3 questions discrètes · ta réponse personnalisée.</p>
          </div>
          <MiniDiagnostic
            questions={[
              { q: 'En général, tu tiens combien de temps ?', options: ["Moins d'1 minute", '1-3 minutes', '5-10 minutes', "Plus, mais l'érection ne tient pas"] },
              { q: 'Depuis combien de temps ce souci dure ?', options: ['Quelques semaines', 'Quelques mois', "Plus d'1 an", 'Plus de 3 ans'] },
              { q: 'Tu vis seul ou en couple ?', options: ['En couple stable', 'Marié(e)', 'Plusieurs partenaires', 'Célibataire — je veux être prêt'] },
            ]}
            recommendation={(a) => {
              if (a[1] >= 2 || a[0] === 0) return { offerHint: 'Cure de COUPLE 3+2 (30 000 FCFA)', message: "Souci installé : il faut une cure complète pour restaurer durablement. C'est ce que choisissent 70% des hommes mariés." };
              return { offerHint: 'Traitement COMPLET 2+1 (25 000 FCFA)', message: "L'offre la plus choisie : effet dès J2, cure complète pour ne pas rechuter." };
            }}
          />
        </div>
      </section>

      {/* FAQ */}
      <StoryFAQ
        items={[
          { q: 'Le colis est-il vraiment discret ?', a: "100% discret. Emballage neutre sans logo, sans nom du produit. Le livreur ne sait pas ce qu'il y a dedans. Personne dans ton entourage ne saura." },
          { q: 'En combien de temps je vois les résultats ?', a: "Effet dès la 2ᵉ nuit pour la majorité des hommes. Cure complète recommandée (2+1 ou 3+2 flacons) pour des résultats durables (15+ jours)." },
          { q: 'Y a-t-il des effets secondaires ?', a: 'Aucun. 100% plantes africaines. Pas de risque cardiaque, contrairement aux médicaments chimiques.' },
          { q: "Je paie quand ?", a: "Tu paies SEULEMENT à la livraison, en cash. Pas d'acompte, pas de paiement en ligne." },
          { q: "Et si ça ne marche pas pour moi ?", a: 'Tu finis le flacon sans amélioration ? On te rembourse 100% sans aucune question.' },
          { q: 'Est-ce compatible avec un traitement médical en cours ?', a: 'Demande conseil à ton médecin si tu prends des médicaments pour le cœur ou la tension. Pour les hommes en bonne santé générale, aucun risque.' },
        ]}
      />

      <section className="bg-vert-bg/40 border-b border-[oklch(0.92_0.02_130)]">
        <div className="container-story-narrow pt-10">
          <UrgencyTimer />
        </div>
      </section>
      <ProductForm product={product} />

      <StoryFooter />
    </div>
  );
}
