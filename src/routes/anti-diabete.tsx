import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { ANTI_DIABETE } from '@/lib/products';

const TESTIMONIAL_AUDIOS: { src: string; type: string; label: string }[] = [
  { src: '/audio/anti-diabete/temoignage1.mp3', type: 'audio/mpeg', label: 'Cliente — glycémie redescendue après 2 semaines' },
  { src: '/audio/anti-diabete/temoignage2.mp3', type: 'audio/mpeg', label: 'Client — fatigue et soif disparues' },
  { src: '/audio/anti-diabete/temoignage3.opus', type: 'audio/ogg; codecs=opus', label: 'Cliente — picotements stoppés aux pieds' },
  { src: '/audio/anti-diabete/temoignage4.mp3', type: 'audio/mpeg', label: 'Client — vision plus claire après 3 semaines' },
  { src: '/audio/anti-diabete/temoignage5.mp3', type: 'audio/mpeg', label: 'Cliente — plus de réveils nocturnes pour uriner' },
  { src: '/audio/anti-diabete/temoignage6.mp3', type: 'audio/mpeg', label: 'Client — énergie restaurée, je remercie' },
  { src: '/audio/anti-diabete/temoignage7.mp3', type: 'audio/mpeg', label: 'Témoignage long — toute mon histoire avec le diabète' },
  { src: '/audio/anti-diabete/temoignage8.mp3', type: 'audio/mpeg', label: 'Cliente — chiffres redescendus, médecin surpris' },
  { src: '/audio/anti-diabete/temoignage9.mp3', type: 'audio/mpeg', label: 'Client — je recommande à toute ma famille' },
  { src: '/audio/anti-diabete/temoignage10.mp3', type: 'audio/mpeg', label: 'Cliente — appétit régulé, je revis' },
];


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
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

