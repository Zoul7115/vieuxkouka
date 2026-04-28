type Review = { name: string; stars: number; title?: string; text: string; verified?: boolean };

export function StoryReviews({
  rating = 4.9,
  count = 217,
  reviews,
}: {
  rating?: number;
  count?: number;
  reviews: Review[];
}) {
  return (
    <section id="story-reviews" className="bg-white border-b border-[oklch(0.92_0.02_130)]">
      <div className="container-story py-14 md:py-20">
        <div className="text-center mb-10">
          <div className="story-eyebrow mb-2">Avis clients</div>
          <h2 className="story-h2 mb-3">Ils ont essayé. Ils sont guéris.</h2>
          <div className="inline-flex items-center gap-3">
            <span className="story-stars text-2xl">★★★★★</span>
            <span className="font-extrabold text-foreground">{rating}/5</span>
            <span className="text-muted-foreground">· {count} avis vérifiés</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <article key={i} className="story-card p-6 flex flex-col">
              <div className="story-stars text-lg mb-2">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
              {r.title && <div className="font-extrabold text-foreground mb-1">{r.title}</div>}
              <p className="italic text-muted-foreground leading-relaxed mb-4 flex-1">"{r.text}"</p>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{r.name}</span>
                {r.verified !== false && (
                  <span className="bg-vert-bg text-vert font-extrabold px-2 py-0.5 rounded">✓ Vérifié</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
