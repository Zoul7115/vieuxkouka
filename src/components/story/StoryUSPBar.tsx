type USP = { icon: string; title: string; desc?: string };

const DEFAULT: USP[] = [
  { icon: '🚚', title: 'Livraison 24-48h', desc: 'Gratuit à Ouaga' },
  { icon: '💵', title: 'Paiement livraison', desc: 'Cash à réception' },
  { icon: '🛡️', title: 'Garantie 100%', desc: 'Remboursé si insatisfait' },
  { icon: '🤐', title: 'Colis discret', desc: 'Aucune mention visible' },
];

export function StoryUSPBar({ items = DEFAULT }: { items?: USP[] }) {
  return (
    <section className="bg-cream-2 border-y border-[oklch(0.90_0.02_130)]">
      <div className="container-story py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((u) => (
            <div key={u.title} className="flex items-center gap-3">
              <span className="text-2xl shrink-0">{u.icon}</span>
              <div className="min-w-0">
                <div className="font-extrabold text-foreground text-sm leading-tight">{u.title}</div>
                {u.desc && <div className="text-xs text-muted-foreground truncate">{u.desc}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
