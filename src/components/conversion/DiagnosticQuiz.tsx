import { useState } from 'react';

function scrollToOrder() {
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function DiagnosticQuiz({
  title = 'Quel est votre profil ?',
  intro = 'Sélectionnez ce qui vous correspond — nous vous recommandons l\'offre la plus adaptée.',
  questions,
  recommendationText = 'Selon vos réponses, nous recommandons la cure complète.',
}: {
  title?: string;
  intro?: string;
  questions: string[];
  recommendationText?: string;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  const hasAny = selected.size > 0;

  return (
    <section className="sec">
      <div className="container-kouka max-w-2xl">
        <div className="text-center mb-4">
          <span className="inline-block bg-vert-bg text-vert text-xs font-extrabold uppercase px-3 py-1.5 rounded-full mb-3">
            🩺 Mini-diagnostic
          </span>
          <h2 className="text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm">{intro}</p>
        </div>

        <div className="bloc grid gap-2">
          {questions.map((q, i) => {
            const sel = selected.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  sel
                    ? 'border-vert bg-vert-bg text-foreground'
                    : 'border-vert-bg bg-white hover:border-vert-mid'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    sel ? 'bg-vert border-vert text-white' : 'border-muted-foreground/40'
                  }`}
                >
                  {sel ? '✓' : ''}
                </span>
                <span className="font-bold text-sm">{q}</span>
              </button>
            );
          })}

          {hasAny && (
            <div className="mt-4 bg-rouge-light border-2 border-rouge rounded-xl p-4">
              <div className="text-xs font-extrabold uppercase text-rouge mb-1">
                ⭐ Recommandation personnalisée
              </div>
              <p className="text-foreground font-bold mb-3 text-sm">{recommendationText}</p>
              <button
                onClick={scrollToOrder}
                className="w-full bg-rouge text-white py-3 rounded-xl font-extrabold shadow-[0_4px_14px_rgba(198,40,40,0.40)] active:scale-95 transition"
              >
                🔥 Voir l'offre recommandée
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
