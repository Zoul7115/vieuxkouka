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
import sachetAsset from '@/assets/anti-diabete-sachet-cutout.png.asset.json';
import portraitAsset from '@/assets/vieux-kouka-portrait.jpg.asset.json';
import glucometreAsset from '@/assets/glucometre.png.asset.json';


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

      {/* BARRE SUPÉRIEURE — infos livraison/paiement */}
      <div className="bg-bleu text-white text-[11px] md:text-sm font-semibold sticky top-0 z-40 animate-[fadeUp_.4s_ease_both]">
        <div className="max-w-6xl mx-auto px-3 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
          <span className="inline-flex items-center gap-1.5">🚚 Livraison <b>GRATUITE</b> à Ouagadougou &amp; Niamey</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="inline-flex items-center gap-1.5">📦 Burkina 1 000 F · Niger 1 500 F</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="inline-flex items-center gap-1.5">💵 Paiement à la livraison</span>
        </div>
      </div>

      {/* HERO PREMIUM */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-bleu-bg/40 to-white pt-8 md:pt-14 pb-10 md:pb-16">
        {/* Feuilles décoratives */}
        <div aria-hidden className="pointer-events-none absolute -top-10 -left-10 text-[180px] opacity-[0.06] select-none">🌿</div>
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-8 text-[220px] opacity-[0.05] select-none rotate-12">🌿</div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-[45%_55%] gap-8 md:gap-10 items-center relative">
          {/* Colonne gauche — texte */}
          <div className="space-y-5 md:space-y-6">
            {/* Badge */}
            <div className="anim-up" style={{ animationDelay: '0ms' }}>
              <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full ring-1 ring-emerald-600/15">
                🌿 RECETTE TRADITIONNELLE DU VIEUX KOUKA
              </span>
            </div>

            {/* Titre */}
            <h1
              className="anim-up font-extrabold text-bleu leading-[1.15] tracking-tight text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px] max-w-[560px]"
              style={{ animationDelay: '80ms', fontWeight: 700 }}
            >
              Retrouvez une glycémie plus stable naturellement grâce à une recette traditionnelle burkinabè transmise depuis plus de 60 ans.
            </h1>

            {/* Sous-titre */}
            <p className="anim-up text-[15px] md:text-[18px] text-slate-600 leading-[1.65] max-w-[560px]" style={{ animationDelay: '160ms' }}>
              Des centaines de familles au Burkina Faso et au Niger utilisent déjà la Poudre Anti-Diabète du Vieux KOUKA dans le cadre de leur routine quotidienne.
              <br />
              <span className="text-slate-500 text-sm md:text-[15px]">Paiement uniquement à la livraison • Accompagnement WhatsApp • Livraison rapide.</span>
            </p>

            {/* Bloc émotionnel */}
            <div className="anim-up bg-bleu-bg/60 border border-bleu/10 rounded-2xl p-4 md:p-5 flex gap-3 max-w-[560px]" style={{ animationDelay: '240ms' }}>
              <span className="text-bleu text-xl shrink-0 mt-0.5">💙</span>
              <div className="text-[13.5px] md:text-[15px] text-slate-700 leading-relaxed space-y-2">
                <p>
                  Chaque jour, des personnes souffrent de picotements, d'une soif excessive, de réveils nocturnes répétés et d'une glycémie difficile à équilibrer.
                </p>
                <p className="text-slate-600">
                  Si vous vous reconnaissez, cette recette traditionnelle mérite peut-être votre attention.
                </p>
                <p className="mt-2 border-l-2 border-bleu/40 pl-3 italic text-slate-700 font-medium">
                  Ces signes peuvent progressivement affecter votre qualité de vie s'ils persistent.
                </p>
              </div>
            </div>

            {/* Bloc confiance */}
            <div className="anim-up max-w-[560px]" style={{ animationDelay: '320ms' }}>
              <p className="text-bleu font-bold text-sm md:text-base mb-3">
                Pourquoi des centaines de familles nous font confiance ?
              </p>
              <ul className="grid gap-2">
                {[
                  'Plus de 60 ans de savoir-faire traditionnel',
                  'Paiement uniquement à la livraison',
                  'Livraison rapide Burkina Faso & Niger',
                  'Accompagnement personnalisé sur WhatsApp',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13.5px] md:text-[15px] text-slate-700">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs shrink-0 mt-0.5">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bénéfices — grille */}
            <div className="anim-up grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[560px]" style={{ animationDelay: '380ms' }}>
              {[
                'Aide à retrouver une glycémie plus stable',
                'Aide à réduire les picotements des mains et des pieds',
                'Aide à diminuer les sensations de brûlure',
                'Aide à réduire la soif excessive',
                'Aide à diminuer les envies fréquentes d\'uriner',
                'Recette traditionnelle à base de plantes',
              ].map((b, i) => {
                const featured = i === 0;
                return (
                  <div
                    key={b}
                    className={
                      featured
                        ? 'bg-emerald-50/70 rounded-xl border-2 border-emerald-500/60 p-3.5 shadow-[0_4px_14px_-6px_rgba(16,185,129,0.35)] flex items-start gap-2.5 sm:col-span-2'
                        : 'bg-white rounded-xl border border-slate-200/70 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-start gap-2.5'
                    }
                  >
                    <span
                      className={
                        featured
                          ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-sm leading-none shrink-0 mt-0.5'
                          : 'text-emerald-600 font-bold text-base leading-none mt-0.5'
                      }
                    >
                      ✓
                    </span>
                    <span
                      className={
                        featured
                          ? 'text-[13.5px] md:text-[15px] text-emerald-900 font-semibold leading-snug'
                          : 'text-[12.5px] md:text-[13.5px] text-slate-700 leading-snug'
                      }
                    >
                      {b}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="anim-up flex flex-col gap-3 max-w-[560px] pt-1" style={{ animationDelay: '400ms' }}>
              <button
                onClick={scrollToOrder}
                className="w-full bg-rouge hover:bg-rouge/90 text-white py-4 md:py-4.5 rounded-2xl text-base md:text-[17px] font-extrabold shadow-[0_10px_25px_-8px_rgba(198,40,40,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wide"
              >
                Je commande mon traitement complet
              </button>
              <button
                onClick={scrollToTestimonies}
                className="w-full bg-white hover:bg-slate-50 text-bleu border-2 border-bleu py-3 md:py-3.5 rounded-2xl text-sm md:text-base font-bold transition-colors"
              >
                Voir les témoignages
              </button>
            </div>

            {/* Badges */}
            <div className="anim-up flex flex-wrap gap-2 pt-1 max-w-[560px]" style={{ animationDelay: '400ms' }}>
              {[
                { i: '🚚', t: 'Livraison rapide' },
                { i: '💵', t: 'Paiement à la livraison' },
                { i: '📱', t: 'Confirmation WhatsApp' },
                { i: '🇧🇫', t: 'Burkina Faso' },
                { i: '🇳🇪', t: 'Niger' },
                { i: '🌿', t: 'Produit naturel' },
              ].map((b) => (
                <span key={b.t} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] rounded-full px-3 py-1.5 text-[11.5px] md:text-xs font-semibold text-slate-700">
                  <span>{b.i}</span>{b.t}
                </span>
              ))}
            </div>
          </div>

          {/* Colonne droite — image hero */}
          <div className="anim-up relative order-first md:order-last" style={{ animationDelay: '400ms' }}>
            <div className="relative mx-auto max-w-[520px] aspect-[4/5]">
              {/* Halo vert premium */}
              <div aria-hidden className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-400/35 via-emerald-500/25 to-emerald-300/10 blur-3xl" />
              <div aria-hidden className="absolute inset-16 rounded-full bg-emerald-300/20 blur-2xl" />
              {/* Feuilles arrière-plan */}
              <div aria-hidden className="absolute top-4 left-2 text-6xl opacity-20 rotate-[-18deg] select-none">🌿</div>
              <div aria-hidden className="absolute bottom-10 right-4 text-5xl opacity-20 rotate-12 select-none">🍃</div>

              {/* Sachet — élément principal (détouré) */}
              <img
                src={sachetAsset.url}
                alt="Poudre Anti-Diabète du Vieux KOUKA"
                className="relative z-10 w-[82%] h-auto object-contain drop-shadow-[0_30px_45px_rgba(16,80,40,0.28)] mx-auto"
              />

              {/* Portrait Vieux Kouka */}
              <div className="absolute z-20 top-4 right-0 md:right-2 w-[40%] rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-white">
                <div className="aspect-[3/4] w-full">
                  <img src={portraitAsset.url} alt="Le Vieux KOUKA" className="w-full h-full object-cover" />
                </div>
                <div className="px-2 py-1.5 bg-white">
                  <div className="text-bleu text-[11px] md:text-[12px] font-extrabold leading-tight">Vieux KOUKA</div>
                  <div className="text-slate-600 text-[9.5px] md:text-[10.5px] font-medium">Tradithérapeute</div>
                  <div className="text-slate-500 text-[9px] md:text-[10px] mt-0.5">Région des Kuilsés • Burkina Faso</div>
                  <div className="text-emerald-700 text-[9px] md:text-[10px] font-semibold mt-0.5">🌿 +60 ans de savoir-faire</div>
                </div>
              </div>

              {/* Glucomètre — élément de contexte */}
              <div className="absolute z-20 bottom-2 right-6 w-[30%] rounded-xl overflow-hidden bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-lg p-1.5">
                <img src={glucometreAsset.url} alt="Contrôle glycémie" className="w-full h-auto object-contain rounded-md" />
              </div>

              {/* Badge naturel */}
              <div className="absolute z-30 top-2 left-0 md:-left-2 bg-emerald-600 text-white text-[10px] md:text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg rotate-[-6deg]">
                100% NATUREL
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

      {/* SECTION 2 — VOUS VOUS RECONNAISSEZ PEUT-ÊTRE */}
      <section className="py-12 md:py-16 bg-bleu-bg">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <span className="anim-up inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full ring-1 ring-emerald-600/15">
              🔎 VOUS VOUS RECONNAISSEZ PEUT-ÊTRE...
            </span>
            <h2 className="anim-up mt-3 text-bleu font-extrabold tracking-tight text-[24px] sm:text-[28px] md:text-[34px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Vous reconnaissez peut-être votre quotidien...
            </h2>
            <p className="anim-up text-[14.5px] md:text-[16px] text-slate-600 leading-[1.65] mt-3 max-w-2xl mx-auto" style={{ animationDelay: '160ms' }}>
              Certaines personnes vivent ces situations tous les jours sans imaginer qu'elles peuvent être liées à une glycémie difficile à équilibrer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: '🦶', t: 'Tes pieds picotent ou brûlent lorsque tu marches ?', d: 'Ces sensations peuvent devenir de plus en plus gênantes au quotidien.' },
              { icon: '🥤', t: 'Tu bois de l\'eau toute la journée sans vraiment calmer ta soif ?', d: 'Même après plusieurs verres, cette sensation revient rapidement.' },
              { icon: '🌙', t: 'Tu te réveilles plusieurs fois chaque nuit pour aller uriner ?', d: 'Ton sommeil devient moins réparateur.' },
              { icon: '😴', t: 'Tu te sens souvent fatigué malgré une bonne nuit ?', d: 'Tu manques d\'énergie pour tes activités quotidiennes.' },
              { icon: '👀', t: 'Ta vision devient parfois floue ?', d: 'Lire ou regarder ton téléphone devient parfois plus difficile.' },
              { icon: '📈', t: 'Ta glycémie reste difficile à équilibrer malgré tes efforts ?', d: 'Tu cherches une solution complémentaire à intégrer à ta routine.' },
            ].map((c, i) => (
              <div
                key={i}
                className="anim-up bg-white rounded-2xl p-5 md:p-6 border border-bleu-light/30 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
                style={{ animationDelay: `${120 + i * 70}ms` }}
              >
                <div className="text-3xl md:text-4xl mb-2">{c.icon}</div>
                <div className="font-extrabold text-bleu text-[15px] md:text-base leading-snug">{c.t}</div>
                <div className="text-[13px] md:text-[14px] text-slate-600 mt-2 leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 max-w-3xl mx-auto anim-up" style={{ animationDelay: '600ms' }}>
            <div className="bg-white rounded-2xl border border-bleu-light/30 shadow-sm p-5 md:p-6 flex gap-3 md:gap-4">
              <span className="text-bleu text-xl md:text-2xl shrink-0">💙</span>
              <p className="text-[14px] md:text-[15.5px] text-slate-700 leading-relaxed">
                Ces signes peuvent progressivement rendre les gestes du quotidien plus difficiles : marcher confortablement, dormir paisiblement, travailler ou profiter pleinement de sa famille.
              </p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => document.getElementById('smart-diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-rouge text-white px-5 md:px-7 py-3.5 rounded-xl text-[14px] md:text-[15px] font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 transition-transform"
              >
                Découvrir comment cette recette traditionnelle peut m'aider
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MINI-DIAGNOSTIC INTELLIGENT */}
      <SmartDiagnostic />

      {/* SECTION 4 — COMPRENDRE POURQUOI CES SIGNES APPARAISSENT */}
      <section id="comprendre-section" className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <span className="anim-up inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full ring-1 ring-emerald-600/15">
              🌿 COMPRENDRE
            </span>
            <h2 className="anim-up mt-3 text-bleu font-extrabold tracking-tight text-[24px] sm:text-[28px] md:text-[34px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Pourquoi ces signes apparaissent-ils ?
            </h2>
            <p className="anim-up text-[14.5px] md:text-[16px] text-slate-600 leading-[1.65] mt-3 max-w-2xl mx-auto" style={{ animationDelay: '160ms' }}>
              Lorsque le sucre circule durablement en excès dans le sang, certaines personnes peuvent ressentir différents inconforts au quotidien.
            </p>
          </div>

          {/* Infographie */}
          <div className="max-w-md mx-auto flex flex-col items-center gap-2">
            <div className="anim-up w-full bg-bleu text-white rounded-2xl px-5 py-4 text-center shadow-[0_6px_20px_rgba(30,64,175,0.25)]" style={{ animationDelay: '220ms' }}>
              <div className="text-[11px] uppercase tracking-widest text-white/70 font-bold">Étape 1</div>
              <div className="font-extrabold text-[16px] md:text-[18px] mt-1">Glycémie difficile à équilibrer</div>
            </div>
            <div className="text-bleu/60 text-2xl">↓</div>

            <div className="anim-up w-full bg-bleu-bg border border-bleu-light/30 rounded-2xl px-5 py-4 shadow-sm" style={{ animationDelay: '300ms' }}>
              <div className="text-[11px] uppercase tracking-widest text-bleu/70 font-bold text-center">Étape 2 — Effets ressentis</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {[
                  { icon: '😴', label: 'Fatigue' },
                  { icon: '🥤', label: 'Soif' },
                  { icon: '🌙', label: 'Réveils nocturnes' },
                  { icon: '🦶', label: 'Picotements' },
                  { icon: '👀', label: 'Vision floue' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl px-4 py-2.5 flex items-center gap-3 border border-bleu-light/20">
                    <span className="text-xl">{s.icon}</span>
                    <span className="font-bold text-bleu text-[14.5px]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloc vert */}
          <div className="mt-8 md:mt-10 anim-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-vert-bg border-l-4 border-vert rounded-2xl p-5 md:p-6 shadow-sm max-w-2xl mx-auto">
              <p className="text-[14.5px] md:text-[15.5px] text-slate-700 leading-relaxed">
                L'objectif de la recette traditionnelle du <strong className="text-vert">Vieux KOUKA</strong> est d'accompagner l'organisme dans sa recherche d'un meilleur équilibre, tout en restant complémentaire d'une bonne hygiène de vie et du suivi médical.
              </p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={scrollToOrder}
                className="bg-rouge text-white px-5 md:px-7 py-3.5 rounded-xl text-[14px] md:text-[15px] font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 transition-transform"
              >
                Découvrir la recette du Vieux KOUKA
              </button>
            </div>
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

      {/* FAIT POUR VOUS SI */}
      <section className="py-14 bg-gradient-to-b from-bleu-bg to-white">
        <div className="container-kouka max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-bleu text-xs font-bold uppercase tracking-widest">🩺 Vérifiez les signes</span>
            <h2 className="text-bleu mt-2">Ce traitement est fait pour vous si :</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: '🩸', t: 'Vous êtes prédiabétique' },
              { icon: '💉', t: 'Vous êtes diabétique de type 2' },
              { icon: '📈', t: 'Votre glycémie est souvent élevée' },
              { icon: '🚻', t: 'Vous urinez fréquemment' },
              { icon: '💧', t: 'Vous avez constamment soif' },
              { icon: '😩', t: 'Vous ressentez une fatigue inhabituelle' },
              { icon: '🖐️', t: 'Vous avez les mains ou les pieds qui picotent' },
              { icon: '👁️', t: 'Votre vision devient parfois floue' },
            ].map((b) => (
              <div
                key={b.t}
                className="bg-white border-2 border-bleu-light/40 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-start gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-bleu-bg text-2xl flex items-center justify-center">{b.icon}</div>
                <div className="flex items-start gap-2 text-sm md:text-base font-extrabold text-bleu leading-snug">
                  <span className="text-emerald-600 mt-0.5">✅</span>
                  <span>{b.t}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border-2 border-bleu/30 bg-white shadow-xl p-6 md:p-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-or/15 text-foreground border border-or/40 text-[11px] md:text-xs font-extrabold px-3 py-1.5 rounded-full mb-3">⭐ Recette traditionnelle</div>
            <h3 className="text-bleu font-extrabold text-xl md:text-2xl">Poudre Anti-Diabète du Vieux KOUKA</h3>
            <p className="text-foreground mt-3 leading-relaxed">
              Recette traditionnelle à base de plantes africaines utilisée par de nombreuses familles.
            </p>
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

          {/* Badges réassurance supprimés — doublon avec <ReassuranceBar /> plus haut */}
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

// SECTION 3 — Mini-diagnostic intelligent (recommandation dynamique)
type DiagChoice = 'recent' | 'ancien' | 'instable' | 'traitement';

const DIAG_OPTIONS: { id: DiagChoice; label: string }[] = [
  { id: 'recent', label: 'Diabète récemment diagnostiqué' },
  { id: 'ancien', label: 'Diabète ancien (plusieurs années)' },
  { id: 'instable', label: 'Glycémie élevée / instable' },
  { id: 'traitement', label: 'Traitement actuel peu efficace' },
];

const DIAG_RECOMMENDATIONS: Record<DiagChoice, string> = {
  recent:
    'Une prise en charge précoce et une bonne hygiène de vie sont importantes. Cette recette traditionnelle peut accompagner votre routine quotidienne.',
  ancien:
    "Lorsque les symptômes sont présents depuis longtemps, certaines personnes préfèrent une cure complète afin d'assurer un accompagnement plus durable.",
  instable:
    'Une glycémie difficile à équilibrer demande souvent une approche régulière. Notre cure complète est généralement la plus choisie.',
  traitement:
    "Certaines personnes utilisent cette recette traditionnelle en complément de leur suivi habituel. N'arrêtez jamais un traitement prescrit sans l'avis de votre professionnel de santé.",
};

function SmartDiagnostic() {
  const [choice, setChoice] = useState<DiagChoice | null>(null);

  return (
    <section id="smart-diagnostic" className="py-12 md:py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[11px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full ring-1 ring-emerald-600/15">
            🩺 MINI-DIAGNOSTIC
          </span>
          <h2 className="mt-3 text-bleu font-extrabold tracking-tight text-[24px] sm:text-[28px] md:text-[34px] leading-[1.2]">
            Faisons le point sur ta situation
          </h2>
          <p className="text-[14.5px] md:text-[16px] text-slate-600 leading-[1.65] mt-3 max-w-xl mx-auto">
            Réponds à cette question pour découvrir la recommandation qui correspond le mieux à ton profil.
          </p>
        </div>

        <div className="grid gap-3">
          {DIAG_OPTIONS.map((o) => {
            const sel = choice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setChoice(o.id)}
                className={`flex items-center gap-3 text-left px-4 py-4 rounded-2xl border-2 transition-all bg-white ${
                  sel
                    ? 'border-bleu bg-bleu-bg shadow-[0_6px_18px_rgba(30,64,175,0.15)]'
                    : 'border-bleu-light/40 hover:border-bleu-mid hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    sel ? 'bg-bleu border-bleu text-white' : 'border-bleu-light/60 text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span className="font-bold text-bleu text-[14.5px] md:text-[15.5px]">{o.label}</span>
              </button>
            );
          })}
        </div>

        {choice && (
          <div className="mt-6 anim-up">
            <div className="bg-vert-bg border-l-4 border-vert rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="text-[11px] uppercase tracking-widest text-vert font-extrabold mb-2">
                ⭐ Recommandation personnalisée
              </div>
              <p className="text-[14.5px] md:text-[15.5px] text-slate-700 leading-relaxed flex gap-2">
                <span className="shrink-0">🟢</span>
                <span>{DIAG_RECOMMENDATIONS[choice]}</span>
              </p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => document.getElementById('comprendre-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-rouge text-white px-5 md:px-7 py-3.5 rounded-xl text-[14px] md:text-[15px] font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)] hover:-translate-y-0.5 transition-transform"
              >
                Voir comment agit la recette traditionnelle
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

