import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { ANTI_DIABETE } from '@/lib/products';
import { UrgencyBadge } from '@/components/anti-diabete/UrgencyBadge';
import { StickyOfferBar } from '@/components/anti-diabete/StickyOfferBar';
import { SocialProofChat } from '@/components/anti-diabete/SocialProofChat';

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

function AntiDiabetePage() {
  const product = ANTI_DIABETE;
  const stock = useDynamicStock('anti-diabete', 16);

  return (
    <div className="bg-bleu-bg pb-32">
      <StickyOfferBar stock={stock} />
      <VisitTracker page="anti-diabete" />

      {/* Bandeau bleu médical */}
      <div className="bg-bleu text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🩺 Traitement complet recommandé · Livraison Ouaga & Niamey · Stock limité : <b className="text-bleu-light">{stock}</b>
      </div>

      {/* HERO — fond bleu/blanc, style "fiche médicale" */}
      <section className="bg-gradient-to-b from-bleu-bg via-white to-bleu-bg py-12 border-b-[3px] border-bleu-light/40">
        <div className="container-kouka">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-bleu text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
              🩺 Recette traditionnelle · 60+ ans
            </span>
            <h1 className="text-bleu mb-3 leading-tight">
              Poudre Anti-Diabète du Vieux KOUKA<br />
              <span className="text-foreground text-[0.85em]">Guérir du Diabète en un temps record sans dépenser une fortune</span>
            </h1>
            <p className="text-muted-foreground mb-5 text-base leading-relaxed">
              1 sachet pour réguler ta glycémie en profondeur — naturellement,
              avec la formule du Vieux KOUKA.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-bleu mb-6">
              <span className="bg-white border border-bleu-light/40 px-2.5 py-1 rounded-full">🌿 100% plantes</span>
              <span className="bg-white border border-bleu-light/40 px-2.5 py-1 rounded-full">🇧🇫 Burkina</span>
              <span className="bg-white border border-bleu-light/40 px-2.5 py-1 rounded-full">🩺 Sans dépendance</span>
            </div>

            {/* OFFRE UNIQUE */}
            <div className="relative bg-white border-[3px] border-bleu rounded-3xl p-6 shadow-[0_12px_30px_rgba(31,108,159,0.18)] max-w-xl mx-auto">
              <div className="text-[11px] uppercase font-extrabold text-bleu tracking-wider mt-2 mb-1">
                Anti-Diabète du Vieux KOUKA
              </div>
              <div className="text-2xl font-extrabold text-foreground leading-tight">
                1 sachet
              </div>
              <div className="text-4xl font-extrabold text-bleu mt-2">12 500 FCFA</div>
              <ul className="text-left text-sm text-foreground mt-4 space-y-1.5 max-w-xs mx-auto">
                <li>✔ 100% plantes du Burkina</li>
                <li>✔ Régule ta glycémie naturellement</li>
                <li>✔ Sans dépendance</li>
                <li>✔ Cash à la livraison</li>
              </ul>
              <button
                onClick={scrollToOrder}
                className="mt-5 w-full bg-rouge text-white py-4 rounded-xl text-base font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.45)] hover:-translate-y-0.5 transition-transform"
              >
                Je commande maintenant
              </button>
              <p className="text-[11px] text-muted-foreground mt-2">📦 Livraison Ouaga & Niamey · Cash à la livraison</p>
              <div className="mt-3 flex justify-center">
                <UrgencyBadge stock={stock} />
              </div>
            </div>
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

      {/* SYMPTÔMES — style "diagnostic médical" */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">📋 Auto-diagnostic</span>
            <h2 className="text-bleu mt-2">Reconnais-tu ces signes ?</h2>
            <p className="text-muted-foreground text-sm mt-2">Coche ce que tu vis. Si 3+ → ta glycémie n'est pas sous contrôle.</p>
          </div>

          <div className="bg-bleu-bg border-l-4 border-bleu rounded-r-2xl p-6 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Picotements aux mains et pieds',
                'Soif constante, même après avoir bu',
                'Toilettes la nuit (3 fois +)',
                'Fatigue dès le réveil',
                'Vision qui devient floue',
                'Glycémie qui monte/descend',
                'Plaies qui cicatrisent mal',
                'Perte de poids inexpliquée',
                'Démangeaisons intimes / peau',
              ].map((s) => (
                <label key={s} className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-bleu" />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-rouge-light border-l-4 border-rouge rounded-r-2xl p-5">
            <p className="font-extrabold text-rouge mb-2">⚠️ Sans intervention :</p>
            <p className="text-sm leading-relaxed">
              Reins, cœur, yeux atteints · plaies du pied → amputation · coma diabétique · médicaments à vie · dialyse.
            </p>
          </div>

          <div className="text-center mt-7">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              Commander le traitement complet
            </button>
          </div>
        </div>
      </section>

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
      <SocialProofChat />

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

      <section className="py-10 bg-white border-t border-bleu-light/20">
        <div className="container-kouka max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-bleu font-bold mb-2">💊 Programme complet</p>
          <h3 className="text-bleu mb-2">Traitement complet — 3 sachets · 25 000 FCFA</h3>
          <p className="text-sm text-muted-foreground mb-4">L'option la plus choisie pour des résultats durables. Stock limité — restant : <b className="text-rouge">{stock}</b></p>
          <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform pulse-ring">
            Commander le traitement complet
          </button>
          <p className="text-xs text-muted-foreground mt-3">📦 Livraison à Ouaga & Niamey · Cash à la livraison</p>
          <div className="mt-4 flex justify-center">
            <UrgencyBadge stock={stock} />
          </div>
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
