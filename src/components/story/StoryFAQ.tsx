import { useState } from 'react';

export type FAQItem = { q: string; a: string };

export function StoryFAQ({ items, title = 'Questions fréquentes' }: { items: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="story-faq" className="bg-cream-2 border-b border-[oklch(0.92_0.02_130)]">
      <div className="container-story-narrow py-14 md:py-20">
        <div className="text-center mb-8">
          <div className="story-eyebrow mb-2">FAQ</div>
          <h2 className="story-h2">{title}</h2>
        </div>
        <div className="grid gap-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="story-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-cream-2/40 transition-colors"
                >
                  <span className="font-extrabold text-foreground">{it.q}</span>
                  <span className={`text-vert text-xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{it.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
