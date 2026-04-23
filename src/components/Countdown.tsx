import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kouka_countdown_exp';
const DURATION = 4 * 60 * 60 * 1000; // 4h

export function Countdown({ label = '⏰ Offre –60% expire dans :' }: { label?: string }) {
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

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white border-2 border-or-light rounded-xl px-4 py-2.5 shadow-md">
      <span className="text-xs font-bold text-or uppercase tracking-wide">{label}</span>
      <div className="flex gap-1.5">
        {(['h', 'm', 's'] as const).map((k, i) => (
          <div key={k} className="bg-vert rounded-lg px-3 py-2 text-center min-w-[50px]">
            <span className="block text-2xl font-extrabold text-white leading-none">{time[k]}</span>
            <span className="text-[10px] text-white/80 uppercase">{['H', 'Min', 'Sec'][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
