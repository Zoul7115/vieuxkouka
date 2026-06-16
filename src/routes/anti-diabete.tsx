import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { ANTI_DIABETE } from '@/lib/products';
import { StickyOfferBarRecommended } from '@/components/StickyOfferBarRecommended';
import { SocialProofChat } from '@/components/anti-diabete/SocialProofChat';
import { DiagnosticQuiz } from '@/components/conversion/DiagnosticQuiz';
import { OfferComparisonTable } from '@/components/conversion/OfferComparisonTable';
import { ReassuranceBar } from '@/components/conversion/ReassuranceBar';


function preselectAndScroll(offerId: number) {
  try {
    sessionStorage.setItem('preselect_offer_id', String(offerId));
  } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}



export const Route = createFileRoute('/anti-diabete')({
  head: () => ({
    meta: [
      { title: ANTI_DIABETE.metaTitle },
      { name: 'description', content: ANTI_DIABETE.metaDesc },
      { property: 'og:title', content: ANTI_DIABETE.metaTitle },
      { property: 'og:description', content: ANTI_DIABETE.metaDesc },
      { property: 'og:image', content: ANTI_DIABETE.heroImage },
    ],
  }),
  component: AntiDiabetePage,
});


function scrollToOrder() {
  preselectAndScroll(22);
}

