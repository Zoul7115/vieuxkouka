const COUNTRIES = [
  { flag: '🇧🇫', name: 'Burkina Faso' },
  { flag: '🇳🇪', name: 'Niger' },
  { flag: '🇨🇮', name: "Côte d'Ivoire" },
  { flag: '🇲🇱', name: 'Mali' },
  { flag: '🇬🇳', name: 'Guinée' },
  { flag: '🇸🇳', name: 'Sénégal' },
];

/**
 * Petit bloc discret listant les pays livrés — placé avant les offres.
 */
export function DeliveryCountries() {
  return (
    <section className="bg-card py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-bleu-mid">
          🚚 Livraison disponible dans plusieurs pays
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {COUNTRIES.map((c) => (
            <span
              key={c.name}
              className="inline-flex items-center gap-2 rounded-full border border-bleu/15 bg-bleu-bg/60 px-4 py-2 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="text-base leading-none">{c.flag}</span>
              {c.name}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          Paiement à la livraison · Colis neutre et discret
        </p>
      </div>
    </section>
  );
}
