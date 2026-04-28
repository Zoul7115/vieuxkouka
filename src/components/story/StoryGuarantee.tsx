export function StoryGuarantee({
  title = 'Garantie "Guéri ou Remboursé"',
  text = 'Tu suis le traitement complet sans aucun résultat ? On te rembourse 100% — sans question, sans débat. Tu n\'as littéralement rien à perdre.',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-vert-bg border-b border-[oklch(0.92_0.02_130)]">
      <div className="container-story py-12 md:py-14">
        <div className="story-card p-6 md:p-8 max-w-3xl mx-auto flex items-start md:items-center gap-5 md:gap-7 flex-col md:flex-row text-center md:text-left">
          <div className="w-20 h-20 rounded-full bg-vert-mid text-white flex items-center justify-center text-4xl shrink-0 shadow-lg">
            🛡️
          </div>
          <div>
            <div className="story-eyebrow mb-1">100% sans risque</div>
            <h3 className="text-xl font-extrabold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