function scrollToTestimonies() {
  document.getElementById('testimonies-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function AntiDiabetePage() {
  const product = ANTI_DIABETE;
  const stock = useDynamicStock('anti-diabete', 16);

  return (
    <div className="bg-bleu-bg pb-32">
      <StickyOfferBarRecommended product={product} stock={stock} unitLabel="sachets" />
      <VisitTracker page="anti-diabete" />

      {/* Bandeau bleu médical */}
      <div className="bg-bleu text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🩺 Traitement complet recommandé · Livraison Ouaga & Niamey · Stock limité : <b className="text-bleu-light">{stock}</b>
      </div>

      {/* HERO — Modifié selon les directives de continuité publicitaire */}
      <section className="bg-gradient-to-b from-bleu-bg via-white to-bleu-bg py-8 md:py-12 border-b-[3px] border-bleu-light/40">
        <div className="container-kouka max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-bleu text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 shadow-sm">
              🩺 Recette traditionnelle · 60+ ans d'histoire
            </span>
            
            <h1 className="text-rouge font-extrabold text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight max-w-2xl mx-auto leading-tight mb-2">
              VOUS SOUFFREZ DE L'UN DE CES SYMPTÔMES ?
            </h1>
            
            {/* Boîte des Symptômes - Continuité Pub */}
            <div className="bg-white border-2 border-rouge/30 rounded-2xl p-5 md:p-6 shadow-[0_8px_30px_rgb(198,40,40,0.06)] max-w-2xl mx-auto my-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left">
                {[
                  'Pieds qui picotent',
                  'Pieds qui chauffent',
                  'Urines fréquentes',
                  'Soif excessive',
                  'Fatigue constante',
                  'Vision floue'
                ].map((symp, index) => (
                  <div key={index} className="flex items-center gap-2.5 bg-rouge-light/40 hover:bg-rouge-light/60 transition-colors py-2.5 px-3 rounded-xl border border-rouge/10">
                    <span className="text-rouge font-extrabold text-lg">✓</span>
                    <span className="text-foreground font-semibold text-xs md:text-sm leading-tight">{symp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Texte d'accroche */}
            <div className="max-w-2xl mx-auto space-y-4 text-left md:text-center mt-6 text-foreground/90">
              <p className="text-base md:text-lg font-bold text-bleu bg-bleu-bg/50 py-2.5 px-4 rounded-xl border border-bleu/10 inline-block w-full">
                Ces signes sont souvent associés à une glycémie difficile à contrôler.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                Depuis plusieurs années, de nombreuses personnes font confiance à la <strong className="text-foreground font-extrabold">Poudre Anti-Diabète du Vieux Kouka</strong> pour accompagner naturellement leur équilibre glycémique.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center mt-8 pt-4 border-t border-dashed border-bleu-light/50">
            {/* Visuel Produit */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative bg-white rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-2 border-bleu-light/30 max-w-[280px] md:max-w-full">
                <img src={product.heroImage} alt={product.name} className="w-full h-auto object-contain" />
                <div className="absolute -bottom-3 right-4 bg-bleu text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  100% Naturel
                </div>
              </div>
            </div>

            {/* Actions et Réassurance */}
            <div className="md:col-span-7 space-y-6">
              {/* Bloc de réassurance */}
              <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-2xl p-4 md:p-5 space-y-2.5 shadow-sm">
                {[
                  'Paiement à la livraison',
                  'Livraison partout au Burkina Faso',
                  'Produit naturel inspiré du savoir-faire traditionnel'
                ].map((reassur, index) => (
                  <div key={index} className="flex items-start gap-2 text-left">
                    <span className="text-emerald-600 font-bold mt-0.5 text-base leading-none">✓</span>
                    <span className="text-emerald-900/90 font-medium text-xs md:text-sm leading-snug">{reassur}</span>
                  </div>
                ))}
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={scrollToOrder}
                  className="w-full bg-rouge hover:bg-rouge-mid text-white py-4 md:py-4.5 rounded-xl text-base md:text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wide px-4"
                >
                  JE DÉCOUVRE LA POUDRE DU VIEUX KOUKA
                </button>
                
                <button
                  onClick={scrollToTestimonies}
                  className="w-full bg-white hover:bg-slate-50 text-bleu border-2 border-bleu py-3 md:py-3.5 rounded-xl text-sm md:text-base font-extrabold transition-all uppercase"
                >
                  VOIR LES TÉMOIGNAGES
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU PREMIUM RÉASSURANCE — sous le Hero */}
      <section className="bg-white py-6 border-b border-bleu-light/20">
        <div className="container-kouka max-w-5xl px-4">
          <div className="bg-gradient-to-br from-bleu-bg via-white to-bleu-bg rounded-2xl border-2 border-bleu/15 shadow-sm p-4 md:p-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {[
                { icon: '🌿', label: 'Recette traditionnelle du Vieux Kouka' },
                { icon: '🚚', label: 'Livraison partout au Burkina Faso' },
                { icon: '💰', label: 'Paiement à la livraison' },
                { icon: '💬', label: 'Confirmation WhatsApp sous 2h' },
                { icon: '⭐', label: 'Clients satisfaits partout au Burkina' },
              ].map((r, i) => (
                <div key={i} className="flex md:flex-col items-center md:text-center gap-2 bg-white rounded-xl border border-bleu-light/30 p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                  <span className="text-2xl md:text-3xl shrink-0">{r.icon}</span>
                  <span className="text-[11px] md:text-xs font-bold text-bleu leading-tight">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MINI-DIAGNOSTIC déplacé ici (juste après le hero) */}
      <DiagnosticQuiz
        title="Votre situation actuelle ?"
        questions={[
          'Diabète récemment diagnostiqué',
          'Diabète ancien (plusieurs années)',
          'Glycémie élevée / instable',
          'Traitement actuel peu efficace',
        ]}
      />

      {/* POURQUOI CES SYMPTÔMES MÉRITENT VOTRE ATTENTION */}
      <section className="py-10 md:py-12 bg-bleu-bg">
        <div className="container-kouka max-w-4xl px-4">
          <div className="text-center mb-6">
            <span className="text-rouge text-xs font-bold uppercase tracking-widest">⚠️ À ne pas ignorer</span>
            <h2 className="text-bleu mt-2 text-xl md:text-2xl font-extrabold uppercase">
              Pourquoi ces symptômes méritent votre attention ?
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              Ces signes peuvent fortement impacter votre confort et votre qualité de vie au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: '⚡', t: 'Picotements fréquents', d: 'Mains et pieds qui fourmillent' },
              { icon: '🔥', t: 'Pieds qui chauffent', d: 'Sensation de brûlure persistante' },
              { icon: '💧', t: 'Soif excessive', d: 'Bouche sèche en permanence' },
              { icon: '🌙', t: 'Réveils fréquents', d: 'Pour uriner la nuit' },
              { icon: '😴', t: 'Fatigue persistante', d: 'Même après une nuit complète' },
              { icon: '👁️', t: 'Vision floue', d: 'Difficulté à voir net' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-3 md:p-4 border border-bleu-light/40 shadow-sm">
                <div className="text-2xl md:text-3xl mb-1.5">{s.icon}</div>
                <div className="font-extrabold text-bleu text-sm md:text-base leading-tight">{s.t}</div>
                <div className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-snug">{s.d}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-6 py-3.5 rounded-xl text-base font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 transition-transform uppercase">
              Découvrir la solution naturelle
            </button>
          </div>
        </div>
      </section>

      {/* GIF test glycémie — urgence visuelle */}
      <section className="bg-white py-10 border-b border-bleu-light/20">
        <div className="container-kouka max-w-2xl text-center">
          <p className="text-xs uppercase tracking-widest text-bleu font-bold mb-3">🩸 Tu connais ce moment ?</p>
          <div className="rounded-2xl overflow-hidden shadow-lg border-[3px] border-bleu-light/40 inline-block">
            <img src="/images/anti-diabete-test-glycemie.gif" alt="Test de glycémie au doigt" className="w-full max-w-sm block mx-auto" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Piqûre tous les jours. Chiffres qui montent. <strong className="text-foreground">Tu mérites mieux qu'une vie de seringues.</strong>
          </p>
        </div>
      </section>

      {/* Auto-diagnostic supprimé (doublon avec hero + mini-diagnostic) */}

      {/* SOLUTION — fond bleu profond, contraste fort */}
      <section className="py-14 bg-gradient-to-br from-bleu to-bleu-mid text-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-bleu-light text-xs font-bold uppercase tracking-widest">🌿 La formule</span>
            <h2 className="text-white mt-2">Poudre Anti-Diabète du Vieux KOUKA</h2>
            <p className="text-white/85 max-w-xl mx-auto mt-3">
              Racines, écorces, feuilles récoltées au Burkina. Une formule transmise depuis 60 ans pour <strong>réguler la glycémie à la racine</strong>.
            </p>
          </div>

          <div className="bg-white text-foreground rounded-3xl overflow-hidden shadow-2xl">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA, thérapeute traditionnel" className="w-full max-h-96 object-cover bg-bleu-bg" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-bleu text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold">VK</div>
                <div>
                  <div className="font-extrabold text-bleu">Vieux KOUKA</div>
                  <div className="text-xs text-muted-foreground">Thérapeute traditionnel · Région des Kuilsés 🇧🇫</div>
                </div>
              </div>
              <p className="italic text-muted-foreground leading-relaxed text-sm">
                "Héritier d'un savoir transmis par son grand-père il y a +60 ans, le Vieux KOUKA récolte chaque plante lui-même — selon la lune et la région où elle atteint sa pleine puissance."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SACHET + BÉNÉFICES */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">💊 Le produit</span>
            <h2 className="text-bleu mt-2">Ce que t'apporte la Poudre Anti-Diabète</h2>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-or/15 text-foreground border border-or/40 text-[11px] md:text-xs font-extrabold px-3 py-1.5 rounded-full">⭐ Recette traditionnelle du Vieux Kouka</span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-500/30 text-[11px] md:text-xs font-extrabold px-3 py-1.5 rounded-full">🌿 100% naturel</span>
              <span className="inline-flex items-center gap-1.5 bg-bleu-bg text-bleu border border-bleu/30 text-[11px] md:text-xs font-extrabold px-3 py-1.5 rounded-full">🇧🇫 Utilisé par de nombreuses familles burkinabè</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-bleu-light/40 bg-bleu-bg">
              <img src="/images/anti-diabete-sachet-clean.png" alt="Sachet Poudre Anti-Diabète du Vieux KOUKA" className="w-full max-h-[420px] object-contain p-4" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { t: 'Glycémie stabilisée', d: 'Fini les pics et chutes' },
                { t: 'Pancréas renforcé', d: 'Insuline mieux sécrétée' },
                { t: 'Énergie restaurée', d: 'Fini la fatigue chronique' },
                { t: 'Vision plus claire', d: 'En quelques jours' },
                { t: 'Picotements stoppés', d: 'Mains et pieds soulagés' },
                { t: 'Appétit régulé', d: 'Poids sain maintenu' },
              ].map((b) => (
                <div key={b.t} className="bg-bleu-bg border border-bleu-light/40 rounded-xl p-4">
                  <div className="font-extrabold text-bleu flex items-center gap-2">✓ {b.t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* POSOLOGIE + bandeau bénéfices */}
      <section className="py-12 bg-white">
        <div className="container-kouka max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="bg-bleu-bg border-l-4 border-bleu rounded-r-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-bleu font-extrabold mb-2">💊 Posologie</p>
              <p className="text-foreground text-base leading-relaxed">
                <strong>Sucée une pincée de poudre avant et après chaque repas.</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Simple, sans préparation. Tu gardes la pincée dans la bouche et tu laisses fondre.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-bleu-light/30">
              <img src="/images/anti-diabete-bandeau.png" alt="Dites adieu aux variations de glycémie" className="w-full block" />
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE — style chronologie médicale verticale */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">📅 Suivi clinique</span>
            <h2 className="text-bleu mt-2">En 7 jours, ta glycémie se stabilise</h2>
          </div>

          <div className="relative pl-8 border-l-[3px] border-bleu/30">
            {[
              { d: 'Jour 1-2', t: 'La soif diminue', desc: 'Tu bois moins, tu te lèves moins la nuit. Premier signe que ton corps régule.' },
              { d: 'Jour 3-4', t: "L'énergie revient", desc: 'Fatigue lourde qui disparaît. Picotements en baisse. Tu te lèves en forme.' },
              { d: 'Jour 5-6', t: 'Vision plus claire', desc: "Pics qui s'espacent, vision nette. Ton corps reprend le dessus." },
              { d: 'Jour 7', t: 'Glycémie stabilisée', desc: 'En seulement 7 jours, glycémie maîtrisée et énergie restaurée — sans dépendance, sans effet secondaire.' },
            ].map((x, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div className="absolute -left-[42px] w-6 h-6 rounded-full bg-bleu border-4 border-white shadow-md" />
                <div className="bg-bleu-bg rounded-xl p-4 border border-bleu-light/30">
                  <div className="text-[11px] font-extrabold text-bleu uppercase tracking-wider">{x.d}</div>
                  <div className="font-extrabold text-foreground mt-1">{x.t}</div>
                  <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{x.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-or/10 border-l-4 border-or rounded-r-xl p-4 text-sm">
            <strong>⚠️ Important :</strong> ne stoppe pas brutalement tes médicaments. Continue à mesurer ta glycémie — tu verras les chiffres baisser progressivement.
          </div>
        </div>
      </section>

      {/* PREUVE SOCIALE — WhatsApp + Facebook */}
      <div id="testimonies-section">
        <SocialProofChat />
      </div>

      <section className="py-8 bg-bleu-bg">
        <div className="container-kouka max-w-3xl">
          <div className="bg-white border-2 border-bleu rounded-2xl p-5 text-center">
            <p className="font-extrabold text-bleu mb-1">💵 Paiement uniquement à la livraison</p>
            <p className="text-sm">Tu ne paies <strong>RIEN à l'avance</strong>. Le livreur passe chez toi, tu vérifies le colis, et tu règles <strong>cash à la réception</strong>. Aucun risque.</p>
          </div>

          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              Commander le traitement complet
            </button>
          </div>
        </div>
      </section>

      {/* COMPARATIF — style tableau clinique */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">⚖️ Comparatif</span>
            <h2 className="text-bleu mt-2">Pourquoi cette poudre plutôt qu'autre chose ?</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-bleu-light/30 shadow-sm">
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-bleu text-white">
                  <th className="text-left px-3 py-3 font-bold">Critère</th>
                  <th className="px-3 py-3 font-extrabold bg-bleu-mid">Poudre Anti-Diabète</th>
                  <th className="px-3 py-3 font-bold">Antidiabétiques</th>
                  <th className="px-3 py-3 font-bold">Suivi clinique</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Coût total cure', '25 000 F', '15 000 F/mois à vie', '30 000 F/sem.'],
                  ['Traite la cause', '✅ Oui', '❌ Calme', '⚠️ Surveille'],
                  ['Effets secondaires', '✅ Aucun', '⚠️ Foie / reins', 'Aucun'],
                  ['Dépendance', '✅ Aucune', '❌ À vie', '—'],
                  ['Énergie restaurée', '✅ Oui', '❌ Non', '❌ Non'],
                  ['Discrétion', '✅ 100%', 'Pharmacie', 'Clinique'],
                  ['Paiement', '✅ À la livraison', '❌ D\'avance', '❌ D\'avance'],
                ].map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bleu-bg/40'}>
                    <td className="px-3 py-3 font-bold text-foreground">{r[0]}</td>
                    <td className="px-3 py-3 text-center font-bold text-bleu bg-bleu-bg/60">{r[1]}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{r[2]}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-bleu-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">❓ FAQ</span>
            <h2 className="text-bleu mt-2">Questions fréquentes</h2>
          </div>
          <FAQ
            items={[
              { q: "J'ai peur que ça ne fonctionne pas", a: "Beaucoup de clients voient leur glycémie se stabiliser après la cure complète. Suis le programme recommandé (3 sachets) et donne au produit le temps d'agir en profondeur." },
              { q: "J'ai déjà essayé plusieurs produits sans résultat", a: "Les produits classiques traitent le symptôme. La Poudre Anti-Diabète du Vieux KOUKA agit sur le pancréas et la régulation naturelle de l'insuline." },
              { q: "Je peux arrêter mes médicaments ?", a: "<strong>Non, pas brutalement.</strong> Continue ton traitement et mesure ta glycémie. Tu verras les chiffres baisser progressivement. Parle ensuite à ton médecin." },
              { q: "En combien de temps je vois les résultats ?", a: "<strong>Dès la 1ère semaine :</strong> la soif diminue. <strong>Après 2-3 semaines :</strong> énergie restaurée, picotements qui disparaissent, glycémie stabilisée." },
              { q: "Y a-t-il des effets secondaires ?", a: "Aucun. 100% naturelle — racines, écorces, feuilles africaines. Aucune dépendance." },
              { q: "Comment je paie ?", a: "<strong>Cash à la livraison uniquement.</strong> Tu reçois, tu vérifies, tu paies." },
              { q: "La livraison est-elle discrète ?", a: "Oui — emballage neutre, sans logo. Personne ne devine ce que tu as commandé." },
              { q: "Et si ça ne marche pas pour moi ?", a: "Contacte-nous : nous t'accompagnons et étudions chaque situation. Notre objectif est ta satisfaction." },
            ]}
          />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              Commander le traitement complet
            </button>
          </div>
        </div>
      </section>

      {/* VALUE STACK — Pourquoi commander maintenant */}
      <section className="py-12 bg-gradient-to-b from-white to-bleu-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">🎁 Ce que tu reçois</span>
            <h2 className="text-bleu mt-2">Tout est inclus dans ta cure complète</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-bleu-light/40">
            <ul className="divide-y divide-bleu-light/30">
              {[
                { t: '3 sachets de Poudre Anti-Diabète', v: '25 000 F' },
                { t: 'Posologie personnalisée par WhatsApp', v: 'Offert' },
                { t: 'Suivi pendant toute la cure', v: 'Offert' },
                { t: 'Livraison à domicile (Ouaga & Niamey)', v: 'Offert' },
                { t: 'Paiement à la livraison — zéro risque', v: '✓' },
              ].map((x, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="text-bleu">✓</span> {x.t}
                  </span>
                  <span className="text-sm font-extrabold text-bleu whitespace-nowrap">{x.v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t-2 border-bleu flex items-center justify-between">
              <span className="font-extrabold text-foreground">Total à payer</span>
              <span className="text-3xl font-extrabold text-bleu">25 000 F</span>
            </div>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white rounded-xl p-3 border border-bleu-light/40 text-center">
              <div className="text-2xl">🚚</div>
              <div className="text-[11px] font-bold text-bleu mt-1">Livraison rapide</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-bleu-light/40 text-center">
              <div className="text-2xl">💵</div>
              <div className="text-[11px] font-bold text-bleu mt-1">Cash à la livraison</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-bleu-light/40 text-center">
              <div className="text-2xl">🤝</div>
              <div className="text-[11px] font-bold text-bleu mt-1">Suivi WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Programme complet" supprimée — doublon avec "Tout est inclus" */}

      <OfferComparisonTable product={product} />

      <ReassuranceBar />

      {/* Bloc 2+1 isolé supprimé — déjà présent dans "Comparez les 3 offres" */}

      {/* COMMENT SE PASSE LA COMMANDE */}
      <section className="py-10 bg-white">
        <div className="container-kouka max-w-3xl px-4">
          <div className="text-center mb-6">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">📦 Processus simple</span>
            <h2 className="text-bleu mt-2 text-xl md:text-2xl font-extrabold uppercase">
              Comment se passe la commande ?
            </h2>
          </div>

          <ol className="grid gap-3 md:gap-4">
            {[
              { n: '1', t: 'Remplissez le formulaire', d: 'Nom, numéro, ville — 30 secondes' },
              { n: '2', t: 'Nous vous appelons', d: 'Un conseiller vous contacte rapidement' },
              { n: '3', t: 'Nous confirmons votre commande', d: 'Adresse et offre validées' },
              { n: '4', t: 'Nous expédions votre colis', d: 'Emballage discret et soigné' },
              { n: '5', t: 'Vous payez à la livraison', d: 'Cash, à la réception du colis' },
            ].map((s) => (
              <li key={s.n} className="flex items-start gap-3 bg-bleu-bg rounded-2xl p-3.5 md:p-4 border border-bleu-light/40">
                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-bleu text-white font-extrabold flex items-center justify-center shadow">{s.n}</div>
                <div className="min-w-0">
                  <div className="font-extrabold text-bleu text-sm md:text-base leading-tight">{s.t}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-2.5 md:gap-3 mt-5">
            {[
              '✓ Paiement à la réception',
              '✓ Livraison partout au Burkina Faso',
              '✓ Confirmation avant expédition',
              '✓ Assistance WhatsApp',
            ].map((r, i) => (
              <div key={i} className="bg-emerald-50 border border-emerald-500/30 text-emerald-900 text-[11px] md:text-xs font-bold px-3 py-2.5 rounded-xl text-center leading-tight">
                {r}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition avant le formulaire */}
      <section className="py-6 bg-gradient-to-b from-white to-bleu-bg">
        <div className="container-kouka max-w-2xl px-4 text-center">
          <p className="text-bleu text-lg md:text-xl font-extrabold leading-tight">
            ⏱️ Tu es à 2 minutes de commencer ta cure.
          </p>
          <p className="text-foreground text-sm md:text-base mt-2 leading-relaxed">
            Remplis tes infos — on te contacte sur <strong>WhatsApp sous 2h</strong> pour confirmer ta livraison.
          </p>
          <p className="text-rouge text-sm font-bold mt-2">💵 Tu ne paies rien maintenant.</p>
        </div>
      </section>

      <ProductForm product={product} />


      

      <section className="py-8 bg-white border-t border-bleu-light/20">
        <div className="container-kouka text-center">
          <Link to="/" className="text-bleu font-bold text-sm">← Voir aussi : Poudre KOUKA (hémorroïdes & ulcères)</Link>
        </div>
      </section>
    </div>
  );
}
