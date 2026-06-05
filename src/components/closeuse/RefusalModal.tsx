import { useState } from 'react';

export const REFUSAL_REASONS = [
  'Numéro injoignable',
  "Pas d'argent",
  'Plus intéressé',
  'Adresse incorrecte',
  'Faux prospect',
  'Commande doublon',
  'Achat reporté',
  'Déjà acheté ailleurs',
  'Autre',
] as const;

export function RefusalModal({ open, title, onCancel, onConfirm }: {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: (reason: string, comment: string) => void;
}) {
  const [reason, setReason] = useState<string>('');
  const [comment, setComment] = useState('');
  if (!open) return null;
  const requiresComment = reason === 'Autre';
  const canSubmit = !!reason && (!requiresComment || comment.trim().length >= 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-3">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-3">
        <div className="font-extrabold text-rose-900 text-lg">{title}</div>
        <div className="text-xs text-gray-600">Motif obligatoire :</div>
        <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto">
          {REFUSAL_REASONS.map((r) => (
            <label key={r} className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 cursor-pointer text-sm ${reason === r ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
              <input type="radio" name="r" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-rose-600" />
              {r}
            </label>
          ))}
        </div>
        {requiresComment && (
          <textarea
            value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Précisez (obligatoire)…"
            rows={2}
            className="w-full border-2 border-rose-200 rounded-lg p-2 text-sm outline-none focus:border-rose-500"
          />
        )}
        <div className="flex gap-2 pt-1">
          <button onClick={onCancel} className="flex-1 bg-gray-100 text-gray-800 font-bold py-2 rounded-lg">Annuler</button>
          <button
            disabled={!canSubmit}
            onClick={() => onConfirm(reason, comment.trim())}
            className="flex-1 bg-rose-600 text-white font-bold py-2 rounded-lg disabled:opacity-40"
          >Confirmer</button>
        </div>
      </div>
    </div>
  );
}
