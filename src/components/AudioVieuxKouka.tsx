import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  productSlug: 'kouka' | 'sirop-kouka' | 'anti-diabete';
  title?: string;
  subtitle?: string;
};

function fmt(t: number) {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioVieuxKouka({
  src,
  productSlug,
  title = '🎙️ Le Vieux KOUKA te parle',
  subtitle = 'Message vocal personnel · Écoute avant de commander',
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPlayed(localStorage.getItem(`audio_played_${productSlug}`) === '1');
    }
  }, [productSlug]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => {});
      if (!played) {
        setPlayed(true);
        try { localStorage.setItem(`audio_played_${productSlug}`, '1'); } catch {/* noop */}
        // Tracking visite
        try {
          import('@/integrations/supabase/client').then(({ supabase }) => {
            supabase.from('visits').insert({ page: `audio_played_${productSlug}`, source: 'audio' }).then(() => {});
          });
        } catch {/* noop */}
        // Facebook Pixel
        try {
          const w = window as unknown as { fbq?: (...args: unknown[]) => void };
          if (typeof w.fbq === 'function') {
            w.fbq('trackCustom', 'AudioPlayed', { product: productSlug });
          }
        } catch {/* noop */}
      }
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = Math.max(0, Math.min(duration, pct * duration));
  };

  const skip = (sec: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(duration || 0, a.currentTime + sec));
  };

  const cycleRate = () => {
    const next = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <section className="container-kouka py-6">
      <div className="relative max-w-2xl mx-auto">
        {/* Halo doré pulsant */}
        {!played && (
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[oklch(0.85_0.16_85)] via-[oklch(0.75_0.18_60)] to-[oklch(0.85_0.16_85)] opacity-70 blur-md animate-pulse" />
        )}

        <div className="relative bg-gradient-to-br from-vert to-[oklch(0.30_0.10_145)] text-white rounded-3xl p-5 sm:p-6 shadow-[0_18px_50px_-12px_rgba(46,125,50,0.55)] border-[3px] border-or-light">
          {/* Bandeau "EN DIRECT" */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 bg-rouge text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {played ? 'Écouté' : 'Vocal du Vieux'}
            </span>
            <span className="text-xs text-white/80 font-semibold">🎧 ~1 min</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Avatar / Bouton play combinés */}
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Lecture'}
              className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-or-light text-vert flex items-center justify-center text-3xl sm:text-4xl shadow-2xl hover:scale-105 transition-transform ${
                !playing && !played ? 'pulse-ring' : ''
              }`}
            >
              {playing ? (
                <span className="font-black">❚❚</span>
              ) : (
                <span className="ml-1">▶</span>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-base sm:text-lg leading-tight">{title}</div>
              <div className="text-xs sm:text-sm text-white/85 mt-0.5">{subtitle}</div>

              {/* Barre de progression */}
              <div
                className="mt-3 h-2.5 bg-white/20 rounded-full cursor-pointer overflow-hidden"
                onClick={seek}
              >
                <div
                  className="h-full bg-gradient-to-r from-or to-or-light transition-[width] duration-150"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[11px] text-white/80 font-mono">
                <span>{fmt(time)}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => skip(-10)} className="hover:text-or-light transition-colors" aria-label="Reculer 10s">⏮ 10s</button>
                  <button onClick={cycleRate} className="bg-white/15 px-2 py-0.5 rounded font-bold hover:bg-white/25 transition-colors">
                    {rate}x
                  </button>
                  <button onClick={() => skip(15)} className="hover:text-or-light transition-colors" aria-label="Avancer 15s">15s ⏭</button>
                </div>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          </div>

          {/* Message après écoute */}
          {played && (
            <div className="mt-4 bg-white/10 rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-2">
              ✅ Tu as écouté le Vieux. Maintenant choisis ton pack
              <span className="ml-auto text-or-light text-lg animate-bounce">👇</span>
            </div>
          )}

          <audio
            ref={audioRef}
            src={src}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          />
        </div>

        {/* Sous-texte de réassurance */}
        <p className="text-center text-xs text-muted-foreground mt-2.5">
          🔊 Active le son · Le Vieux explique pourquoi son remède marche là où les autres échouent
        </p>
      </div>
    </section>
  );
}
