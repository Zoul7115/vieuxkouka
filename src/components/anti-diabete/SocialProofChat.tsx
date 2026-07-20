import { useEffect, useRef, useState } from 'react';

type WAMessage = {
  from: 'client' | 'me';
  text: string;
  time: string;
  status?: '✓' | '✓✓';
};

type WAConversation = {
  name: string;
  avatar: string;
  city: string;
  messages: WAMessage[];
};

const CONVERSATIONS: WAConversation[] = [
  {
    name: 'Adama O.',
    city: 'Bobo-Dioulasso',
    avatar: '👨🏾',
    messages: [
      { from: 'client', text: 'Bonjour, j\'ai reçu le paquet hier soir 🙏', time: '08:12' },
      { from: 'me', text: 'Bienvenue Adama 🙏 commence ce matin à jeun comme expliqué.', time: '08:14', status: '✓✓' },
      { from: 'client', text: 'Ok déjà fait. Ma glycémie ce matin était à 1.42 alors qu\'avant c\'était 2.10 😳', time: '09:05' },
      { from: 'client', text: 'Je continue combien de jours ?', time: '09:05' },
      { from: 'me', text: 'Bravo 👏 termine le sachet entier puis on refait le point.', time: '09:08', status: '✓✓' },
      { from: 'client', text: 'Merci infiniment, je vais commander 2 autres pour ma maman aussi 🤲', time: '09:10' },
    ],
  },
  {
    name: 'Mariam K.',
    city: 'Niamey',
    avatar: '👩🏾',
    messages: [
      { from: 'client', text: 'Le Vieux, ça fait 10 jours que je prends la poudre', time: '19:22' },
      { from: 'client', text: 'Les picotements dans mes pieds ont disparu 😭🙏', time: '19:22' },
      { from: 'me', text: 'Allahou akbar 🌿 c\'est exactement le but. Continue jusqu\'au bout.', time: '19:30', status: '✓✓' },
      { from: 'client', text: 'Je dors enfin la nuit sans me lever pour uriner', time: '19:31' },
      { from: 'client', text: 'Vous m\'avez sauvée. Je vais parler de vous à la mosquée 🤲', time: '19:32' },
    ],
  },
  {
    name: 'Issa T.',
    city: 'Ouagadougou',
    avatar: '👨🏿',
    messages: [
      { from: 'client', text: 'Bonjour, mon médecin m\'a dit que ma glycémie est passée de 2.8 à 1.3 🙌', time: '14:02' },
      { from: 'client', text: 'Il m\'a demandé ce que je prenais 😅', time: '14:02' },
      { from: 'me', text: 'Mashallah Issa 🌿 garde le cap, ne stoppe pas les médicaments brutalement.', time: '14:10', status: '✓✓' },
      { from: 'client', text: 'Compris. Je veux commander 3 sachets de plus pour finir tranquille.', time: '14:11' },
    ],
  },
];

type FBComment = {
  name: string;
  city: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  replies?: { name: string; text: string; likes: number }[];
};

