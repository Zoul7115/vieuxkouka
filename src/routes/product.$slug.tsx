import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LiveSocialProof } from '@/components/LiveSocialProof';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { MiniDiagnostic } from '@/components/MiniDiagnostic';
import { UrgencyTimer } from '@/components/UrgencyTimer';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AbandonRecovery } from '@/components/AbandonRecovery';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { SIROP_KOUKA, formatFCFA } from '@/lib/products';

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
  const stock = useDynamicStock('sirop-kouka', 14);
  const recoPrice = product.offers.find(o => o.recommended)?.price || product.offers[0].price;

  return (
    <div className="bg-background pb-16 md:pb-0">
      <VisitTracker page="sirop-kouka" />
      <LiveSocialProof product="Sirop KOUKA" />
      <StickyMobileCTA label="🍯 COMMANDER — Discret" price={formatFCFA(recoPrice)} />
      <ExitIntentPopup productName="Sirop KOUKA" />
      <AbandonRecovery productName="Sirop KOUKA" />

      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🤐 100% discret · 🔥 Effet dès J2 · ⏰ Stock restant : <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> flacons
      </div>

      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-2 border-vert-bg">
        <div className="container-kouka text-center">
          <span className="inline-block bg-rouge text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
            🔒 100% discret · Naturel · Garanti
          </span>
          <h1 className="text-vert mb-4">
            Tu finis en 2 minutes ?<br />
            <em className="text-rouge not-italic">Tiens 30 minutes dès la 2ᵉ nuit.</em>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-lg leading-relaxed">
            Éjaculation précoce, érection molle, désir en panne — tu n'es pas seul, et ce n'est <strong>pas dans ta tête</strong>.
            <strong className="text-foreground"> Le Sirop du Vieux KOUKA réveille ta puissance naturelle</strong> avec 100% de plantes africaines. Ta femme va le remarquer. Toi aussi.
          </p>

          {/* Réassurance ANONYMAT renforcée */}
          <div className="max-w-md mx-auto bg-foreground text-white rounded-xl p-4 mb-5 text-left">
            <div className="font-extrabold text-base mb-2 flex items-center gap-2">🤐 Personne ne saura. Promis.</div>
            <ul className="text-sm space-y-1 text-white/90">
              <li>✅ Colis <strong>neutre, sans logo, sans nom du produit</strong></li>
              <li>✅ Le livreur ne sait <strong>pas ce qu'il y a dedans</strong></li>
              <li>✅ Numéro WhatsApp <strong>jamais partagé</strong>, jamais revendu</li>
              <li>✅ Aucun appel public — message discret seulement</li>
            </ul>
          </div>

          <div className="max-w-[300px] mx-auto mb-5 rounded-2xl overflow-hidden border-2 border-vert-bg shadow-[0_8px_32px_rgba(46,125,50,0.25)]">
            <img src={product.heroImage} alt={product.name} className="w-full block" />
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-5">
            <span>✅ Effet dès J2</span>
            <span>✅ 100% plantes</span>
            <span>✅ Emballage neutre</span>
            <span>✅ Remboursé si nul</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-vert-bg border-2 border-vert-mid rounded-full px-4 py-2 mb-4 shadow-sm">
            <span className="text-xl">🛡️</span>
            <span className="text-sm font-extrabold text-vert">Garantie PERFORMANT ou REMBOURSÉ 100%</span>
          </div>

          <button
            onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 transition-transform"
          >
            🍯 JE COMMANDE — JE PAIE À RÉCEPTION
          </button>
          <p className="text-sm text-muted-foreground mt-3">📦 Colis 100% neutre · Personne ne sait ce qu'il y a dedans</p>
        </div>
      </section>

      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ce que tu vis <span className="text-rouge">en silence</span></h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">Lis honnêtement. Coche ce qui te concerne.</p>
          <div className="grid gap-4">
            {[
              "Tu finis avant elle — souvent en 2 minutes ou moins. Tu détournes le regard après",
              "L'érection ne tient pas. Au moment de pénétrer, ça baisse. Tu fais semblant que c'est rien",
              "Tu n'as plus envie. Quand elle s'approche, tu inventes une excuse — fatigue, travail",
              "Tu sens que ta femme se retient de te le dire. Le silence au lit devient pesant",
              "Tu as essayé Viagra, gingembre, miel, autres trucs — soit ça ne marche pas, soit ça t'a rendu malade",
              "Tu as peur qu'elle aille voir ailleurs. Tu sais que ça arrive autour de toi",
            ].map((item) => (
              <div key={item} className="bloc bloc-r">
                <p className="font-bold text-muted-2">☐ {item}</p>
              </div>
            ))}
          </div>
          <p className="text-center italic mt-6 text-muted-foreground max-w-lg mx-auto">
            "Si tu as coché 2 cases ou plus, c'est que ton corps t'envoie un signal. Plus tu attends, plus c'est dur à inverser."
          </p>
        </div>
      </section>

      <section className="sec bg-vert-bg">
        <div className="container-kouka">
          <h2 className="text-center mb-3">🌿 Le Sirop du Vieux KOUKA</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Une formule traditionnelle africaine — racines et écorces récoltées au Burkina, Côte d'Ivoire et Bénin —
            pour <strong>réveiller la circulation sanguine, prolonger l'érection</strong> et relancer la libido naturelle.
            Pas un excitant chimique. Une vraie restauration de ta vitalité.
          </p>
          <div className="grid gap-4">
            <img src="/images/kouka-solution.png" alt="La solution existe — Sirop du Vieux KOUKA" className="rounded-2xl border-2 border-vert-bg" />
            <img src="/images/kouka-banner-investissement.png" alt="Le Vieux KOUKA — ton investissement bien-être" className="rounded-2xl border-2 border-vert-bg" />
            <img src="/images/kouka-temoignages.webp" alt="Témoignages clients Sirop du Vieux KOUKA" className="rounded-2xl border-2 border-vert-bg" />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">⚡ Ce qui se passe <span className="text-vert">jour après jour</span></h2>
          <p className="text-center text-muted-foreground text-sm">Résultats observés par +150 clients en 2024</p>
          <div className="grid gap-4 mt-6">
            {[
              ['J1-J2', 'Le moteur redémarre', "Dès la 2ᵉ nuit : tu sens un afflux d'énergie en bas. L'envie revient toute seule, sans forcer."],
              ['J3-J5', 'Érection ferme et durable', 'Tu rentres dur, tu restes dur. Plus de panique de "redescendre" au mauvais moment.'],
              ['J6-J10', 'Tu tiens 20-30 minutes', "Le contrôle revient. Tu choisis quand finir — pas l'inverse. Ta femme commence à parler."],
              ['J11-J15', 'Confiance totale retrouvée', "Tu redeviens l'homme que tu étais à 25 ans. Sans complexe. Sans pression. Sans pilule chimique."],
            ].map(([day, title, desc]) => (
              <div key={day} className="flex gap-4 py-4 border-b border-vert-bg last:border-b-0">
                <div className="shrink-0 w-[76px] text-center rounded-xl py-2 px-1 bg-vert-mid text-white font-extrabold text-sm">{day}</div>
                <div>
                  <div className="font-extrabold text-vert mb-1">{title}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-5 text-center mt-7">
            <p className="font-bold mb-1">🛡️ Garantie "Performant ou Remboursé"</p>
            <p className="text-sm">Tu finis le flacon sans aucune amélioration ? <strong>Remboursement 100%, sans justification.</strong> Tu testes sans aucun risque.</p>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Pourquoi le Sirop KOUKA <span className="text-vert">plutôt que Viagra & co</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Compare honnêtement. Tu vas comprendre pourquoi tant d'hommes basculent sur le naturel.
          </p>
          <ComparisonTable
            rows={[
              { label: 'Effet sur', kouka: 'Cause profonde', meds: 'Symptôme', surgery: 'Symptôme' },
              { label: 'Durée d\'action', kouka: '15+ jours', meds: '4 heures', surgery: '4 heures' },
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
          <div className="text-center mt-6">
            <button
              onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 transition-transform"
            >
              🍯 Je veux le Sirop KOUKA
            </button>
          </div>
        </div>
      </section>

      {/* MINI-DIAGNOSTIC */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Quelle <span className="text-vert">cure te convient</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">3 questions discrètes · ta réponse personnalisée</p>
          <MiniDiagnostic
            questions={[
              { q: 'En général, tu tiens combien de temps ?', options: ['Moins d\'1 minute', '1-3 minutes', '5-10 minutes', 'Plus, mais l\'érection ne tient pas'] },
              { q: 'Depuis combien de temps ce souci dure ?', options: ['Quelques semaines', 'Quelques mois', 'Plus d\'1 an', 'Plus de 3 ans'] },
              { q: 'Tu vis seul ou en couple ?', options: ['En couple stable', 'Marié(e)', 'Plusieurs partenaires', 'Célibataire — je veux être prêt'] },
            ]}
            recommendation={(a) => {
              if (a[1] >= 2 || a[0] === 0) return { offerHint: 'Cure de COUPLE 3+2 (30 000 FCFA)', message: 'Souci installé : il faut une cure complète pour restaurer durablement. C\'est ce que choisissent 70% des hommes mariés.' };
              return { offerHint: 'Traitement COMPLET 2+1 (25 000 FCFA)', message: 'L\'offre la plus choisie : effet dès J2, cure complète pour ne pas rechuter.' };
            }}
          />
        </div>
      </section>

      <div className="container-kouka pt-8"><UrgencyTimer /></div>
      <ProductForm product={product} />

      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Questions fréquentes</h2>
          <FAQ />
          <div className="text-center mt-8">
            <Link to="/" className="text-vert-mid font-bold text-sm">← Retour à la page poudre KOUKA</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
