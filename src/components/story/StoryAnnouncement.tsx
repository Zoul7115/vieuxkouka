import { useEffect, useState } from 'react';

const DEFAULT = [
  '🚚 Livraison GRATUITE à Ouagadougou',
  '💵 Paiement à la livraison · Cash uniquement',
  '🛡️ Garantie : Guéri ou Remboursé 100%',
  '🤐 Colis 100% discret · Personne ne sait',
];

export function StoryAnnouncement({ messages = DEFAULT, intervalMs = 4500 }: { messages?: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), intervalMs);
    return () => clearInterval(t);
  }, [messages.length, intervalMs]);
  return (
    <div className="bg-vert text-white text-center text-xs sm:text-sm font-semibold py-2 px-4">
      <span key={i} className="inline-block animate-in fade-in duration-500">{messages[i]}</span>
    </div>
  );
}
