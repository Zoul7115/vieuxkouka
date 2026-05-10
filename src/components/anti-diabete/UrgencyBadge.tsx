import { useEffect, useState } from 'react';

const STORAGE_KEY = 'antidiab_urgency_exp';
const DURATION = 3 * 60 * 60 * 1000; // 3h

export function UrgencyBadge({ stock, variant = 'light' }: { stock: number; variant?: 'light' | 'dark' }) {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    let exp = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
    if (!exp || exp < Date.now()) {
      exp = Date.now() + DURATION;
      sessionStorage.setItem(STORAGE_KEY, String(exp));
    }
    const tick = () => {
      const d = Math.max(0, exp - Date.now());
      const h = Math.floor(d / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      const p = (n: number) => String(n).padStart(2, '0');
      setTime({ h: p(h), m: p(m), s: p(s) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const low = stock <= 8;
  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex flex-wrap items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold border-2 ${
        isDark
          ? 'bg-white/10 border-white/30 text-white backdrop-blur'
          : low
            ? 'bg-rouge-light border-rouge text-rouge animate-pulse'
            : 'bg-white border-bleu text-bleu'
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${low ? 'bg-rouge' : 'bg-bleu'} animate-ping`} />
        Stock restant : <b>{stock}</b> sachets
      </span>
      <span className="opacity-60">·</span>
      <span>
        Offre expire dans <b className="tabular-nums">{time.h}:{time.m}:{time.s}</b>
      </span>
    </div>
  );
}