const COMMENTS: FBComment[] = [
  {
    name: 'Aminata Sawadogo',
    city: 'Ouaga',
    avatar: '👩🏾‍🦱',
    text: 'Wallahi je confirme ! Ma tante prenait la metformine depuis 8 ans, sa glycémie restait élevée. 3 semaines de poudre du Vieux KOUKA et elle est descendue à 1.2 😱 Que Dieu vous bénisse 🙏',
    likes: 247,
    time: 'Il y a 2 j',
    replies: [
      { name: 'Le Vieux KOUKA 🌿', text: 'Merci ma fille 🙏 dis à ta tante de continuer la cure complète.', likes: 38 },
      { name: 'Salimata B.', text: 'Aminata stp envoie-moi le contact en privé 🙏', likes: 12 },
    ],
  },
  {
    name: 'Boukary Ouédraogo',
    city: 'Bobo',
    avatar: '🧔🏾',
    text: 'Au début j\'ai douté hein 😅 mais après 14 jours, fini les soifs incontrôlables et la fatigue le matin. J\'ai même perdu 4 kg. Je recommande à 200%.',
    likes: 189,
    time: 'Il y a 5 j',
    replies: [
      { name: 'Habibou D.', text: 'Frère c\'est combien le pack complet ?', likes: 7 },
      { name: 'Boukary Ouédraogo', text: '@Habibou 25 000 les 3 sachets, livré chez toi cash. Vas-y les yeux fermés 🤝', likes: 22 },
    ],
  },
  {
    name: 'Zalissa Compaoré',
    city: 'Koudougou',
    avatar: '👩🏾',
    text: 'Mon mari ne croyait pas aux remèdes traditionnels. Aujourd\'hui c\'est lui qui rappelle pour commander pour son grand frère 😂 Merci au Vieux ❤️',
    likes: 312,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Fatim N.', text: '😂😂 c\'est pareil avec mon papa', likes: 19 },
    ],
  },
  {
    name: 'Hamidou Maïga',
    city: 'Niamey',
    avatar: '🧓🏾',
    text: 'À 67 ans avec un diabète depuis 12 ans, je pensais que c\'était fini pour moi. La poudre m\'a redonné de l\'énergie comme à 50 ans. Vision claire, plus de vertiges. Allah ya saka 🤲',
    likes: 421,
    time: 'Il y a 1 sem',
  },
  {
    name: 'Aïcha Diallo',
    city: 'Tenkodogo',
    avatar: '👩🏾‍🦰',
    text: 'Reçu hier en moins de 24h, le livreur a été très discret 👌 J\'ai commencé ce matin, je reviens vous dire dans 2 semaines incha\'Allah.',
    likes: 87,
    time: 'Il y a 3 j',
  },
];

function scrollToOrder() {
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

function MessageBubble({ msg }: { msg: WAMessage }) {
  const mine = msg.from === 'me';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1.5`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm relative shadow-sm ${
          mine ? 'bg-[#dcf8c6] text-foreground rounded-br-sm' : 'bg-white text-foreground rounded-bl-sm'
        }`}
      >
        <div className="whitespace-pre-wrap leading-snug">{msg.text}</div>
        <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-muted-foreground">
          <span>{msg.time}</span>
          {mine && <span className="text-[#34b7f1] text-xs leading-none">{msg.status || '✓✓'}</span>}
        </div>
      </div>
    </div>
  );
}

