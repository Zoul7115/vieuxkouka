import { createFileRoute, Link } from '@tanstack/react-router';
import { KOUKA } from '@/lib/products';
import { VisitTracker } from '@/components/VisitTracker';
import { Countdown } from '@/components/Countdown';
import { ProductForm } from '@/components/ProductForm';
import { FAQ } from '@/components/FAQ';

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

  return (
    <div className="bg-background">
      <VisitTracker page="home" />

      {/* Bandeau urgence */}
      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🌿 +200 clients guéris · Livraison gratuite Ouaga · Stock : <b className="text-[oklch(0.85_0.08_145)]">11</b> sachets
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-[3px] border-[oklch(0.85_0.06_145)]">
        <div className="container-kouka text-center">
          <div className="bg-[oklch(0.97_0.06_92)] border-2 border-or-light rounded-xl px-4 py-2.5 mb-5">
            <span className="text-[oklch(0.40_0.10_82)] font-bold">
              🚀 Commande aujourd'hui → Livraison <strong className="text-vert">demain</strong> à Ouagadougou
            </span>
          </div>

          <span className="inline-block bg-vert-mid text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            🌿 +200 clients guéris · 87% soulagés dès J3 · Satisfait ou remboursé
          </span>

          <h1 className="text-vert mb-4">
            Tu souffres à chaque fois<br />que tu vas aux toilettes ?<br />
            <em className="text-rouge not-italic">Ça va s'arrêter.</em>
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-lg leading-relaxed">
            Hémorroïdes, ulcères, ballonnements, gaz, colopathie, rectum qui sort — depuis des années ?
            <strong> La Poudre du Vieux KOUKA traite la cause profonde. Pas pour calmer. Pour guérir.</strong>
          </p>

          <div className="max-w-[260px] mx-auto mb-5 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(46,125,50,0.25)] border-[3px] border-[oklch(0.85_0.06_145)]">
            <img src={product.heroImage} alt={product.name} className="w-full block" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {['🩸 Hémorroïdes', '🔥 Ulcères', '💨 Ballonnements & Gaz', '🌀 Colopathie', '😣 Rectum qui sort'].map((t) => (
              <span key={t} className="bg-white border-2 border-vert-bg text-muted-foreground px-3.5 py-1.5 rounded-full text-sm font-semibold">
                {t}
              </span>
            ))}
          </div>

          <div className="mb-5">
            <Countdown />
          </div>

          <button
            onClick={scrollToOrder}
            className="w-full bg-vert-mid text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(46,125,50,0.35)] hover:-translate-y-0.5 transition-transform"
          >
            🌿 COMMANDER — PAYER À LA LIVRAISON
          </button>
          <p className="text-sm text-muted-foreground mt-3">📦 Livraison gratuite Ouaga · Paiement cash · Emballage discret</p>
        </div>
      </section>

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
              { i: '🌀', t: 'Colopathie', d: 'Côlon irritable, transit' },
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
          <h2 className="text-center mb-6">Ce que tu vis <span className="text-rouge">chaque jour</span></h2>

          <div className="bloc bloc-r">
            <p className="text-rouge font-extrabold mb-3 text-lg">Reconnais-tu l'un de ces problèmes ?</p>
            <ul className="ckl ckl-r">
              <li>Aller aux toilettes est devenu une torture — tu saignes, tu souffres, tu évites</li>
              <li>Après chaque repas, ça brûle dans l'estomac comme du feu — l'ulcère te ronge</li>
              <li>Ton ventre gonfle, tu as des gaz permanents, tu te sens lourd tout le temps</li>
              <li>Le rectum sort parfois et tu dois le remettre à la main — honte et douleur</li>
              <li>Le côlon irritable te fait alterner diarrhée et constipation, sans prévenir</li>
              <li>Tu as essayé des médicaments, des sirops, des injections — rien ne tient</li>
              <li>Tu dépenses de l'argent chaque mois pour calmer, mais jamais pour guérir</li>
            </ul>
          </div>

          <div className="bloc bloc-or mt-5">
            <p className="text-[oklch(0.40_0.10_82)] font-extrabold mb-3">⚠️ Si tu ne traites pas maintenant :</p>
            <ul className="ckl">
              <li>Les hémorroïdes évoluent vers une thrombose — opération chirurgicale urgente</li>
              <li>L'ulcère non traité peut se perforer — urgence médicale gravissime</li>
              <li>La colopathie chronique entraîne des carences et une fatigue permanente</li>
              <li>Les ballonnements continus dérèglent ta flore intestinale en profondeur</li>
              <li>Chaque année sans traitement, ça empire — jamais seul ça ne se résout</li>
            </ul>
          </div>

          <p className="text-center italic mt-6 text-muted-foreground">
            "Tu as tout essayé. Les médicaments calment 3 jours et ça revient. C'est parce que tu utilisais les mauvais outils."
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
              <p className="text-xs text-muted-foreground font-semibold mb-3">
                Thérapeute traditionnel · Burkina Faso · +60 ans de pratique
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
              {['🇧🇫 Burkina Faso', '🇨🇮 Côte d\'Ivoire', '🇧🇯 Bénin'].map((t) => (
                <span key={t} className="bg-vert-bg border-2 border-[oklch(0.80_0.10_145)] text-vert px-3.5 py-1.5 rounded-full font-bold text-sm">
                  {t}
                </span>
              ))}
            </div>
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
            <button onClick={scrollToOrder} className="bg-vert-mid text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(46,125,50,0.35)] hover:-translate-y-0.5 transition-transform">
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
          <h2 className="text-center mb-2">Ils ont essayé.</h2>
          <p className="text-center mb-1">Voici leurs mots. Pas les nôtres.</p>
          <p className="text-center text-muted-foreground mb-7 text-sm">
            Messages WhatsApp réels · Audios originaux · Preuves de livraison vérifiables
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
            <p>🛡️ <strong>Satisfait ou remboursé</strong> — Traitement complet sans résultats ? Remboursement intégral, sans question.</p>
          </div>
        </div>
      </section>

      {/* LIVRAISON */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-6">Livraison <span className="text-vert">rapide dans tout le Burkina</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { i: '🏙️', t: 'Ouagadougou', d: 'Livraison gratuite' },
              { i: '🇧🇫', t: 'Burkina Faso', d: '1 000 FCFA' },
              { i: '🇧🇯', t: 'Bénin', d: '1 500 FCFA' },
              { i: '💵', t: 'Paiement', d: 'Cash à la livraison' },
            ].map((x) => (
              <div key={x.t} className="bg-white border-2 border-vert-bg rounded-xl p-4 text-center shadow-sm">
                <span className="block text-3xl mb-2">{x.i}</span>
                <div className="font-extrabold text-foreground">{x.t}</div>
                <div className="text-sm text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Tes questions</h2>
          <p className="text-center text-muted-foreground">Les vraies réponses sans détours</p>
          <FAQ />
        </div>
      </section>

      {/* FORMULAIRE */}
      <ProductForm product={product} />

      <footer className="bg-vert text-white text-center py-8 text-sm">
        <div className="container-kouka">
          <div className="font-extrabold mb-2">🌿 KOUKA Thérapies</div>
          <p className="opacity-80 mb-4">Savoir ancestral · Burkina Faso · Afrique de l'Ouest</p>
          <div className="flex justify-center gap-4 text-xs">
            <Link to="/diagnostic" className="text-white/70 hover:text-white">Diagnostic gratuit</Link>
            <span className="text-white/30">·</span>
            <Link to="/admin" className="text-white/60 hover:text-white">Espace admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
