import type { ReactNode } from 'react';

export function StoryFeaturedRow({
  eyebrow,
  title,
  children,
  image,
  imageAlt = '',
  reverse = false,
  bg = 'white',
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  image: string;
  imageAlt?: string;
  reverse?: boolean;
  bg?: 'white' | 'cream' | 'vert';
}) {
  const bgClass =
    bg === 'cream' ? 'bg-cream-2' : bg === 'vert' ? 'bg-vert-bg/40' : 'bg-white';
  return (
    <section className={`${bgClass} border-b border-[oklch(0.92_0.02_130)]`}>
      <div className="container-story py-12 md:py-16">
        <div className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
          <div className={reverse ? 'md:[direction:ltr]' : ''}>
            <div className="rounded-2xl overflow-hidden border border-[oklch(0.92_0.02_130)] bg-cream-2 story-shadow-lg">
              <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className={reverse ? 'md:[direction:ltr]' : ''}>
            {eyebrow && <div className="story-eyebrow mb-2">{eyebrow}</div>}
            <h2 className="story-h2 mb-4">{title}</h2>
            <div className="text-base leading-relaxed text-muted-foreground space-y-3">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
