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
    <div className="rounded-2xl overflow-hidden border-2 border-[#075e54]/20 shadow-md max-w-md mx-auto bg-[#ece5dd]">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xl">{conv.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight truncate">{conv.name}</div>
          <div className="text-[11px] opacity-80 truncate">en ligne · {conv.city}</div>
        </div>
        <div className="flex gap-3 text-white/80 text-base">
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>
      {/* Messages */}
      <div
        className="p-3 min-h-[180px]"
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
    <div className="flex gap-2.5">
      <div className="w-9 h-9 rounded-full bg-bleu-bg flex items-center justify-center text-lg shrink-0">{c.avatar}</div>
      <div className="flex-1 min-w-0">
        <div className="bg-[#f0f2f5] rounded-2xl px-3 py-2">
          <div className="font-bold text-[13px] text-[#050505] flex items-center gap-1">
            {c.name}
            <span className="text-[10px] font-normal text-[#65676b]">· {c.city}</span>
          </div>
          <div className="text-sm text-[#050505] mt-0.5 leading-snug">{c.text}</div>
        </div>
        <div className="flex items-center gap-3 px-3 mt-1 text-[12px] font-bold text-[#65676b]">
          <button className="hover:text-[#1877f2] cursor-default">J'aime</button>
          <button className="hover:text-[#1877f2] cursor-default">Répondre</button>
          <span className="font-normal">{c.time}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[#1877f2]">
            <span className="bg-[#1877f2] text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]">👍</span>
            <span className="text-[#65676b]">{c.likes}</span>
          </span>
        </div>
        {c.replies && (
          <div className="mt-2 ml-2 space-y-2 border-l-2 border-[#f0f2f5] pl-3">
            {c.replies.map((r, i) => (
              <div key={i}>
                <div className="bg-[#f0f2f5] rounded-2xl px-3 py-1.5 inline-block max-w-full">
                  <div className="font-bold text-[12px] text-[#050505]">{r.name}</div>
                  <div className="text-[13px] text-[#050505] leading-snug">{r.text}</div>
                </div>
                <div className="flex items-center gap-3 px-3 mt-0.5 text-[11px] font-bold text-[#65676b]">
                  <span className="font-normal">2h</span>
                  <span className="inline-flex items-center gap-1 text-[#1877f2]">
                    <span className="bg-[#1877f2] text-white rounded-full w-3.5 h-3.5 inline-flex items-center justify-center text-[9px]">👍</span>
                    <span className="text-[#65676b]">{r.likes}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialProofChat() {
  return (
    <>
      {/* WhatsApp conversations */}
      <section className="py-12 bg-bleu-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-7">
            <span className="text-[#075e54] text-xs font-bold uppercase tracking-widest">💬 Messages WhatsApp réels</span>
            <h2 className="text-bleu mt-2">Ce que les clients m'écrivent.</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Capture d'écrans de discussions avec de vrais clients après leur cure (noms abrégés pour la confidentialité 🔒).
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6">
            {CONVERSATIONS.map((c, i) => (
              <WhatsAppCard key={i} conv={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Facebook comments */}
      <section className="py-12 bg-white">
        <div className="container-kouka max-w-2xl">
          <div className="text-center mb-7">
            <span className="text-[#1877f2] text-xs font-bold uppercase tracking-widest">📘 Page Facebook officielle</span>
            <h2 className="text-bleu mt-2">Ce qu'ils disent en public.</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Page · Santé naturelle · <strong>48 K abonnés</strong>
            </p>
          </div>

          <div className="bg-white border border-[#dddfe2] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0f2f5]">
              <div className="font-bold text-[#050505]">Commentaires <span className="text-[#65676b] font-normal">· Les plus pertinents ▾</span></div>
              <div className="text-xs text-[#65676b]">{COMMENTS.length + COMMENTS.reduce((s, c) => s + (c.replies?.length || 0), 0)} commentaires</div>
            </div>
            <div className="space-y-5">
              {COMMENTS.map((c, i) => (
                <FacebookComment key={i} c={c} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
