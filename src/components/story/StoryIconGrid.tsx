type Item = { icon: string; title: string; desc?: string };

export function StoryIconGrid({
  eyebrow,
  title,
  subtitle,
  items,
  cols = 4,
  bg = 'white',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: Item[];
  cols?: 3 | 4 | 5;
  bg?: 'white' | 'cream' | 'vert';
}) {
  const bgClass = bg === 'cream' ? 'bg-cream-2' : bg === 'vert' ? 'bg-vert-bg/40' : 'bg-white';
  const colsClass = cols === 5 ? 'md:grid-cols-5' : cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';
  return (
    <section className={`${bgClass} border-b border-[oklch(0.92_0.02_130)]`}>
      <div className="container-story py-12 md:py-16 text-center">
        {eyebrow && <div className="story-eyebrow mb-2">{eyebrow}</div>}
        <h2 className="story-h2 mb-3">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{subtitle}</p>
        )}
        <div className={`grid grid-cols-2 ${colsClass} gap-4 text-left`}>
          {items.map((it) => (
            <div key={it.title} className="story-card p-5 text-center">
              <div className="text-4xl mb-3">{it.icon}</div>
              <div className="font-extrabold text-foreground">{it.title}</div>
              {it.desc && <div className="text-sm text-muted-foreground mt-1">{it.desc}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
