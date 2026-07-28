import { useEffect, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import waAvis1 from '@/assets/wa-avis-1.jpg.asset.json';
import waAvis2 from '@/assets/wa-avis-2.jpg.asset.json';
import waAvis3 from '@/assets/wa-avis-3.jpg.asset.json';
import audio12 from '@/assets/temoignage-12.mp3.asset.json';
import audio13 from '@/assets/temoignage-13.mp3.asset.json';
import audio14 from '@/assets/temoignage-14.mp3.asset.json';

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px 180px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const AVIS = [
  { quote: 'Vos produits sont super bons.', place: 'Cliente • Burkina Faso' },
  { quote: "Avant, j'allais uriner toutes les 10 minutes. Maintenant c'est calme.", place: 'Cliente • Burkina Faso' },
  { quote: 'La soif a beaucoup diminué. Hier nuit, je me suis levée une seule fois.', place: 'Cliente • Burkina Faso' },
  { quote: 'Je me sens beaucoup mieux qu\'avant. Je dors mieux et je suis moins fatiguée pendant la journée.', place: 'Cliente • Burkina Faso' },
  { quote: 'Au début, j\'avais des doutes. Aujourd\'hui, je suis contente d\'avoir essayé le traitement.', place: 'Cliente • Burkina Faso' },
  { quote: 'J\'avais toujours la bouche sèche et je buvais de l\'eau sans arrêt. Maintenant, ça a beaucoup diminué.', place: 'Client • Burkina Faso' },
  { quote: 'Je suis encore le traitement, mais je vois déjà une différence. Je continue avec confiance.', place: 'Cliente • Burkina Faso' },
  { quote: 'Après quelques semaines, je me sens déjà beaucoup mieux. Merci au Vieux Kouka pour ses conseils.', place: 'Client • Burkina Faso' },
];

const CAPTURES = [
  { src: waAvis1.url, alt: 'Conversation WhatsApp d’une cliente qui parle du traitement' },
  { src: waAvis2.url, alt: 'Témoignage WhatsApp d’une cliente de Bobo-Dioulasso' },
  { src: waAvis3.url, alt: 'Échange WhatsApp avec une cliente satisfaite du traitement' },
];

const AUDIOS = [
  { src: audio12.url, label: 'Témoignage client', note: 'Message vocal reçu sur WhatsApp' },
  { src: audio13.url, label: 'Témoignage client', note: 'Message vocal reçu sur WhatsApp' },
  { src: audio14.url, label: 'Témoignage client', note: 'Message vocal reçu sur WhatsApp' },
];

function fmt(t: number) {
  if (!isFinite(t) || t <= 0) return '--:--';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioCard({
  src,
  label,
  note,
  index,
  show,
}: {
  src: string;
  label: string;
  note: string;
  index: number;
  show: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch(() => {});
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = Math.max(0, Math.min(duration, pct * duration));
  };

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div
      className={`group rounded-[1.75rem] bg-white p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(25,118,210,0.45)] sm:p-7 ${
        show ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both' : 'opacity-0'
      }`}
      style={show ? { animationDelay: `${150 + index * 150}ms` } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-bleu-bg px-3.5 py-1.5 text-sm font-bold text-bleu">
          🎤 {label}
        </span>
        <span className="font-mono text-sm font-semibold text-muted-foreground">⏱️ {fmt(duration)}</span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Mettre en pause' : 'Écouter le témoignage'}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bleu text-xl text-white shadow-[0_14px_30px_-14px_rgba(25,118,210,0.9)] transition-transform hover:scale-105"
        >
          {playing ? <span className="font-black text-base">❚❚</span> : <span className="ml-0.5">▶</span>}
        </button>

        <div className="min-w-0 flex-1">
          <div className="h-2.5 cursor-pointer overflow-hidden rounded-full bg-bleu-bg" onClick={seek}>
            <div className="h-full rounded-full bg-bleu transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>{fmt(time)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{note}</p>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}

function AvisCarousel() {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: false },
    [autoplay.current]
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {AVIS.map((a, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%] pr-5 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <figure className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(25,118,210,0.45)]">
                <div className="text-lg tracking-wide" aria-label="5 étoiles sur 5">
                  ⭐⭐⭐⭐⭐
                </div>
                <blockquote className="mt-5 flex-1 text-lg font-bold leading-[1.6] text-foreground">
                  « {a.quote} »
                </blockquote>
                <figcaption className="mt-6 text-sm font-semibold text-muted-foreground">📍 {a.place}</figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Flèches de navigation */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Témoignage précédent"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-bleu shadow-sm ring-1 ring-bleu/15 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          ←
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Témoignage suivant"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-bleu shadow-sm ring-1 ring-bleu/15 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function TemoignagesSection() {
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>(0.2);
  const { ref: avisRef, inView: avisIn } = useInView<HTMLDivElement>(0.1);
  const { ref: waRef, inView: waIn } = useInView<HTMLDivElement>(0.1);
  const { ref: audioRef, inView: audioIn } = useInView<HTMLDivElement>(0.1);
  const { ref: noteRef, inView: noteIn } = useInView<HTMLDivElement>(0.25);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom]);

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: 'smooth' });
  };

  return (
    <section id="temoignages" className="relative isolate overflow-hidden bg-bleu-bg/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-10rem] h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-60"
      />

      <div className="container-kouka relative py-16 sm:py-20 lg:py-24">
        {/* Titre */}
        <div
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center ${
            headerIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-bleu shadow-sm ring-1 ring-bleu/10">
            💬 Vrais retours de clients
          </span>
          <h2 className="mt-6 font-body text-[2rem] font-extrabold leading-[1.15] text-foreground sm:text-[2.6rem] lg:text-[3rem]">
            Ils ont essayé le traitement. Voici ce qu&apos;ils racontent.
          </h2>
          <p className="mt-6 text-lg leading-[1.8] text-muted-foreground sm:text-xl">
            Chaque personne est différente. Voici quelques retours de clients qui ont accepté de partager leur
            expérience avec le traitement traditionnel du Vieux Kouka.
          </p>
        </div>

        {/* BLOC 1 — Avis marquants (carrousel) */}
        <div ref={avisRef} className="mt-12 lg:mt-14">
          <div
            className={`mb-8 text-center sm:mb-10 ${
              avisIn ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both' : 'opacity-0'
            }`}
          >
            <h3 className="font-body text-[1.6rem] font-extrabold leading-[1.2] text-foreground sm:text-[2rem]">
              Ce que disent nos clients
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-base leading-[1.75] text-muted-foreground sm:text-lg">
              De vrais retours d&apos;expérience de personnes qui ont suivi le traitement.
            </p>
          </div>
          <div
            className={
              avisIn ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both' : 'opacity-0'
            }
          >
            <AvisCarousel />
          </div>
        </div>

        {/* BLOC 2 — Conversations WhatsApp */}
        <div ref={waRef} className="mt-14 lg:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h3 className="font-body text-[1.8rem] font-extrabold leading-[1.2] text-foreground sm:text-[2.2rem]">
                Leurs messages WhatsApp
              </h3>
              <p className="mt-3 max-w-xl text-lg leading-[1.75] text-muted-foreground">
                De vraies conversations, sans retouche. Touchez une image pour l&apos;agrandir.
              </p>
            </div>
            <div className="hidden gap-3 lg:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Capture précédente"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-bleu shadow-sm ring-1 ring-bleu/15 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Capture suivante"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-bleu shadow-sm ring-1 ring-bleu/15 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CAPTURES.map((c, i) => (
              <button
                type="button"
                key={c.src}
                onClick={() => setZoom(c.src)}
                className={`group w-[78%] shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-white p-2.5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(25,118,210,0.45)] sm:w-[46%] lg:w-[31%] ${
                  waIn ? 'animate-in fade-in duration-700 fill-mode-both' : 'opacity-0'
                }`}
                style={waIn ? { animationDelay: `${150 + i * 150}ms` } : undefined}
              >
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  className="h-[26rem] w-full rounded-[1.4rem] object-cover object-top sm:h-[30rem]"
                />
                <span className="block py-3 text-sm font-semibold text-bleu">🔍 Agrandir la conversation</span>
              </button>
            ))}
          </div>
        </div>

        {/* BLOC 3 — Audios */}
        <div ref={audioRef} className="mt-14 lg:mt-16">
          <h3 className="font-body text-[1.8rem] font-extrabold leading-[1.2] text-foreground sm:text-[2.2rem]">
            Écoutez leurs témoignages
          </h3>
          <p className="mt-3 max-w-xl text-lg leading-[1.75] text-muted-foreground">
            Des messages vocaux envoyés par de vrais clients.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {AUDIOS.map((a, i) => (
              <AudioCard key={a.src} {...a} index={i} show={audioIn} />
            ))}
          </div>
        </div>

        {/* BLOC 4 — Réassurance */}
        <div
          ref={noteRef}
          className={`mt-12 rounded-[1.75rem] bg-bleu-bg/70 p-8 text-center ring-1 ring-bleu/10 sm:p-10 lg:mt-16 ${
            noteIn ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both' : 'opacity-0'
          }`}
        >
          <p className="mx-auto max-w-3xl text-lg leading-[1.85] text-foreground sm:text-xl">
            Chaque personne est différente. Les témoignages présentés sur cette page racontent l&apos;expérience de nos
            clients. Chaque personne peut vivre une expérience différente selon sa situation.
          </p>
        </div>

      </div>

      {/* Lightbox */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Capture WhatsApp agrandie"
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/80 p-4 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setZoom(null)}
            aria-label="Fermer"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-foreground shadow-lg"
          >
            ✕
          </button>
          <img
            src={zoom}
            alt="Conversation WhatsApp agrandie"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
