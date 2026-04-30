import { useState } from 'react';

type Question = { q: string; options: string[] };

export function MiniDiagnostic({
  title = 'Diagnostic rapide — 30 secondes',
  questions,
  recommendation,
}: {
  title?: string;
  questions: Question[];
  recommendation: (answers: number[]) => { offerHint: string; message: string };
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  if (done) {
    const reco = recommendation(answers);
    return (
      <div className="bloc bloc-ok text-center max-w-[480px] mx-auto">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-vert mb-2">Recommandation personnalisée</h3>
        <p className="text-sm text-muted-foreground mb-3">{reco.message}</p>
        <div className="bg-vert text-white rounded-xl px-4 py-3 font-extrabold text-base mb-3">
          👉 {reco.offerHint}
        </div>
        <button
          onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full bg-rouge text-white py-3 rounded-xl font-extrabold"
        >
          Voir cette offre ↓
        </button>
      </div>
    );
  }

  const current = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="bloc max-w-[480px] mx-auto bg-white border-2 border-vert-bg">
      <div className="text-xs text-muted-foreground font-bold mb-2">{title}</div>
      <div className="h-1.5 bg-vert-bg rounded-full overflow-hidden mb-4">
        <div className="h-full bg-vert-mid transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-xs text-muted-foreground mb-2">Question {step + 1}/{questions.length}</div>
      <h3 className="text-base font-extrabold text-foreground mb-3">{current.q}</h3>
      <div className="grid gap-2">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              const next = [...answers, i];
              setAnswers(next);
              if (step + 1 >= questions.length) setDone(true);
              else setStep(step + 1);
            }}
            className="text-left bg-vert-bg/40 border-2 border-vert-bg hover:border-vert-mid hover:bg-vert-bg transition-colors rounded-xl px-4 py-3 text-sm font-semibold text-foreground"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
