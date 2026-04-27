import { useState } from 'react';
import { PERIODS, type PeriodKey } from '@/lib/periods';

export function PeriodSelector({
  value, onChange, customFrom, customTo, onCustomChange,
}: {
  value: PeriodKey;
  onChange: (k: PeriodKey) => void;
  customFrom?: string;
  customTo?: string;
  onCustomChange?: (from: string, to: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PERIODS.map((p) => (
        <button
          key={p.k}
          onClick={() => { onChange(p.k); if (p.k === 'custom') setOpen(true); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            value === p.k ? 'bg-vert-mid text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground hover:border-vert-mid'
          }`}
        >
          {p.label}
        </button>
      ))}
      {(value === 'custom' || open) && (
        <div className="flex items-center gap-1.5 bg-white border-2 border-vert-bg rounded-full px-2 py-1">
          <input
            type="date" value={customFrom || ''}
            onChange={(e) => onCustomChange?.(e.target.value, customTo || '')}
            className="text-xs outline-none bg-transparent"
          />
          <span className="text-xs text-muted-foreground">→</span>
          <input
            type="date" value={customTo || ''}
            onChange={(e) => onCustomChange?.(customFrom || '', e.target.value)}
            className="text-xs outline-none bg-transparent"
          />
        </div>
      )}
    </div>
  );
}