function WhatsAppCard({ conv }: { conv: WAConversation }) {
  return (
    <div className="group h-full rounded-2xl overflow-hidden border border-[#075e54]/15 shadow-[0_10px_30px_-12px_rgba(7,94,84,0.25)] bg-[#ece5dd] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(7,94,84,0.35)]">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xl shrink-0">{conv.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight truncate">{conv.name}</div>
          <div className="text-[11px] opacity-80 truncate">en ligne · {conv.city}</div>
        </div>
        <div className="flex gap-3 text-white/80 text-base shrink-0">
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>
      {/* Messages */}
      <div
        className="p-3 min-h-[220px]"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {conv.messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
      </div>
      {/* Footer fake */}
      <div className="bg-white px-3 py-2 flex items-center gap-2 text-muted-foreground border-t border-black/5">
        <span>😊</span>
        <div className="flex-1 bg-[#f0f0f0] rounded-full h-7" />
        <span>🎤</span>
      </div>
    </div>
  );
}

function FacebookComment({ c }: { c: FBComment }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.15)] p-4 md:p-5 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] transition-all">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-[#e7f0fe] flex items-center justify-center text-2xl shrink-0 ring-2 ring-white shadow-sm">
          {c.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-[14px] text-[#050505] flex items-center gap-1.5 truncate">
                {c.name}
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1877f2] text-white text-[9px] font-black shrink-0">f</span>
              </div>
              <div className="text-[11px] text-[#65676b]">{c.city} · {c.time}</div>
            </div>
            <div className="text-[#1877f2] text-lg shrink-0" aria-hidden>👍</div>
          </div>
          <p className="text-[14px] text-[#050505] mt-2 leading-relaxed">{c.text}</p>

          <div className="mt-3 flex items-center gap-4 text-[12px] font-bold text-[#65676b] border-t border-slate-100 pt-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-gradient-to-br from-[#1877f2] to-[#0d5cd1] text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-[11px] shadow-sm">👍</span>
              <span className="text-[#65676b]">{c.likes} réactions</span>
            </span>
            {c.replies && <span>💬 {c.replies.length} réponses</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- WhatsApp Slider ---------- */

function WhatsAppSlider() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const kids = Array.from(el.children) as HTMLElement[];
      const cx = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      kids.forEach((c, i) => {
        const mid = c.offsetLeft - el.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cx - mid);
        if (d < dist) { dist = d; best = i; }
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {CONVERSATIONS.map((c, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[calc((100%-3rem)/3)]"
          >
            <WhatsAppCard conv={c} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3 md:hidden">
        {CONVERSATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Aller au témoignage ${i + 1}`}
            className={`h-2 rounded-full transition-all ${active === i ? 'w-6 bg-bleu' : 'w-2 bg-bleu/25'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

export function SocialProofChat() {
  return (
    <>
      {/* SECTION 9 — Témoignages WhatsApp */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-bleu-bg/60 via-white to-bleu-bg/40">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <span className="anim-up inline-flex items-center gap-2 bg-[#075e54]/10 text-[#075e54] text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-[#075e54]/15">
              💬 ILS NOUS ONT FAIT CONFIANCE
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[38px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Découvrez ce que racontent nos clients après leur cure
            </h2>
            <p className="anim-up text-[13.5px] md:text-[15px] text-slate-600 leading-relaxed mt-4" style={{ animationDelay: '160ms' }}>
              Chaque personne est différente. Les témoignages reflètent des expériences individuelles et ne garantissent pas des résultats identiques pour tous.
            </p>
          </div>

          <div className="anim-up" style={{ animationDelay: '220ms' }}>
            <WhatsAppSlider />
          </div>

          <div className="text-center mt-8 md:mt-10 anim-up" style={{ animationDelay: '320ms' }}>
            <button
              onClick={scrollToOrder}
              className="bg-rouge text-white px-6 md:px-8 py-4 rounded-2xl text-[15px] md:text-[16px] font-extrabold shadow-[0_10px_25px_-8px_rgba(198,40,40,0.5)] hover:-translate-y-0.5 transition-transform"
            >
              Je souhaite commencer ma cure
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10 — Avis Facebook */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <span className="anim-up inline-flex items-center gap-2 bg-[#1877f2]/10 text-[#1877f2] text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full ring-1 ring-[#1877f2]/15">
              📘 AVIS FACEBOOK
            </span>
            <h2 className="anim-up mt-5 text-bleu font-extrabold tracking-tight text-[26px] sm:text-[32px] md:text-[36px] leading-[1.2]" style={{ animationDelay: '80ms' }}>
              Ils partagent aussi leur expérience sur Facebook
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {COMMENTS.map((c, i) => (
              <div key={i} className="anim-up" style={{ animationDelay: `${100 + i * 80}ms` }}>
                <FacebookComment c={c} />
              </div>
            ))}
          </div>

          <div className="anim-up mt-8 md:mt-10 max-w-xl mx-auto" style={{ animationDelay: '600ms' }}>
            <div className="bg-gradient-to-br from-[#1877f2]/5 to-white border border-[#1877f2]/20 rounded-2xl px-5 py-4 flex items-center gap-3 justify-center shadow-sm">
              <span className="text-2xl">⭐</span>
              <p className="text-[13.5px] md:text-[15px] text-slate-700 leading-snug font-semibold text-center">
                Plusieurs centaines de personnes nous suivent déjà sur Facebook.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
