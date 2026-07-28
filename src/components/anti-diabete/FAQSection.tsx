import { useRef, useState, useEffect } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '@/lib/utils';

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const FAQS = [
  {
    question: 'Comment utiliser le traitement ?',
    answer:
      'Le traitement est simple à utiliser. Une fois votre commande reçue, vous recevrez toutes les explications pour suivre correctement votre cure de 40 jours.',
  },
  {
    question: 'Est-ce que je peux continuer mes médicaments ?',
    answer:
      'Si vous prenez déjà un traitement prescrit par votre médecin, ne l’arrêtez pas de votre propre initiative. En cas de doute, demandez conseil à votre médecin ou à votre professionnel de santé.',
  },
  {
    question: 'En combien de temps peut-on voir une différence ?',
    answer:
      'Chaque personne est différente. Certaines personnes remarquent des changements rapidement. Pour d’autres, cela peut prendre un peu plus de temps. L’important est de suivre correctement le traitement.',
  },
  {
    question: 'Dans quels pays livrez-vous ?',
    answer: (
      <>
        <p>Nous livrons dans plusieurs pays d’Afrique de l’Ouest, notamment :</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {['Burkina Faso', 'Niger', 'Côte d’Ivoire', 'Mali', 'Guinée', 'Sénégal'].map((pays) => (
            <li key={pays} className="flex items-center gap-2 text-foreground">
              <span className="text-bleu">✔</span>
              {pays}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    question: 'Comment se passe le paiement ?',
    answer:
      'Vous payez uniquement lorsque vous recevez votre commande. Aucun paiement à l’avance.',
  },
  {
    question: 'Et si j’ai une question pendant le traitement ?',
    answer:
      'Notre équipe reste disponible pour répondre à vos questions et vous accompagner tout au long de votre traitement.',
  },
  {
    question: 'Est-ce que tout le monde obtient les mêmes résultats ?',
    answer:
      'Non. Chaque personne est différente. Les résultats peuvent varier selon votre situation et la façon dont vous suivez le traitement.',
  },
];

const FAQItem = ({
  item,
  index,
  show,
}: {
  item: { question: string; answer: React.ReactNode };
  index: number;
  show: boolean;
}) => {
  return (
    <AccordionPrimitive.Item
      value={`faq-${index}`}
      className={cn(
        'overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] ring-1 ring-bleu/10 transition-all duration-300 focus-within:ring-bleu/20',
        show ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both' : 'opacity-0'
      )}
      style={show ? { animationDelay: `${100 + index * 90}ms` } : undefined}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 p-5 text-left sm:p-7">
          <span className="font-body text-base font-extrabold leading-snug text-foreground sm:text-lg lg:text-xl">
            {item.question}
          </span>
          <span
            aria-hidden
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bleu-bg text-bleu transition-colors duration-300 group-hover:bg-bleu/10 sm:h-10 sm:w-10"
          >
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-light transition-all duration-300 group-data-[state=open]:opacity-0 group-data-[state=open]:rotate-90">
              +
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-light opacity-0 rotate-90 transition-all duration-300 group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-0">
              −
            </span>
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="px-5 pb-6 pt-0 text-base leading-[1.8] text-muted-foreground sm:px-7 sm:pb-7 sm:text-lg">
          {item.answer}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};

export function FAQSection() {
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>(0.2);
  const { ref: listRef, inView: listIn } = useInView<HTMLDivElement>(0.1);
  const { ref: ctaRef, inView: ctaIn } = useInView<HTMLDivElement>(0.2);

  const scrollToOrder = () => {
    const el = document.getElementById('order-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="faq" className="relative isolate overflow-hidden bg-gradient-to-b from-white via-bleu-bg/40 to-bleu-bg/60">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-bleu-bg blur-3xl opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none -bottom-40 right-[-10rem] h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-50"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* En-tête */}
        <div
          ref={headerRef}
          className={cn(
            'mx-auto max-w-3xl text-center',
            headerIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-bleu shadow-sm ring-1 ring-bleu/10">
            ❓ Questions fréquentes
          </span>
          <h2 className="mt-6 font-body text-[2rem] font-extrabold leading-[1.15] text-foreground sm:text-[2.6rem] lg:text-[3rem]">
            Vous avez encore des questions ?
          </h2>
          <p className="mt-6 text-lg leading-[1.8] text-muted-foreground sm:text-xl">
            Voici les réponses aux questions que nos clients nous posent le plus souvent avant de commander.
          </p>
        </div>

        {/* Accordéon */}
        <AccordionPrimitive.Root
          ref={listRef}
          type="single"
          collapsible
          className={cn('mt-14 space-y-5 sm:mt-12 lg:mt-14')}
          defaultValue="faq-0"
        >
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} show={listIn} />
          ))}
        </AccordionPrimitive.Root>

        {/* Bloc final de réassurance */}
        <div
          ref={ctaRef}
          className={cn(
            'mt-12 rounded-[2rem] bg-bleu p-8 text-center shadow-[0_24px_60px_-28px_rgba(25,118,210,0.5)] ring-1 ring-white/10 sm:mt-14 sm:p-12 lg:mt-16',
            ctaIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 fill-mode-both' : 'opacity-0'
          )}
        >
          <h3 className="font-body text-2xl font-extrabold text-white sm:text-[2.2rem]">
            Prêt à commencer votre traitement ?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-[1.7] text-white/90 sm:text-xl">
            Commandez votre traitement aujourd’hui et profitez du paiement à la livraison.
          </p>
          <button
            type="button"
            onClick={scrollToOrder}
            className="mt-9 inline-flex items-center justify-center rounded-xl bg-rouge px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl sm:text-lg"
          >
            Je commande maintenant
          </button>
        </div>
      </div>
    </section>
  );
}
