import { useEffect, useState } from 'react';

/** Compte à rebours avant la fin de la journée (17h cutoff livraison) */
export function UrgencyTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setHours(17, 0, 0, 0);
      if (now > cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = Math.max(0, cutoff.getTime() - now.getTime());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="max-w-[480px] mx-auto bg-rouge text-white rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3 shadow-md">
      <div className="text-sm font-bold leading-tight">
        ⏰ Commande avant 17h<br />
        <span className="text-xs opacity-90">Livraison dès demain matin</span>
      </div>
      <div className="flex gap-1.5 font-mono">
        {[
          { v: time.h, l: 'H' },
          { v: time.m, l: 'M' },
          { v: time.s, l: 'S' },
        ].map((t) => (
          <div key={t.l} className="bg-white/20 rounded px-2 py-1 text-center min-w-[36px]">
            <div className="text-lg font-extrabold leading-none">{pad(t.v)}</div>
            <div className="text-[9px] opacity-80">{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
