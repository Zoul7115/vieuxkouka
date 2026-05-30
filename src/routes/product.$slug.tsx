import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ComparisonTable } from '@/components/ComparisonTable';
import { SocialProofChatSirop } from '@/components/sirop/SocialProofChatSirop';

import { useDynamicStock } from '@/hooks/useDynamicStock';

import { SIROP_KOUKA } from '@/lib/products';

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
  

  return (
    <div className="bg-background pb-16 md:pb-0">
      <VisitTracker page="sirop-kouka" />
      {/* Sticky/Exit/Abandon retirés */}

      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🤐 100% discret · 🔥 Effet dès J2 · ⏰ Stock restant : <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> flacons
      </div>

      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-2 border-vert-bg">
        <div className="container-kouka text-center">
          <span className="inline-block bg-rouge text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
            🔒 100% discret · Naturel · Garanti
          </span>
          <h1 className="text-vert mb-3">
            Tu finis en 2 minutes ?<br />
            <em className="text-rouge not-italic">Tiens 30 minutes dès J2.</em>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-5 text-base leading-relaxed">
            Éjaculation précoce, érection molle, libido en panne ? <strong className="text-foreground">Le Sirop du Vieux KOUKA réveille ta puissance naturelle</strong> avec 100% de plantes africaines.
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

          {/* PRIX visible dans le hero */}
          <div className="bg-white border-2 border-rouge rounded-2xl p-4 mb-5 max-w-sm mx-auto shadow-md">
            <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">🔥 Offre recommandée</div>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-3xl font-extrabold text-rouge">25 000 FCFA</span>
              <span className="text-base text-muted-foreground line-through">36 000</span>
            </div>
            <div className="text-sm font-bold text-vert">2 flacons + 1 OFFERT · Traitement complet</div>
            <div className="text-xs text-muted-foreground mt-1">📦 Colis neutre · Cash à réception</div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
            <span>✅ Effet dès J2</span>
            <span>✅ 100% plantes</span>
            <span>✅ Emballage neutre</span>
            <span>✅ Paiement à la livraison</span>
          </div>

          <button
            onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            🍯 JE COMMANDE — JE PAIE À RÉCEPTION
          </button>
          <p className="text-sm text-muted-foreground mt-3">🚚 Livraison rapide · 💵 Paiement uniquement à la réception</p>
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
            Une formule traditionnelle africaine — racines et écorces récoltées au Burkina Faso et au Bénin —
            pour <strong>réveiller la circulation sanguine, prolonger l'érection</strong> et relancer la libido naturelle.
            Pas un excitant chimique. Une vraie restauration de ta vitalité.
          </p>

          {/* Présentation du Vieux KOUKA — origine région des Kuilsés */}
          <div className="bloc bloc-or p-0 overflow-hidden mb-6 max-w-lg mx-auto">
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
                "Héritier d'un savoir transmis par son grand-père il y a plus de 60 ans, le Vieux KOUKA récolte
                lui-même chaque plante de sa formule — selon les cycles de la lune et les régions où elles atteignent
                leur pleine puissance."
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <img src="/images/kouka-solution.png" alt="La solution existe — Sirop du Vieux KOUKA" className="rounded-2xl border-2 border-vert-bg" />
            <img src="/images/kouka-banner-investissement.png" alt="Le Vieux KOUKA — ton investissement bien-être" className="rounded-2xl border-2 border-vert-bg" />
            <img src="/images/kouka-temoignages.webp" alt="Témoignages clients Sirop du Vieux KOUKA" className="rounded-2xl border-2 border-vert-bg" />
          </div>

          {/* Livraison discrète Burkina + Niger */}
          <div className="bg-white border-2 border-vert-bg rounded-2xl p-5 mt-6 max-w-lg mx-auto">
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
            <p className="font-bold mb-1">💵 Paiement uniquement à la livraison</p>
            <p className="text-sm">Tu ne paies <strong>RIEN à l'avance</strong>. Le livreur passe chez toi, tu vérifies le colis, et tu paies <strong>cash à la réception</strong>. Aucun risque, zéro acompte.</p>
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
              { label: 'Paiement', kouka: '✅ À la livraison', meds: '❌ D\'avance', surgery: '❌ D\'avance' },
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

      {/* Témoignages WhatsApp + Facebook (fictifs, à but illustratif) */}
      <SocialProofChatSirop />

      {/* FAQ avant le formulaire — lever les objections avant la décision */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Questions fréquentes</h2>
          <FAQ />
          <div className="text-center mt-6">
            <button
              onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform"
            >
              🍯 OK, je commande maintenant
            </button>
          </div>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="sec bg-cream-2">
        <div className="container-kouka text-center">
          <Link to="/" className="text-vert-mid font-bold text-sm">← Retour à la page poudre KOUKA</Link>
        </div>
      </section>
    </div>
  );
}
