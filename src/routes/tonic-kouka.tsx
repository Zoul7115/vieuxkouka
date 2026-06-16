import { createFileRoute, Link } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { TONIC_KOUKA } from '@/lib/products';
import { SocialProofChatTonic } from '@/components/tonic/SocialProofChatTonic';
import { StickyOfferBarRecommended } from '@/components/StickyOfferBarRecommended';
import { useCtaVariant, trackCtaClick } from '@/hooks/useCtaVariant';
import { OfferComparisonTable } from '@/components/conversion/OfferComparisonTable';
import { ReassuranceBar } from '@/components/conversion/ReassuranceBar';

import bouteilleTonic from '@/assets/tonic-kouka-bouteille-reelle.png';
import etiquetteTonic from '@/assets/tonic-kouka-etiquette-reelle.png';

function preselectAndScroll(offerId: number, location = 'cta') {
  trackCtaClick(location);
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

const TAP = 'leading-none touch-manipulation select-none active:scale-[0.98] will-change-transform';

export const Route = createFileRoute('/tonic-kouka')({
  head: () => ({
    meta: [
      { title: TONIC_KOUKA.metaTitle },
      { name: 'description', content: TONIC_KOUKA.metaDesc },
      { property: 'og:title', content: TONIC_KOUKA.metaTitle },
      { property: 'og:description', content: TONIC_KOUKA.metaDesc },
      { property: 'og:image', content: bouteilleTonic },
    ],
  }),
  component: TonicKoukaPage,
});

function scrollToOrder() { preselectAndScroll(32, 'main-cta'); }

export function TonicKoukaPage() {
  const product = TONIC_KOUKA;
  const stock = useDynamicStock('tonic-kouka', 14);
  const cta = useCtaVariant();

  const RedCTA = ({ children, location = 'cta' }: { children: React.ReactNode; location?: string }) => (
    <button
      onClick={() => preselectAndScroll(32, location)}
      className={`bg-[#D94F00] text-white px-8 ${cta.sizeClass} rounded-xl font-extrabold shadow-[0_8px_24px_rgba(217,79,0,0.45)] hover:-translate-y-0.5 transition-transform border-2 border-white/20 ${TAP}`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-cream pb-[180px] sm:pb-32" style={{ paddingBottom: 'calc(180px + env(safe-area-inset-bottom))' }}>
      <StickyOfferBarRecommended product={product} stock={stock} unitLabel="bouteilles" />
      <VisitTracker page="tonic-kouka" />

      {/* 1. TOP BANNER */}
      <div className="bg-[#D94F00] text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🔴 STOCK LIMITÉ · Il reste <b>{stock}</b> flacons ce soir · 1 flacon = 5 maux soignés
      </div>

      {/* 2. HERO */}
      <section className="bg-gradient-to-b from-vert-bg via-white to-vert-bg py-8 md:py-12 border-b-[3px] border-vert/20">
        <div className="container-kouka">
          <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-8 md:items-center">
            {/* Bottle — full width on mobile, before text */}
            <div className="md:order-2 -mx-4 md:mx-0 mb-6 md:mb-0">
              <div className="relative">
                <img
                  src={bouteilleTonic}
                  alt="Bouteille Tonic du Vieux KOUKA"
                  className="w-full md:max-w-[320px] md:mx-auto rounded-none md:rounded-2xl shadow-2xl"
                  width={1024}
                  height={1280}
                />
                <div className="absolute top-3 right-3 bg-[#D94F00] text-white text-xs font-extrabold px-3 py-2 rounded-full rotate-[8deg] shadow-lg">
                  -40%
                </div>
              </div>
            </div>

            <div className="md:order-1 text-center md:text-left">
              <span className="inline-block bg-or text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                🌿 La vraie recette du Vieux
              </span>
              <h1 className="text-vert mb-2 leading-tight">Tonic du Vieux KOUKA</h1>
              <h2 className="text-foreground text-xl md:text-2xl font-extrabold mb-3 leading-snug">
                Tu souffres de 2, 3 ou 5 de ces maux à la fois ?
              </h2>
              <p className="text-muted-foreground mb-5 text-base leading-relaxed">
                Insomnie · Fatigue · Hypertension · Ulcères · Manque d'appétit — <strong className="text-foreground">1 seul flacon les soigne tous.</strong> Recette de plantes du Burkina. Payable à la réception.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs font-bold text-vert mb-3">
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">🌿 100% plantes</span>
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">🇧🇫 Fait au Burkina</span>
                <span className="bg-white border border-vert/20 px-2.5 py-1 rounded-full">💵 Tu paies à la livraison</span>
              </div>

              <p className="text-sm font-bold text-vert mb-6">⭐ Plus de 480 familles soulagées au Burkina et au Niger</p>

              <RedCTA location="hero-main">👉 JE VEUX MON TONIC — Je paie à la livraison</RedCTA>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MINI-DIAGNOSTIC */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">📋 Petit test</span>
            <h2 className="text-vert mt-2">Est-ce que tu as un de ces problèmes ?</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">Coche ce qui te concerne.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { fam: '😴 Sommeil & énergie', items: ['Insomnie, nuits sans sommeil', 'Fatigue qui ne part pas', 'Réveil sans force'] },
              { fam: '🍽️ Appétit & digestion', items: ['Manque d\'appétit', 'Ulcères, brûlures d\'estomac', 'Ventre lourd après manger'] },
              { fam: '🫀 Tension & circulation', items: ['Hypertension, vertiges', 'Maux de tête fréquents', 'Bouffées de chaleur'] },
              { fam: '💪 Force au quotidien', items: ['Tu te sens vidé sans raison', 'Pas envie de te lever le matin', 'Concentration faible'] },
            ].map((g) => (
              <div key={g.fam} className="bg-vert-bg border-l-4 border-vert rounded-r-xl p-5">
                <p className="font-extrabold text-vert mb-3">{g.fam}</p>
                <div className="space-y-2">
                  {g.items.map((it) => (
                    <label key={it} className="flex items-start gap-2 cursor-pointer text-sm">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-vert" />
                      <span>{it}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-vert-bg border-2 border-vert rounded-2xl p-5 text-center">
            <p className="font-extrabold text-vert">✅ Tu as coché 2 cases ou plus ? Le Tonic du Vieux KOUKA a été créé pour toi.</p>
          </div>

          <div className="text-center mt-6">
            <RedCTA location="diag">👉 JE COMMANDE MON TONIC — Paiement à la livraison</RedCTA>
          </div>
        </div>
      </section>

      {/* 4. URGENCE */}
      <section className="py-12 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="bg-[#FFF1ED] border-l-4 border-[#D94F00] rounded-r-2xl p-6 shadow-sm">
            <p className="font-extrabold text-[#D94F00] mb-3 text-lg">⚠️ Si tu ne fais rien aujourd'hui, voilà ce qui arrive :</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li>😴 <strong>Insomnie</strong> → fatigue qui ne part plus</li>
              <li>🍽️ <strong>Tu manges moins</strong> → ton corps s'affaiblit</li>
              <li>🔥 <strong>Les ulcères s'aggravent</strong> → douleurs permanentes</li>
              <li>❤️ <strong>L'hypertension monte</strong> → risque d'AVC et de paralysie</li>
            </ul>
            <p className="mt-4 text-sm italic text-muted-foreground">Beaucoup de familles attendent trop longtemps. Ne fais pas cette erreur.</p>
          </div>
          <div className="text-center mt-6">
            <RedCTA location="urgence">👉 JE COMMANDE MAINTENANT</RedCTA>
          </div>
        </div>
      </section>

      {/* 5. VIEUX KOUKA */}
      <section className="py-14 bg-gradient-to-br from-vert to-vert-mid text-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-or-light text-xs font-bold uppercase tracking-widest">🌿 La recette</span>
            <h2 className="text-white mt-2">L'homme derrière le Tonic</h2>
            <p className="text-white/85 max-w-xl mx-auto mt-3 leading-relaxed">
              Vieux KOUKA est guérisseur traditionnel depuis plus de 60 ans dans la région des Kuilsés.
              <br /><br />
              Sa recette secrète : <strong>racines, écorces et feuilles du Burkina qui nettoient le foie, les reins et le sang</strong> — et quand ces 3 organes fonctionnent bien, les 5 maux partent ensemble.
            </p>
          </div>

          <div className="bg-white text-foreground rounded-3xl overflow-hidden shadow-2xl">
            <img src="/images/vieux-kouka.jpg" alt="Le Vieux KOUKA" className="w-full max-h-96 object-cover bg-vert-bg" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-vert text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold">VK</div>
                <div>
                  <div className="font-extrabold text-vert">Vieux KOUKA</div>
                  <div className="text-xs text-muted-foreground">Guérisseur traditionnel · Région des Kuilsés 🇧🇫</div>
                </div>
              </div>
              <p className="italic text-muted-foreground leading-relaxed text-sm">
                "Le Tonic, c'est ma recette la plus forte. Il soigne 5 maux à la fois — sommeil, appétit, fatigue, ulcères, tension — parce qu'il réveille ce qui nettoie ton corps à l'intérieur."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LES 5 MAUX (fusionné) */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">💊 Le produit</span>
            <h2 className="text-vert mt-2">Les 5 maux que le Tonic soigne</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-or/40 bg-cream-2">
              <img src={etiquetteTonic} alt="Étiquette officielle Tonic du Vieux KOUKA" className="w-full max-h-[500px] object-contain p-4" width={1024} height={1536} loading="lazy" />
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { t: "Insomnie", d: "Endort naturellement · Tu te réveilles reposé" },
                { t: "Manque d'appétit", d: "Réveille l'estomac · Tu manges avec plaisir" },
                { t: "Fatigue chronique", d: "Ramène l'énergie · Tu tiens toute la journée" },
                { t: "Ulcères & brûlures", d: "Calme l'estomac · Mange sans souffrir" },
                { t: "Hypertension", d: "Fait baisser la tension · Protège le cœur" },
              ].map((b, i) => (
                <div key={b.t} className="bg-vert-bg border border-vert/20 rounded-xl p-4">
                  <div className="font-extrabold text-vert text-[15px] flex items-start gap-1">
                    <span className="text-or font-extrabold">{String(i + 1).padStart(2, '0')} · </span>
                    <span className="leading-tight">
                      <span className="text-vert font-extrabold">{b.t}</span> — <span className="font-semibold text-foreground">{b.d}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center italic mt-8 text-muted-foreground max-w-xl mx-auto text-sm">
            "Quand le foie, les reins et le sang travaillent bien — la plupart des maladies partent toutes seules. C'est ça, la médecine de chez nous."
          </p>
        </div>
      </section>

      {/* 7. POSOLOGIE */}
      <section className="py-12 bg-cream-2">
        <div className="container-kouka max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">💧 Comment prendre le Tonic</span>
            <h2 className="text-vert mt-2">Facile à prendre, une seule fois par jour</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border-l-4 border-vert rounded-r-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-vert font-extrabold mb-3">📏 La dose</p>
              <p className="text-foreground text-lg leading-relaxed font-bold">
                Adulte : <span className="text-vert">un verre et demi de thé</span>, le soir seulement, avant de manger.
              </p>
              <ul className="text-sm text-muted-foreground mt-4 space-y-1.5">
                <li>⚡ Bien secouer la bouteille avant de boire</li>
                <li>📅 Cure de 30 jours, puis 15 jours de repos</li>
                <li>🌡️ Garder loin de la chaleur</li>
              </ul>
            </div>
            <div className="bg-white border-l-4 border-rouge rounded-r-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-rouge font-extrabold mb-3">⚠️ Attention</p>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2"><span>🚫</span><span><strong>Pas d'alcool</strong> pendant toute la cure</span></li>
                <li className="flex gap-2"><span>⚠️</span><span><strong>Éviter de conduire dans la 1ère heure</strong> après la prise</span></li>
                <li className="flex gap-2"><span>🚫</span><span><strong>Femmes enceintes</strong> : interdit</span></li>
                <li className="flex gap-2"><span>👶</span><span><strong>Enfants 5-12 ans :</strong> 1 cuillère à café le soir</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8-9. WHATSAPP + FACEBOOK (intro chapeau then component) */}
      <section className="pt-14 pb-2 bg-[#0f2a1c] text-white">
        <div className="container-kouka max-w-3xl text-center">
          <span className="inline-block bg-[#dcf8c6] text-[#0f2a1c] text-xs font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">📱 Messages WhatsApp privés</span>
          <h2 className="text-[oklch(0.92_0.08_85)] mt-3 font-serif">Ce que les familles écrivent après leur cure</h2>
          <p className="text-white/70 text-sm mt-2 max-w-xl mx-auto">
            Prénoms abrégés pour la confidentialité · Messages réels reçus par Le Vieux KOUKA
          </p>
        </div>
      </section>
      <SocialProofChatTonic />
      <section className="py-4 bg-[#f5f0e0]/40">
        <div className="container-kouka max-w-2xl text-center text-sm text-[#0f2a1c]">
          Voici ce que disent nos clients sur notre <strong>page Facebook officielle (48 000 abonnés)</strong> :
        </div>
      </section>

      {/* 10. COMPARATIF */}
      <section className="py-14 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">⚖️ Comparaison</span>
            <h2 className="text-vert mt-2">Tonic KOUKA contre 5 médicaments différents</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border-2 border-vert/30 shadow-sm">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-vert text-white">
                  <th className="text-left px-3 py-3 font-bold">Critère</th>
                  <th className="px-3 py-3 font-extrabold bg-vert-mid">🌿 Tonic KOUKA</th>
                  <th className="px-3 py-3 font-bold">5 médicaments</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Maux soignés', '✅ 5 d\'un coup', '❌ 1 par produit'],
                  ['Paiement', '✅ À la livraison', '❌ Avant de recevoir'],
                  ['Coût par mois', '22 000 F', 'Plus de 50 000 F'],
                  ['Effets secondaires', '✅ Aucun', '⚠️ Abîme foie, reins'],
                  ['D\'où ça vient', '🌿 Plantes du Burkina', 'Produits chimiques'],
                  ['Dépendance', '✅ Aucune', '❌ Souvent à vie'],
                  ['Discrétion', '✅ 100%', 'Pharmacie au vu de tous'],
                ].map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-vert-bg/40'}>
                    <td className="px-3 py-3 font-bold text-foreground">{r[0]}</td>
                    <td className="px-3 py-3 text-center font-bold text-vert bg-vert-bg/60">{r[1]}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 11. LIVRAISON */}
      <section className="py-10 bg-cream-2">
        <div className="container-kouka max-w-2xl">
          <h3 className="text-vert text-center mb-5">🚚 Livraison Burkina · Niger</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { text: "🇧🇫 Ouagadougou — Même jour ou 24h — Gratuit", free: true },
              { text: "🇧🇫 Autres villes BF — 2-3 jours (car de transport) — 1 000 F", free: false },
              { text: "🇳🇪 Niamey — 24-48h — Gratuit", free: true },
              { text: "🇳🇪 Autres villes Niger — 3-4 jours (car de transport) — 1 500 F", free: false },
            ].map((x, idx) => (
              <div key={idx} className={`bg-white border-2 rounded-xl p-4 flex items-center ${x.free ? 'border-vert shadow-sm' : 'border-vert/20'}`}>
                <div className="font-extrabold text-foreground text-sm leading-snug">{x.text}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">✅ Cash · Tu vérifies la bouteille avant de payer</p>
          <div className="text-center mt-6">
            <RedCTA location="livraison">👉 JE COMMANDE — Paiement à la livraison</RedCTA>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="py-14 bg-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">❓ Questions</span>
            <h2 className="text-vert mt-2">Tes questions, mes réponses</h2>
          </div>
          <FAQ
            items={[
              { q: "C'est vraiment naturel ou il y a du chimique dedans ?", a: "<strong>100% naturel.</strong> Racines, écorces et feuilles ramassées au Burkina. Aucun médicament chimique, aucun additif. La recette existe depuis plus de 60 ans." },
              { q: "Comment 1 seul produit peut soigner 5 maux ?", a: "Parce que c'est une <strong>boisson amère</strong> qui ne soigne pas les symptômes un par un — elle réveille les 3 organes nettoyeurs (foie, reins, sang). Quand ces organes marchent bien, le sommeil revient, l'appétit revient, la fatigue part, l'estomac se calme et la tension baisse." },
              { q: "En combien de temps je vais voir les résultats ?", a: "<strong>Dès la 1ère semaine :</strong> tu te sens plus léger, tu as plus d'énergie. <strong>Entre J15 et J30 :</strong> les douleurs (ulcère, règles, hémorroïdes) baissent, la tension et le sucre se stabilisent." },
              { q: "Combien de bouteilles je dois prendre ?", a: "<strong>1 bouteille</strong> = pour essayer. <strong>Pack 2 + 1 GRATUITE (22 000 F)</strong> = la cure complète conseillée. <strong>Pack 3 + 2 GRATUITES (33 000 F)</strong> = pour toute la famille." },
              { q: "Comment je dois prendre le Tonic ?", a: "<strong>Adulte :</strong> un verre et demi de thé, <strong>seulement le soir, avant de manger</strong>. Bien secouer avant. Cure de 30 jours, puis 15 jours de repos." },
              { q: "Est-ce qu'il y a des effets secondaires ?", a: "Aucun — 100% plantes africaines, zéro chimie, zéro dépendance. Pas d'alcool pendant la cure, éviter de conduire dans la 1ère heure après la prise, interdit aux femmes enceintes." },
              { q: "Je peux le prendre avec mes médicaments ?", a: "Oui, c'est un complément naturel. <strong>N'arrête jamais tes médicaments d'un coup</strong> — continue ton traitement et parle à ton médecin avant de changer quelque chose." },
              { q: "La livraison est discrète ?", a: "Oui — emballage neutre sans logo. Personne ne peut deviner ce que tu as commandé." },
            ]}
          />
        </div>
      </section>

      {/* 13. VALUE STACK */}
      <section className="py-12 bg-gradient-to-b from-white to-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-vert text-xs font-bold uppercase tracking-widest">🎁 Tout ce que tu reçois</span>
            <h2 className="text-vert mt-2">Tout est inclus dans la cure complète</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-vert/30">
            <ul className="divide-y divide-vert/20">
              {[
                { t: '3 bouteilles de Tonic du Vieux KOUKA (1 GRATUITE)', v: '33 000 F' },
                { t: 'Conseils personnalisés sur WhatsApp', v: 'Offert' },
                { t: 'Suivi du Vieux pendant toute la cure', v: 'Offert' },
                { t: 'Livraison à domicile (Ouaga & Niamey)', v: 'Offert' },
                { t: 'Tu paies seulement à la livraison — zéro risque', v: '✓' },
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
              <div>
                <span className="font-extrabold text-foreground">Total à payer</span>
                <span className="block text-xs text-muted-foreground line-through">au lieu de 33 000 F</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-vert">22 000 F</span>
                <span className="block text-[11px] font-bold text-vert mt-1">💵 Paiement à la livraison</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. ENCADRÉ "L'ERREUR DES CLIENTS" */}
      <section className="py-10 bg-white">
        <div className="container-kouka max-w-3xl">
          <div className="bg-[#FFF8DC] border-l-4 border-[#E5B800] rounded-r-2xl p-6 shadow-sm">
            <p className="font-extrabold text-foreground mb-3 text-lg">⚠️ L'erreur que font la plupart des clients</p>
            <p className="text-sm text-foreground leading-relaxed">
              Beaucoup commandent <strong>1 flacon pour tester</strong>... puis ressentent les premiers effets positifs. Mais le produit se termine avant la guérison. Ils commandent en urgence — parfois en rupture de stock — et le mal revient.
            </p>
            <p className="mt-3 text-sm font-extrabold text-vert">👉 La cure complète (2+1) évite cette erreur dès le départ.</p>
          </div>
        </div>
      </section>

      {/* 15. TABLEAU 3 OFFRES */}
      <OfferComparisonTable product={product} />

      <ReassuranceBar />

      {/* 16. FORMULAIRE — intro */}
      <section className="py-12 bg-vert text-white">
        <div className="container-kouka max-w-2xl text-center">
          <h2 className="text-white">Tu es à 2 minutes de ta commande</h2>
          <p className="text-white/90 text-sm mt-3 font-semibold leading-relaxed">
            Remplis les champs — on te contacte sur WhatsApp dans les 2h pour confirmer ta livraison.
          </p>
          <p className="mt-4 text-base font-extrabold text-or-light">
            <u>Tu ne paies rien maintenant. Seulement quand tu reçois ton flacon.</u>
          </p>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="py-8 bg-white border-t border-vert/20">
        <div className="container-kouka text-center">
          <Link to="/" className="text-vert font-bold text-sm">← Retour à l'accueil</Link>
        </div>
      </section>
    </div>
  );
}