function AntiDiabetePage() {
  const product = ANTI_DIABETE;
  const stock = useDynamicStock('anti-diabete', 16);

  return (
    <div className="bg-bleu-bg pb-16 md:pb-0">
      <VisitTracker page="anti-diabete" />

      {/* Bandeau bleu médical */}
      <div className="bg-bleu text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🩺 Glycémie sous contrôle · Livraison gratuite Ouaga & Niamey · ⏰ Stock : <b className="text-bleu-light">{stock}</b> sachets
      </div>

      {/* HERO — fond bleu/blanc, style "fiche médicale" */}
      <section className="bg-gradient-to-b from-bleu-bg via-white to-bleu-bg py-12 border-b-[3px] border-bleu-light/40">
        <div className="container-kouka">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-bleu text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
              🩺 Recette traditionnelle · 60+ ans
            </span>
            <h1 className="text-bleu mb-3 leading-tight">
              Diabète ?<br />
              <em className="text-rouge not-italic">Reprends le contrôle.</em>
            </h1>
            <p className="text-muted-foreground mb-5 text-base leading-relaxed">
              Soif constante, fatigue, picotements, vision floue.<br />
              <strong className="text-foreground">Régule ta glycémie naturellement</strong> — sans dépendance, sans effets secondaires.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-bleu mb-5">
              <span className="bg-white border border-bleu-light/40 px-2.5 py-1 rounded-full">🌿 100% plantes</span>
              <span className="bg-white border border-bleu-light/40 px-2.5 py-1 rounded-full">🇧🇫 Burkina</span>
              <span className="bg-white border border-bleu-light/40 px-2.5 py-1 rounded-full">🩺 Sans dépendance</span>
            </div>

            {/* 3 OFFRES — style carte médicale */}
            <div className="bg-white border-2 border-bleu-light/30 rounded-2xl p-4 shadow-sm max-w-xl mx-auto">
              <div className="text-[11px] uppercase font-extrabold text-bleu tracking-wider mb-3 text-center">💊 Choisis ta cure</div>
              <div className="grid grid-cols-3 gap-2">
                {product.offers.map((o) => (
                  <button
                    key={o.id}
                    onClick={scrollToOrder}
                    className={`rounded-xl p-2.5 border-2 text-center transition-transform hover:-translate-y-0.5 ${
                      o.recommended
                        ? 'bg-bleu-bg border-rouge shadow-md ring-2 ring-rouge/20'
                        : 'bg-white border-bleu-light/30'
                    }`}
                  >
                    {o.recommended && (
                      <div className="text-[9px] font-extrabold text-rouge uppercase mb-0.5">⭐ Top</div>
                    )}
                    <div className="text-[11px] font-bold text-bleu leading-tight mb-1">
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
              <div className="text-[11px] text-muted-foreground mt-2 text-center">📦 Livraison gratuite · Cash à réception</div>
            </div>

            <button
              onClick={scrollToOrder}
              className="mt-4 w-full max-w-xl mx-auto bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_8px_24px_rgba(198,40,40,0.45)] hover:-translate-y-0.5 transition-transform block"
            >
              🩺 JE COMMANDE — JE PAIE À LA LIVRAISON
            </button>
            <p className="text-xs text-muted-foreground mt-2 text-center">🛡️ Glycémie stabilisée ou 100% remboursé</p>
          </div>

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
              🩺 Je veux la solution naturelle
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
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA" className="w-full max-h-72 object-cover" />
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

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {[
              { t: 'Glycémie stabilisée', d: 'Fini les pics et chutes' },
              { t: 'Pancréas renforcé', d: 'Insuline mieux sécrétée' },
              { t: 'Énergie restaurée', d: 'Fini la fatigue chronique' },
              { t: 'Vision plus claire', d: 'En quelques semaines' },
              { t: 'Picotements stoppés', d: 'Mains et pieds soulagés' },
              { t: 'Appétit régulé', d: 'Poids sain maintenu' },
            ].map((b) => (
              <div key={b.t} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
                <div className="font-extrabold text-bleu-light flex items-center gap-2">✓ {b.t}</div>
                <div className="text-sm text-white/85 mt-1">{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE — style chronologie médicale verticale */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">📅 Suivi clinique</span>
            <h2 className="text-bleu mt-2">Jour après jour, ton corps reprend</h2>
          </div>

          <div className="relative pl-8 border-l-[3px] border-bleu/30">
            {[
              { d: 'J1-J7', t: 'La soif diminue', desc: 'Tu bois moins, tu te lèves moins la nuit. Premier signe que ton corps régule.' },
              { d: 'J8-J14', t: "L'énergie revient", desc: 'Fatigue lourde qui disparaît. Picotements en baisse. Tu te lèves en forme.' },
              { d: 'J15-J21', t: 'Glycémie stabilisée', desc: "Pics qui s'espacent, vision plus claire. Ton corps reprend le dessus." },
              { d: 'Fin', t: 'Stabilité durable', desc: 'Glycémie maîtrisée, énergie restaurée. Sans dépendance, sans effet secondaire.' },
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

      {/* TÉMOIGNAGES — fond bleu pâle, audios + WhatsApp + preuves */}
      <section className="py-14 bg-bleu-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">🗣️ Témoignages clients</span>
            <h2 className="text-bleu mt-2">Ils ont essayé. Ils témoignent.</h2>
            <p className="text-muted-foreground text-sm mt-2">🔒 Messages WhatsApp réels · Audios non montés · Reçus vérifiables</p>
          </div>

          {/* Témoignages texte */}
          <div className="grid gap-4 mb-8">
            {[
              { txt: "Depuis 2 semaines ma glycémie est stable. Je ne me lève plus la nuit pour uriner. La fatigue a disparu. Merci au Vieux KOUKA.", auth: 'Client WhatsApp · Ouagadougou' },
              { txt: "Mes pieds picotaient depuis des mois. Après le traitement complet, c'est fini. Je recommande vraiment.", auth: 'Cliente WhatsApp · Bobo-Dioulasso' },
              { txt: "J'ai testé plein de produits sans résultat. La poudre du Vieux KOUKA, après 3 semaines, mes chiffres sont redescendus.", auth: 'Client WhatsApp · Niamey' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-l-4 border-bleu shadow-sm">
                <div className="text-or-light text-lg mb-2">★★★★★</div>
                <p className="italic text-muted-foreground leading-relaxed mb-3">"{t.txt}"</p>
                <div className="text-xs text-bleu font-bold">{t.auth}</div>
              </div>
            ))}
          </div>

          {/* AUDIOS clients — comme sur la page principale */}
          <p className="text-center text-sm text-bleu font-extrabold mb-3">
            🎙️ Messages audio originaux de clients
          </p>
          <div className="grid gap-3 mb-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-bleu-light/30 shadow-sm">
                <div className="font-bold text-bleu mb-2 text-sm">▶ Témoignage audio {n}</div>
                <audio controls preload="none" className="w-full">
                  <source src={`/audio/temoignage${n}.opus`} type="audio/ogg; codecs=opus" />
                </audio>
              </div>
            ))}
          </div>

          {/* Captures WhatsApp */}
          <p className="text-center text-sm text-bleu font-extrabold mb-3">
            📱 Captures WhatsApp — non modifiées
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <img key={n} loading="lazy" src={`/images/temo-wa${n}.webp`} alt={`Témoignage WhatsApp ${n}`} className="rounded-xl border border-bleu-light/30 w-full" />
            ))}
          </div>

          {/* Preuves de livraison */}
          <p className="text-center text-sm text-bleu font-extrabold mb-3">
            📦 Preuves de livraison
          </p>
          <div className="grid grid-cols-2 gap-3">
            <img loading="lazy" src="/images/preuve4.jpg" alt="Reçu de livraison" className="rounded-xl border border-bleu-light/30" />
            <img loading="lazy" src="/images/preuve5.jpg" alt="Reçu de livraison" className="rounded-xl border border-bleu-light/30" />
          </div>

          <div className="bg-white border-2 border-bleu rounded-2xl p-5 text-center mt-8">
            <p className="font-extrabold text-bleu mb-1">🛡️ Garantie "Stabilisé ou Remboursé"</p>
            <p className="text-sm">Tu suis le traitement complet sans amélioration ? <strong>Remboursement 100%, sans question.</strong></p>
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
                  <th className="px-3 py-3 font-extrabold bg-bleu-mid">Poudre KOUKA</th>
                  <th className="px-3 py-3 font-bold">Antidiabétiques</th>
                  <th className="px-3 py-3 font-bold">Suivi clinique</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Coût total cure', '16 000 F', '15 000 F/mois à vie', '30 000 F/sem.'],
                  ['Traite la cause', '✅ Oui', '❌ Calme', '⚠️ Surveille'],
                  ['Effets secondaires', '✅ Aucun', '⚠️ Foie / reins', 'Aucun'],
                  ['Dépendance', '✅ Aucune', '❌ À vie', '—'],
                  ['Énergie restaurée', '✅ Oui', '❌ Non', '❌ Non'],
                  ['Discrétion', '✅ 100%', 'Pharmacie', 'Clinique'],
                  ['Garantie', '✅ Remboursé', '❌ Non', '❌ Non'],
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
              { q: "J'ai peur que ça ne fonctionne pas", a: "Tous les jours nous recevons des témoignages de clients qui voient leur glycémie se stabiliser. Et si tu ne vois aucun résultat après le traitement complet, on te rembourse à 100%." },
              { q: "J'ai déjà essayé plusieurs produits sans résultat", a: "Les produits classiques traitent le symptôme. La Poudre Anti-Diabète du Vieux KOUKA agit sur le pancréas et la régulation naturelle de l'insuline." },
              { q: "Je peux arrêter mes médicaments ?", a: "<strong>Non, pas brutalement.</strong> Continue ton traitement et mesure ta glycémie. Tu verras les chiffres baisser progressivement. Parle ensuite à ton médecin." },
              { q: "En combien de temps je vois les résultats ?", a: "<strong>Dès la 1ère semaine :</strong> la soif diminue. <strong>Après 2-3 semaines :</strong> énergie restaurée, picotements qui disparaissent, glycémie stabilisée." },
              { q: "Y a-t-il des effets secondaires ?", a: "Aucun. 100% naturelle — racines, écorces, feuilles africaines. Aucune dépendance." },
              { q: "Comment je paie ?", a: "<strong>Cash à la livraison uniquement.</strong> Tu reçois, tu vérifies, tu paies." },
              { q: "La livraison est-elle discrète ?", a: "Oui — emballage neutre, sans logo. Personne ne devine ce que tu as commandé." },
              { q: "Et si ça ne marche pas pour moi ?", a: "<strong>Remboursement 100%.</strong> Photo du sachet vide → remboursement intégral, sans débat." },
            ]}
          />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🩺 OK, je commande maintenant
            </button>
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
