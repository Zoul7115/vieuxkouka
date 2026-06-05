const ITEMS = [
  { icon: '💵', label: 'Paiement à la livraison' },
  { icon: '🚚', label: 'Livraison rapide' },
  { icon: '📞', label: 'Service client disponible' },
  { icon: '🤝', label: 'Accompagnement personnalisé' },
  { icon: '🔒', label: 'Commande simple & sécurisée' },
];

export function ReassuranceBar() {
  return (
    <section className="sec py-6 bg-vert-bg/40">
      <div className="container-kouka max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ITEMS.map((it) => (
            <div
              key={it.label}
              className="bg-white rounded-xl border border-vert-bg px-3 py-3 flex flex-col items-center text-center gap-1"
            >
              <span className="text-2xl">{it.icon}</span>
              <span className="text-xs font-bold text-foreground leading-tight">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
