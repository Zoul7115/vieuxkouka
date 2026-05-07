import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ComparisonTable } from '@/components/ComparisonTable';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { ANTI_DIABETE } from '@/lib/products';

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
    <div className="bg-background pb-16 md:pb-0">
      <VisitTracker page="anti-diabete" />

      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🩸 Glycémie stabilisée · Livraison gratuite Ouaga & Niamey · ⏰ Stock restant : <b className="text-[oklch(0.85_0.08_145)]">{stock}</b> sachets
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-[3px] border-[oklch(0.85_0.06_145)]">
        <div className="container-kouka text-center">
          <span className="inline-block bg-vert-mid text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            🌿 100% naturel · Sans effet secondaire
          </span>

          <h1 className="text-vert mb-3">
            Diabète, glycémie instable ?<br />
            <em className="text-rouge not-italic">Reprends le contrôle naturellement.</em>
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto mb-5 text-base leading-relaxed">
            Picotements, soif excessive, vision floue, fatigue constante — <strong className="text-foreground">la Poudre Anti-Diabète du Vieux KOUKA régule ta glycémie à la racine</strong>, sans dépendance.
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
            <span>✅ Remboursé si pas de résultat</span>
          </div>

          <button
            onClick={scrollToOrder}
            className="w-full bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform"
          >
            🩸 JE COMMANDE — JE PAIE À LA LIVRAISON
          </button>
          <p className="text-sm text-muted-foreground mt-3">🛡️ Garantie SOULAGÉ ou REMBOURSÉ 100%</p>
        </div>
      </section>

      {/* SYMPTÔMES — adapté de adieudiabete.com */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Tu vis ça <span className="text-rouge">tous les jours</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 text-sm">Lis honnêtement. Coche ce qui te concerne.</p>
          <div className="bloc bloc-r">
            <p className="text-rouge font-extrabold mb-3 text-lg">Les signes du diabète qui s'installe :</p>
            <ul className="ckl ckl-r">
              <li>Tes pieds et tes mains <strong>picotent</strong> sans raison — parfois ils s'engourdissent</li>
              <li>Tu vas aux toilettes <strong>uriner souvent</strong>, même la nuit</li>
              <li>Tu as <strong>soif tout le temps</strong>, même après avoir bu</li>
              <li>Une <strong>fatigue constante</strong> — tu te lèves déjà épuisé</li>
              <li>Ta <strong>vision devient floue</strong> par moments</li>
              <li>Ta <strong>glycémie monte et descend</strong> sans contrôle</li>
              <li>Tes <strong>plaies cicatrisent très lentement</strong></li>
              <li>Tu <strong>perds du poids</strong> alors que tu manges plus</li>
              <li>Des <strong>démangeaisons</strong> au niveau intime ou sur la peau</li>
            </ul>
          </div>

          <div className="bloc bloc-or mt-5">
            <p className="text-[oklch(0.40_0.10_82)] font-extrabold mb-3">⚠️ Ce qui t'attend si tu ne fais rien :</p>
            <ul className="ckl">
              <li>Diabète non maîtrisé → atteinte des reins, du cœur, des yeux</li>
              <li>Plaies du pied qui s'infectent → risque d'amputation</li>
              <li>Coma diabétique — urgence vitale</li>
              <li>Médicaments à vie, dialyses, insuline forcée</li>
              <li>Tu te sens mal dans ta peau, tu ne dors plus</li>
            </ul>
          </div>

          <p className="text-center italic mt-6 text-muted-foreground max-w-lg mx-auto">
            "Tu n'y es pour rien. Tu as cherché longtemps une solution. Tu ne veux pas finir entre l'hôpital et la pharmacie."
          </p>

          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🩸 Je veux la solution naturelle
            </button>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="sec bg-vert-bg">
        <div className="container-kouka">
          <h2 className="text-center mb-3">La solution : <span className="text-vert">{product.name}</span></h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Une formule traditionnelle africaine — racines, écorces et feuilles récoltées au Burkina Faso —
            pour <strong>réguler la glycémie, soutenir le pancréas et restaurer ton énergie</strong> naturellement.
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
                "Héritier d'un savoir transmis par son grand-père il y a plus de 60 ans, le Vieux KOUKA récolte
                lui-même chaque plante de sa formule anti-diabète — selon les cycles de la lune et les régions où elles atteignent leur pleine puissance."
              </p>
            </div>
          </div>

          <div className="bloc mt-4">
            <h3 className="text-vert mb-3">🌿 Résultats obtenus avec la Poudre Anti-Diabète</h3>
            <ul className="ckl">
              <li><strong>Maintient une glycémie normale</strong> — fini les pics et les chutes</li>
              <li><strong>Renforce le pancréas</strong> — l'organe qui produit l'insuline</li>
              <li><strong>Optimise la sécrétion d'insuline</strong> naturellement</li>
              <li><strong>Régule l'appétit</strong> — pour maintenir un poids sain</li>
              <li><strong>Restaure l'énergie</strong> — fini la fatigue chronique</li>
              <li><strong>Améliore la vision</strong> — vision plus claire en quelques semaines</li>
              <li><strong>Stoppe les picotements</strong> aux mains et aux pieds</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ce qui se passe <span className="text-vert">jour après jour</span></h2>
          <p className="text-center text-muted-foreground mb-7">Résultats observés par nos clients sous traitement complet</p>

          <div className="grid">
            {[
              { d: 'J1', s: 'à J7', t: 'La soif diminue', desc: "Tu bois moins, tu vas moins souvent aux toilettes la nuit. Premier signe que ton corps régule." },
              { d: 'J8', s: 'à J14', t: 'Énergie qui revient', desc: 'La fatigue lourde disparaît. Tu te lèves le matin avec plus de force. Les picotements diminuent.' },
              { d: 'J15', s: 'à J21', t: 'Glycémie qui se stabilise', desc: "Les pics s'espacent. Ta vision s'éclaircit. Tu sens que ton corps reprend le dessus." },
              { d: 'FIN', s: 'cure', t: 'Stabilité durable', desc: 'Glycémie maîtrisée, énergie restaurée, vision claire. Sans dépendance, sans effet secondaire.' },
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

          <div className="bloc bloc-ok mt-5">
            <p><strong>⚠️ Important :</strong> ne stoppe pas brutalement tes médicaments si tu es sous traitement. Continue à mesurer ta glycémie — tu verras les chiffres baisser progressivement.</p>
          </div>
        </div>
      </section>

      {/* IMAGINE */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-6">Imagine-toi… <span className="text-vert">dans 3 semaines</span></h2>
          <div className="grid gap-3 max-w-lg mx-auto">
            {[
              'Imagine-toi avec une glycémie stable et maîtrisée',
              'Imagine-toi avoir des nuits paisibles, sans te lever 3 fois pour uriner',
              'Imagine-toi retrouver ton énergie, comme avant',
              'Imagine-toi ne plus avoir peur de finir aux urgences',
              'Imagine-toi vivre sans stress, sans angoisse permanente',
            ].map((t) => (
              <div key={t} className="bloc bloc-ok">
                <p className="font-bold">✨ {t}</p>
              </div>
            ))}
          </div>

          <div className="bloc bloc-or mt-7">
            <p className="font-bold mb-2">Bien entendu, tu peux aussi :</p>
            <ul className="ckl">
              <li>Aller dans une clinique et dépenser une fortune en consultations à répétition</li>
              <li>Voir un spécialiste qui te suivra à 30 000 FCFA la consultation hebdomadaire</li>
              <li>Te tourner vers des tisanes sans effet réel</li>
            </ul>
            <p className="mt-3 italic">Ou faire le choix d'une formule qui a déjà fait ses preuves.</p>
          </div>

          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🩸 Je veux essayer maintenant
            </button>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Ils ont essayé. <span className="text-vert">Ils témoignent.</span></h2>
          <p className="text-center text-muted-foreground mb-7 text-sm">
            🔒 Messages WhatsApp réels de clients du Vieux KOUKA
          </p>

          <div className="grid gap-4 max-w-lg mx-auto">
            {[
              { txt: "Depuis 2 semaines, ma glycémie est stable. Je ne me lève plus la nuit pour uriner. La fatigue a disparu. Merci au Vieux KOUKA.", auth: 'Client WhatsApp · Ouagadougou' },
              { txt: "Mes pieds picotaient depuis des mois. Après le traitement complet, c'est fini. Je recommande vraiment.", auth: 'Cliente WhatsApp · Bobo-Dioulasso' },
              { txt: "J'ai testé plein de produits sans résultat. La poudre du Vieux KOUKA, après 3 semaines, mes chiffres sont redescendus. Je continue.", auth: 'Client WhatsApp · Niamey' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-2 border-vert-bg shadow-sm">
                <div className="text-or-light text-lg mb-2">★★★★★</div>
                <p className="italic text-muted-foreground leading-relaxed mb-3">"{t.txt}"</p>
                <div className="text-xs text-muted-foreground font-bold">{t.auth}</div>
              </div>
            ))}
          </div>

          <div className="bg-vert-bg border-2 border-vert-mid rounded-2xl p-5 text-center mt-7 max-w-lg mx-auto">
            <p className="font-bold mb-1">🛡️ Garantie "Soulagé ou Remboursé"</p>
            <p className="text-sm">Tu suis le traitement complet sans amélioration ? <strong>Remboursement 100%, sans question.</strong> Tu testes sans aucun risque.</p>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section className="sec bg-vert-bg/30">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Pourquoi cette poudre <span className="text-vert">plutôt qu'autre chose</span> ?</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-lg mx-auto">
            Compare honnêtement avec les autres approches.
          </p>
          <ComparisonTable
            rows={[
              { label: 'Coût total cure', kouka: '16 000 F', meds: '15 000 F/mois à vie', surgery: '30 000 F/semaine' },
              { label: 'Traite la cause', kouka: '✅ Oui', meds: '❌ Calme', surgery: '⚠️ Surveille' },
              { label: 'Effets secondaires', kouka: '✅ Aucun', meds: '⚠️ Foie / reins', surgery: 'Aucun' },
              { label: 'Dépendance', kouka: '✅ Aucune', meds: '❌ À vie', surgery: '—' },
              { label: 'Énergie restaurée', kouka: '✅ Oui', meds: '❌ Non', surgery: '❌ Non' },
              { label: 'Discrétion', kouka: '✅ 100%', meds: 'Pharmacie', surgery: 'Clinique' },
              { label: 'Garantie', kouka: '✅ Remboursé', meds: '❌ Non', surgery: '❌ Non' },
            ]}
            productLabel="🩸 Poudre KOUKA"
            medsLabel="Antidiabétiques"
            surgeryLabel="Suivi clinique"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Questions fréquentes</h2>
          <FAQ
            items={[
              { q: "J'ai peur que ça ne fonctionne pas", a: "Rassure-toi : tous les jours nous recevons des témoignages de clients qui voient leur glycémie se stabiliser. Et si tu ne vois aucun résultat après le traitement complet, on te rembourse à 100% — sans question." },
              { q: "J'ai déjà essayé plusieurs produits sans résultat", a: "C'est justement parce que les produits classiques traitent le symptôme et pas la cause. La Poudre Anti-Diabète du Vieux KOUKA agit sur le pancréas et la régulation naturelle de l'insuline. Des centaines de clients ont déjà constaté la différence." },
              { q: "Je peux arrêter mes médicaments ?", a: "<strong>Non, pas brutalement.</strong> Continue ton traitement médical et mesure ta glycémie. Tu verras les chiffres baisser progressivement. Parle ensuite avec ton médecin pour ajuster les doses." },
              { q: "En combien de temps je vois les résultats ?", a: "<strong>Dès la 1ère semaine :</strong> la soif diminue, tu urines moins la nuit. <strong>Après 2-3 semaines :</strong> énergie restaurée, picotements qui disparaissent, glycémie qui se stabilise. Pour les cas anciens, prévois la cure complète (pack 2+1)." },
              { q: "Y a-t-il des effets secondaires ?", a: "Aucun. 100% naturelle — racines, écorces et feuilles africaines. Aucun produit chimique, aucune dépendance." },
              { q: "Comment je paie ?", a: "<strong>Cash à la livraison uniquement.</strong> Tu reçois ton colis, tu vérifies, tu paies. Pas d'avance, pas de carte bancaire, pas de risque." },
              { q: "La livraison est-elle vraiment discrète ?", a: "Oui — emballage neutre, sans logo, sans mention du produit. Personne ne peut deviner ce que tu as commandé." },
              { q: "Et si ça ne marche pas pour moi ?", a: "<strong>Remboursement 100%.</strong> Tu suis le traitement complet sans résultat ? Tu nous envoies une photo du sachet vide → on te rembourse intégralement, sans débat." },
            ]}
          />
          <div className="text-center mt-6">
            <button onClick={scrollToOrder} className="bg-rouge text-white px-8 py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.40)] hover:-translate-y-0.5 transition-transform">
              🩸 OK, je commande maintenant
            </button>
          </div>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="sec bg-cream-2">
        <div className="container-kouka text-center">
          <Link to="/" className="text-vert-mid font-bold text-sm">← Voir aussi : Poudre KOUKA (hémorroïdes & ulcères)</Link>
        </div>
      </section>
    </div>
  );
}
