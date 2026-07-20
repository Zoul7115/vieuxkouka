import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { useDynamicStock } from '@/hooks/useDynamicStock';
import { ANTI_DIABETE } from '@/lib/products';
import { SocialProofChat } from '@/components/anti-diabete/SocialProofChat';
import { DiagnosticQuiz } from '@/components/conversion/DiagnosticQuiz';
import { OfferComparisonTable } from '@/components/conversion/OfferComparisonTable';
import { ReassuranceBar } from '@/components/conversion/ReassuranceBar';
import { StickyOfferBarRecommended } from '@/components/StickyOfferBarRecommended';
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
    <div className="bg-bleu-bg">
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





      {/* SECTION 5 — HISTOIRE DU VIEUX KOUKA (émotionnelle, fond bleu profond) */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-bleu via-bleu-mid to-bleu text-white">
        <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 text-[280px] opacity-[0.05] select-none">🌿</div>
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 text-[320px] opacity-[0.04] select-none rotate-12">🌿</div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <span className="anim-up inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-white/20">
              🌿 UNE HISTOIRE TRANSMISE DE GÉNÉRATION EN GÉNÉRATION
            </span>
            <h2 className="anim-up mt-5 text-white font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[38px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Depuis plus de 60 ans, une recette traditionnelle continue d'accompagner de nombreuses familles.
            </h2>
          </div>

          <div className="grid md:grid-cols-[42%_58%] gap-8 md:gap-12 items-center">
            {/* Gauche — portrait */}
            <div className="anim-up relative mx-auto max-w-md w-full" style={{ animationDelay: '160ms' }}>
              <div aria-hidden className="absolute -inset-4 bg-gradient-to-br from-emerald-400/25 to-white/5 blur-3xl rounded-3xl" />
              <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
                <img src={portraitAsset.url} alt="Le Vieux KOUKA, tradithérapeute" className="w-full h-full object-cover aspect-[3/4]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white font-extrabold text-lg">Vieux KOUKA</div>
                  <div className="text-white/80 text-xs">Tradithérapeute · Région des Kuilsés 🇧🇫</div>
                </div>
              </div>
            </div>

            {/* Droite — texte */}
            <div className="space-y-5 text-white/90 leading-relaxed text-[15px] md:text-[17px]">
              <p className="anim-up" style={{ animationDelay: '220ms' }}>
                Cette recette est associée au savoir-faire du <strong className="text-white">Vieux KOUKA</strong>, tradithérapeute de la région des Kuilsés au Burkina Faso.
              </p>
              <p className="anim-up" style={{ animationDelay: '300ms' }}>
                Pendant des décennies, il a préparé cette formule à base de plantes selon les méthodes traditionnelles transmises dans sa famille.
              </p>
              <p className="anim-up" style={{ animationDelay: '380ms' }}>
                Aujourd'hui, cette recette continue d'être utilisée par de nombreuses personnes dans le cadre de leur routine quotidienne.
              </p>

              {/* Petite carte info */}
              <div className="anim-up grid sm:grid-cols-3 gap-2.5 pt-2" style={{ animationDelay: '460ms' }}>
                {[
                  { i: '📍', t: 'Région des Kuilsés' },
                  { i: '🌿', t: 'Plus de 60 ans de savoir-faire' },
                  { i: '👨‍👩‍👧‍👦', t: 'Recette transmise dans la famille' },
                ].map((c) => (
                  <div key={c.t} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-3 py-2.5 text-[12.5px] md:text-[13px] text-white font-semibold flex items-center gap-2">
                    <span className="text-lg">{c.i}</span>
                    <span className="leading-snug">{c.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition douce vers section 6 */}
      <div aria-hidden className="h-8 bg-gradient-to-b from-bleu to-white" />

      {/* SECTION 6 — PRÉSENTATION DE LA RECETTE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <span className="anim-up inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-emerald-600/15">
              🌿 LA RECETTE
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[38px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Pourquoi cette recette est-elle différente ?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { i: '🌱', t: 'Des plantes soigneusement sélectionnées', d: 'Chaque plante est choisie selon les pratiques traditionnelles.' },
              { i: '👐', t: 'Préparation artisanale', d: 'La recette est préparée dans le respect du savoir-faire traditionnel.' },
              { i: '📦', t: 'Conditionnement pratique', d: 'Le sachet permet une utilisation simple au quotidien.' },
              { i: '💬', t: 'Accompagnement WhatsApp', d: "Tu n'es jamais seul pendant ta cure." },
            ].map((c, i) => (
              <div
                key={c.t}
                className="anim-up group bg-gradient-to-br from-white to-bleu-bg/40 rounded-2xl p-5 md:p-6 border border-bleu-light/25 shadow-[0_4px_20px_-8px_rgba(30,64,175,0.15)] hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(30,64,175,0.25)] transition-all"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 text-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">{c.i}</div>
                <div className="font-extrabold text-bleu text-[15px] md:text-base leading-snug">{c.t}</div>
                <div className="text-[13px] md:text-[14px] text-slate-600 mt-2 leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>

          {/* Illustration premium sous les cartes */}
          <div className="anim-up mt-12 md:mt-16 relative max-w-3xl mx-auto" style={{ animationDelay: '500ms' }}>
            <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-bleu-bg/60 border border-emerald-200/60 shadow-[0_20px_40px_-20px_rgba(16,80,40,0.25)] px-6 py-10 md:px-12 md:py-14 overflow-hidden">
              <div aria-hidden className="absolute -top-10 -left-6 text-[180px] opacity-[0.08] rotate-[-12deg]">🌿</div>
              <div aria-hidden className="absolute -bottom-10 -right-4 text-[160px] opacity-[0.08] rotate-12">🍃</div>
              <div aria-hidden className="absolute top-8 right-10 text-6xl opacity-30 rotate-6 select-none">🌱</div>
              <div aria-hidden className="absolute bottom-8 left-8 text-5xl opacity-25 rotate-[-8deg] select-none">🪵</div>

              <div className="relative flex flex-col items-center">
                <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-emerald-400/30 to-emerald-200/10 blur-3xl" />
                </div>
                <img
                  src={sachetAsset.url}
                  alt="Sachet Poudre Anti-Diabète du Vieux KOUKA"
                  className="relative z-10 w-[60%] max-w-xs h-auto object-contain drop-shadow-[0_25px_35px_rgba(16,80,40,0.35)]"
                />
                <div className="relative z-10 mt-6 text-center">
                  <div className="text-bleu font-extrabold text-lg md:text-xl">Poudre Anti-Diabète</div>
                  <div className="text-slate-600 text-sm mt-1">Recette du Vieux KOUKA · 🇧🇫</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — POSOLOGIE PREMIUM */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-bleu-bg/40">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="anim-up inline-flex items-center gap-2 bg-bleu-bg text-bleu text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-bleu/15">
              💊 POSOLOGIE
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[38px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Comment utiliser la poudre ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 relative">
            {[
              { n: '01', t: 'Prendre une petite pincée.', d: 'Un simple geste, entre les doigts, avant chaque repas.' },
              { n: '02', t: 'La laisser fondre doucement dans la bouche', d: 'Avant et après chaque repas, sans préparation particulière.' },
              { n: '03', t: 'Suivre les recommandations WhatsApp', d: 'Un accompagnement personnalisé pendant toute la durée de la cure.' },
            ].map((s, i) => (
              <div
                key={s.n}
                className="anim-up relative bg-white rounded-3xl border border-bleu-light/25 shadow-[0_10px_30px_-15px_rgba(30,64,175,0.25)] p-6 md:p-7 hover:-translate-y-1 hover:shadow-[0_18px_40px_-15px_rgba(30,64,175,0.35)] transition-all"
                style={{ animationDelay: `${150 + i * 100}ms` }}
              >
                <div className="absolute -top-4 left-6 bg-gradient-to-br from-bleu to-bleu-mid text-white text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-lg">
                  Étape {s.n}
                </div>
                <div className="pt-3">
                  <div className="font-extrabold text-bleu text-[16px] md:text-[17px] leading-snug">{s.t}</div>
                  <p className="text-[13.5px] md:text-[14.5px] text-slate-600 mt-2 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="anim-up mt-8 md:mt-10 max-w-2xl mx-auto" style={{ animationDelay: '500ms' }}>
            <div className="bg-vert-bg border-l-4 border-vert rounded-r-2xl px-5 py-4 flex items-start gap-3 shadow-sm">
              <span className="text-2xl">🌿</span>
              <p className="text-[14.5px] md:text-[15.5px] text-slate-700 leading-relaxed font-medium">
                Aucune préparation particulière n'est nécessaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — TIMELINE DU SUIVI DE CURE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="anim-up inline-flex items-center gap-2 bg-bleu-bg text-bleu text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-bleu/15">
              📅 SUIVI DE LA CURE
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[24px] sm:text-[30px] md:text-[36px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              À quoi ressemble généralement le suivi de la cure ?
            </h2>
          </div>

          <div className="relative pl-8 md:pl-10 border-l-[3px] border-bleu/25">
            {[
              { d: 'Début', t: 'Découverte de la routine', desc: 'Tu reçois ta cure et tu prends tes premières pincées. On te guide pas à pas.' },
              { d: 'Premiers jours', t: 'Premières observations', desc: 'Certaines personnes disent ressentir les premiers changements dans leur quotidien.' },
              { d: 'Pendant la cure', t: 'Accompagnement WhatsApp', desc: "L'accompagnement WhatsApp permet de répondre aux questions et d'encourager une utilisation régulière." },
              { d: 'Fin de la cure', t: 'Bilan personnalisé', desc: 'Le bilan est réalisé avec le client afin de décider de la suite si nécessaire.' },
            ].map((x, i) => (
              <div key={i} className="anim-up relative mb-8 last:mb-0" style={{ animationDelay: `${150 + i * 100}ms` }}>
                <div className="absolute -left-[42px] md:-left-[52px] w-7 h-7 rounded-full bg-gradient-to-br from-bleu to-bleu-mid border-4 border-white shadow-md flex items-center justify-center text-white text-[11px] font-extrabold">
                  {i + 1}
                </div>
                <div className="bg-gradient-to-br from-white to-bleu-bg/50 rounded-2xl p-5 md:p-6 border border-bleu-light/25 shadow-[0_4px_16px_-6px_rgba(30,64,175,0.15)]">
                  <div className="text-[11px] font-extrabold text-bleu/80 uppercase tracking-widest">{x.d}</div>
                  <div className="font-extrabold text-bleu text-[16px] md:text-[17px] mt-1">{x.t}</div>
                  <div className="text-[13.5px] md:text-[14.5px] text-slate-600 mt-1.5 leading-relaxed">{x.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bloc jaune */}
          <div className="anim-up mt-8 md:mt-10 max-w-2xl mx-auto" style={{ animationDelay: '600ms' }}>
            <div className="bg-or/10 border-l-4 border-or rounded-r-2xl px-5 py-4 flex items-start gap-3 shadow-sm">
              <span className="text-2xl shrink-0">⚠️</span>
              <p className="text-[13.5px] md:text-[14.5px] text-slate-700 leading-relaxed">
                Continuer à suivre les recommandations de votre professionnel de santé.<br />
                <span className="text-slate-600">Ne jamais interrompre un traitement médical sans avis médical.</span>
              </p>
            </div>
          </div>

          {/* CTA final */}
          <div className="text-center mt-10 md:mt-12 anim-up" style={{ animationDelay: '700ms' }}>
            <button
              onClick={scrollToTestimonies}
              className="bg-rouge text-white px-6 md:px-8 py-4 rounded-2xl text-[15px] md:text-[16px] font-extrabold shadow-[0_10px_25px_-8px_rgba(198,40,40,0.5)] hover:-translate-y-0.5 transition-transform"
            >
              Découvrir les témoignages des clients
            </button>
          </div>
        </div>
      </section>

      {/* PREUVE SOCIALE — WhatsApp + Facebook */}
      <div id="testimonies-section">
        <SocialProofChat />
      </div>

      {/* SECTION 11 — COMPARATIF PREMIUM */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-bleu-bg/40">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="anim-up inline-flex items-center gap-2 bg-bleu-bg text-bleu text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-bleu/15">
              ⚖️ COMPARATIF
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[24px] sm:text-[30px] md:text-[36px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Pourquoi de nombreuses familles choisissent la recette du Vieux KOUKA ?
            </h2>
          </div>

          {/* Version desktop — tableau */}
          <div className="hidden md:block anim-up" style={{ animationDelay: '160ms' }}>
            <div className="rounded-3xl border border-bleu-light/25 shadow-[0_10px_30px_-15px_rgba(30,64,175,0.25)] overflow-hidden bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-bleu to-bleu-mid text-white">
                    <th className="text-left px-5 py-4 font-bold text-sm">Caractéristique</th>
                    <th className="px-5 py-4 font-extrabold text-sm bg-white/5">Recette du Vieux KOUKA</th>
                    <th className="px-5 py-4 font-bold text-sm text-white/85">Autres solutions traditionnelles</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['🌿 Préparation traditionnelle', '✅', 'Variable'],
                    ['📱 Accompagnement WhatsApp', '✅', 'Rare'],
                    ['💵 Paiement à la livraison', '✅', 'Pas toujours'],
                    ['🚚 Livraison Burkina + Niger', '✅', 'Variable'],
                    ['👨‍👩‍👧‍👦 Recette familiale', '✅', 'Variable'],
                    ['📞 Assistance après réception', '✅', 'Rare'],
                  ].map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bleu-bg/30'}>
                      <td className="px-5 py-4 font-bold text-slate-800 text-[14.5px]">{r[0]}</td>
                      <td className="px-5 py-4 text-center bg-emerald-50/40">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-extrabold shadow-sm">{r[1]}</span>
                      </td>
                      <td className="px-5 py-4 text-center text-slate-500 font-medium text-[14px]">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Version mobile — cartes empilées */}
          <div className="md:hidden space-y-3">
            {[
              ['🌿 Préparation traditionnelle', '✅', 'Variable'],
              ['📱 Accompagnement WhatsApp', '✅', 'Rare'],
              ['💵 Paiement à la livraison', '✅', 'Pas toujours'],
              ['🚚 Livraison Burkina + Niger', '✅', 'Variable'],
              ['👨‍👩‍👧‍👦 Recette familiale', '✅', 'Variable'],
              ['📞 Assistance après réception', '✅', 'Rare'],
            ].map((r, i) => (
              <div key={i} className="anim-up bg-white rounded-2xl border border-bleu-light/25 shadow-[0_4px_16px_-6px_rgba(30,64,175,0.15)] p-4" style={{ animationDelay: `${100 + i * 60}ms` }}>
                <div className="font-extrabold text-bleu text-[14px] mb-3">{r[0]}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-center">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Vieux KOUKA</div>
                    <div className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-extrabold text-sm">{r[1]}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Autres</div>
                    <div className="mt-1 text-slate-600 text-[13px] font-semibold">{r[2]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 — FAQ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <span className="anim-up inline-flex items-center gap-2 bg-bleu-bg text-bleu text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-bleu/15">
              ❓ FAQ
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[36px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Questions fréquentes
            </h2>
          </div>

          <div className="theme-bleu anim-up" style={{ animationDelay: '160ms' }}>
            <FAQ
              items={[
                {
                  q: 'Puis-je continuer mon traitement médical ?',
                  a: 'Oui, mais ne modifiez jamais un traitement prescrit sans demander l\'avis de votre médecin.',
                },
                {
                  q: 'En combien de temps vais-je recevoir mon colis ?',
                  a: 'À Ouagadougou et Niamey, votre colis arrive généralement sous <strong>24 à 48h</strong>. Ailleurs au Burkina et au Niger, comptez <strong>2 à 4 jours ouvrés</strong>.',
                },
                {
                  q: 'Comment se passe le paiement ?',
                  a: '<strong>Paiement uniquement à la livraison.</strong> Vous vérifiez votre colis, puis vous réglez cash au livreur. Aucune avance.',
                },
                {
                  q: 'Pourquoi recommandez-vous souvent la cure complète ?',
                  a: 'Parce qu\'elle permet une utilisation régulière sur toute la durée conseillée, ce qui laisse au corps le temps de bien s\'adapter à la routine.',
                },
                {
                  q: 'Comment utiliser la poudre ?',
                  a: 'Prenez une petite pincée et laissez-la fondre doucement dans la bouche <strong>avant et après chaque repas</strong>. Aucune préparation particulière.',
                },
                {
                  q: 'Livrez-vous partout au Burkina Faso ?',
                  a: 'Oui, nous livrons <strong>partout au Burkina Faso</strong>. Livraison gratuite à Ouagadougou, 1 000 F ailleurs.',
                },
                {
                  q: 'Livrez-vous partout au Niger ?',
                  a: 'Oui, nous livrons <strong>partout au Niger</strong>. Livraison gratuite à Niamey, 1 500 F pour les autres villes.',
                },
                {
                  q: 'Puis-je poser mes questions sur WhatsApp ?',
                  a: 'Bien sûr. Un conseiller est disponible sur WhatsApp pour répondre à toutes vos questions avant et pendant votre cure.',
                },
              ]}
            />
          </div>

          <div className="text-center mt-8 anim-up" style={{ animationDelay: '260ms' }}>
            <button
              onClick={scrollToOrder}
              className="bg-rouge text-white px-6 md:px-8 py-4 rounded-2xl text-[15px] md:text-[16px] font-extrabold shadow-[0_10px_25px_-8px_rgba(198,40,40,0.5)] hover:-translate-y-0.5 transition-transform"
            >
              Commander le traitement complet
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 13 — LES OFFRES */}
      <OffersSection />

      {/* SECTION 14 — FORMULAIRE (intro + timeline + confidentialité) */}
      <section className="py-14 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <span className="anim-up inline-flex items-center gap-2 bg-bleu-bg text-bleu text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-bleu/15">
              📝 FORMULAIRE
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[36px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Finalisez votre commande
            </h2>
            <p className="anim-up text-[14.5px] md:text-[16px] text-slate-600 leading-relaxed mt-4 max-w-xl mx-auto" style={{ animationDelay: '160ms' }}>
              Un conseiller vous contactera rapidement afin de confirmer votre commande avant l'expédition.
            </p>
          </div>

          {/* Timeline horizontale desktop / verticale mobile */}
          <div className="anim-up max-w-2xl mx-auto mb-8" style={{ animationDelay: '220ms' }}>
            <ol className="grid md:grid-cols-4 gap-3 md:gap-2 relative">
              {[
                { i: '📝', t: 'Vous remplissez le formulaire' },
                { i: '📞', t: 'Nous vous appelons' },
                { i: '📦', t: 'Votre colis est préparé' },
                { i: '💵', t: 'Vous payez à la livraison' },
              ].map((s, i) => (
                <li key={i} className="relative flex md:flex-col items-center gap-3 md:gap-2 bg-gradient-to-br from-white to-bleu-bg/50 border border-bleu-light/25 rounded-2xl px-4 py-3 md:py-4 shadow-[0_4px_16px_-8px_rgba(30,64,175,0.15)]">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-bleu text-white font-extrabold flex items-center justify-center text-lg shadow">
                    {s.i}
                  </div>
                  <div className="text-[13px] md:text-[13px] font-bold text-bleu leading-snug md:text-center">{s.t}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* Confidentialité */}
          <div className="anim-up max-w-xl mx-auto mb-6" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 justify-center bg-emerald-50/70 border border-emerald-200 rounded-2xl px-4 py-3 shadow-sm">
              <span className="text-2xl">🔒</span>
              <p className="text-[13px] md:text-[14px] font-semibold text-emerald-800 leading-snug">
                Vos informations restent strictement confidentielles.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProductForm product={product} />

      {/* SECTION 15 — FOOTER PROFESSIONNEL */}
      <footer className="mt-8 bg-gradient-to-b from-bleu-mid to-bleu text-white">
        {/* Bande réassurance finale */}
        <div className="border-b border-white/10 bg-white/5">
          <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {[
              { i: '🚚', t: 'Livraison rapide' },
              { i: '💵', t: 'Paiement à la livraison' },
              { i: '📱', t: 'Assistance WhatsApp' },
            ].map((r) => (
              <div key={r.t} className="inline-flex items-center justify-center gap-2 text-[13px] md:text-[14px] font-bold text-white/90">
                <span className="text-lg">{r.i}</span>
                {r.t}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 grid gap-8 md:grid-cols-4">
          {/* Bloc logo */}
          <div className="space-y-3">
            <div className="text-2xl font-extrabold tracking-tight">🌿 Vieux KOUKA</div>
            <p className="text-white/70 text-[13.5px] leading-relaxed">
              Recette traditionnelle burkinabè à base de plantes, transmise depuis plus de 60 ans.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href={`https://wa.me/22658444818`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/40 flex items-center justify-center transition-colors">
                💬
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#1877f2]/20 hover:bg-[#1877f2]/40 flex items-center justify-center transition-colors font-black">
                f
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3">Contact</div>
            <ul className="space-y-2 text-[13.5px] text-white/85">
              <li className="flex items-start gap-2"><span>📍</span><span>Ouagadougou, Burkina Faso</span></li>
              <li className="flex items-start gap-2"><span>📞</span><span>+226 58 44 48 18</span></li>
              <li className="flex items-start gap-2"><span>💬</span><a href="https://wa.me/22658444818" className="hover:text-white underline underline-offset-2 decoration-white/30">WhatsApp direct</a></li>
              <li className="flex items-start gap-2"><span>f</span><a href="https://facebook.com" className="hover:text-white underline underline-offset-2 decoration-white/30">Page Facebook officielle</a></li>
            </ul>
          </div>

          {/* Zones de livraison */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3">Zones de livraison</div>
            <ul className="space-y-2 text-[13.5px] text-white/85">
              <li>🇧🇫 Partout au Burkina Faso</li>
              <li>🇳🇪 Partout au Niger</li>
              <li className="text-white/70 text-[12.5px] pt-1">Livraison gratuite à Ouagadougou &amp; Niamey</li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3">Liens utiles</div>
            <ul className="space-y-2 text-[13.5px] text-white/85">
              <li><Link to="/" className="hover:text-white underline underline-offset-2 decoration-white/30">Poudre KOUKA (hémorroïdes &amp; ulcères)</Link></li>
              <li><Link to="/anti-diabete" className="hover:text-white underline underline-offset-2 decoration-white/30">Poudre Anti-Diabète</Link></li>
              <li><a href="#" className="hover:text-white underline underline-offset-2 decoration-white/30">Mentions de confidentialité</a></li>
              <li><a href="#" className="hover:text-white underline underline-offset-2 decoration-white/30">Conditions générales</a></li>
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-[13px] text-white/75 italic max-w-2xl">
              Merci pour la confiance que vous accordez à la recette traditionnelle du Vieux KOUKA.
            </p>
            <p className="text-[11.5px] text-white/50">
              © {new Date().getFullYear()} Vieux KOUKA · Tous droits réservés
            </p>
          </div>
        </div>
      </footer>

      {/* Espace mobile pour ne pas masquer le contenu par le CTA flottant */}
      <div className="md:hidden" aria-hidden="true" style={{ height: 'calc(64px + 12px + 20px + env(safe-area-inset-bottom, 0px))' }} />

      {/* Barre d'offre flottante mobile : Commander */}
      <StickyOfferBarRecommended product={product} stock={stock} />
    </div>
  );
}

/* ============================================================
 * SECTION 13 — LES OFFRES (composant local)
 * ============================================================ */

function OffersSection() {
  const product = ANTI_DIABETE;
  const discovery = product.offers.find((o) => o.units === 1) ?? product.offers[0];
  const reco = product.offers.find((o) => o.recommended) ?? product.offers[1] ?? product.offers[0];
  const family = product.offers.find((o) => o.bestValue) ?? product.offers[product.offers.length - 1];

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' F';

  const offers = [
    {
      key: 'discovery',
      title: 'Découverte',
      units: discovery.units,
      unitLabel: 'sachet',
      price: discovery.price,
      oldPrice: discovery.oldPrice,
      offerId: discovery.id,
      subtitle: 'Pour découvrir la recette.',
      perks: [
        '1 sachet pour tester',
        'Livraison rapide',
        'Paiement à la livraison',
      ],
      cta: 'Choisir cette offre',
      variant: 'muted' as const,
    },
    {
      key: 'complete',
      title: 'Cure complète',
      units: reco.units,
      unitLabel: 'sachets',
      price: reco.price,
      oldPrice: reco.oldPrice,
      offerId: reco.id,
      subtitle: 'La formule la plus choisie par nos clients.',
      perks: [
        'Cure complète recommandée',
        'Accompagnement WhatsApp personnalisé',
        'Meilleur équilibre qualité / prix',
        'Livraison prioritaire',
      ],
      cta: 'Je choisis la cure complète',
      variant: 'featured' as const,
      ribbon: '⭐ La plus choisie',
    },
    {
      key: 'family',
      title: 'Cure familiale',
      units: family.units,
      unitLabel: 'sachets',
      price: family.price,
      oldPrice: family.oldPrice,
      offerId: family.id,
      subtitle: 'Meilleur rapport quantité/prix.',
      perks: [
        '5 sachets — cure longue durée',
        'Idéal pour toute la famille',
        'Économie maximale',
        'Suivi WhatsApp inclus',
      ],
      cta: 'Choisir la cure familiale',
      variant: 'premium' as const,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-bleu-bg/40 via-white to-bleu-bg/40">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="anim-up inline-flex items-center gap-2 bg-rouge/10 text-rouge text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-rouge/20">
            🎯 NOS OFFRES
          </span>
          <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[38px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
            Choisissez la cure qui correspond à votre situation
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {offers.map((o, i) => {
            const featured = o.variant === 'featured';
            return (
              <div
                key={o.key}
                className={[
                  'anim-up relative flex flex-col rounded-3xl p-6 md:p-7 transition-all',
                  featured
                    ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 border-2 border-emerald-500 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)] md:-translate-y-2 md:scale-[1.03]'
                    : 'bg-white border border-bleu-light/25 shadow-[0_8px_25px_-12px_rgba(30,64,175,0.2)] hover:-translate-y-1 hover:shadow-[0_16px_35px_-12px_rgba(30,64,175,0.28)]',
                ].join(' ')}
                style={{ animationDelay: `${100 + i * 100}ms` }}
              >
                {o.ribbon && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[11.5px] md:text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    {o.ribbon}
                  </div>
                )}

                <div className="text-center">
                  <div className={`text-[11px] font-extrabold uppercase tracking-widest ${featured ? 'text-emerald-700' : 'text-bleu/70'}`}>
                    {o.title}
                  </div>
                  <div className={`mt-2 font-extrabold ${featured ? 'text-bleu text-[24px] md:text-[26px]' : 'text-bleu text-[20px] md:text-[22px]'}`}>
                    {o.units} {o.unitLabel}
                  </div>
                  <p className="text-slate-600 text-[13px] md:text-[13.5px] mt-1 leading-snug">{o.subtitle}</p>

                  <div className="mt-4 flex items-baseline gap-2 justify-center">
                    <span className={`font-extrabold ${featured ? 'text-rouge text-[30px] md:text-[34px]' : 'text-bleu text-[24px] md:text-[26px]'}`}>
                      {fmt(o.price)}
                    </span>
                    {o.oldPrice > o.price && (
                      <span className="text-slate-400 line-through text-[13px] md:text-[14px]">{fmt(o.oldPrice)}</span>
                    )}
                  </div>
                </div>

                <ul className="mt-5 space-y-2 flex-1">
                  {o.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[13.5px] md:text-[14px] text-slate-700 leading-snug">
                      <span className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-bold text-xs ${featured ? 'bg-emerald-600' : 'bg-bleu'}`}>
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => preselectAndScroll(o.offerId)}
                  className={[
                    'mt-6 w-full py-4 rounded-2xl font-extrabold text-[15px] md:text-[16px] transition-all',
                    featured
                      ? 'bg-rouge text-white shadow-[0_10px_25px_-8px_rgba(198,40,40,0.5)] hover:-translate-y-0.5'
                      : 'bg-rouge/90 text-white shadow-[0_6px_18px_-8px_rgba(198,40,40,0.45)] hover:bg-rouge hover:-translate-y-0.5',
                  ].join(' ')}
                >
                  {o.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bande de confiance sous les cartes */}
        <div className="anim-up mt-10 md:mt-12 max-w-4xl mx-auto" style={{ animationDelay: '500ms' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { i: '🚚', t: 'Paiement uniquement à la livraison' },
              { i: '📱', t: 'Confirmation par WhatsApp' },
              { i: '🇧🇫', t: 'Burkina Faso' },
              { i: '🇳🇪', t: 'Niger' },
            ].map((r) => (
              <div key={r.t} className="bg-white rounded-2xl border border-bleu-light/25 shadow-[0_4px_16px_-8px_rgba(30,64,175,0.15)] px-3 py-3 md:px-4 flex md:flex-col items-center gap-2 md:text-center">
                <span className="text-2xl md:text-3xl shrink-0">{r.i}</span>
                <span className="text-[12px] md:text-[12.5px] font-bold text-bleu leading-tight">{r.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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

