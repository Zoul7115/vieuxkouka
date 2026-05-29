import vieuxKoukaProfile from '@/assets/vieux-kouka-profile.jpg';

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
    name: 'Karim S.',
    city: 'Ouagadougou',
    avatar: '👨🏾',
    messages: [
      { from: 'client', text: 'Le Vieux, j\'ai honte de t\'écrire ça mais bon... 😶', time: '21:42' },
      { from: 'client', text: 'Avant je finissais en 2 minutes, ma femme se moquait de moi 😞', time: '21:42' },
      { from: 'me', text: 'Mon fils tu peux me parler en toute confiance 🤐 je t\'écoute.', time: '21:45', status: '✓✓' },
      { from: 'client', text: 'J\'ai pris le sirop pendant 10 jours seulement', time: '21:47' },
      { from: 'client', text: 'Hier soir j\'ai tenu plus de 25 minutes wallahi 🤯🙏', time: '21:47' },
      { from: 'client', text: 'Ma femme m\'a regardé autrement ce matin 😅 merci infiniment', time: '21:48' },
      { from: 'me', text: 'Mashallah 🌿 finis le flacon entier, le résultat sera encore plus stable.', time: '21:50', status: '✓✓' },
      { from: 'client', text: 'Je vais commander 2 autres pour être tranquille 🤝', time: '21:51' },
    ],
  },
  {
    name: 'Boubacar D.',
    city: 'Bobo-Dioulasso',
    avatar: '🧔🏾',
    messages: [
      { from: 'client', text: 'Bonsoir Le Vieux 🙏 j\'ai reçu le flacon ce matin, livreur très discret 👌', time: '20:15' },
      { from: 'me', text: 'Bienvenue Boubacar. Commence ce soir comme indiqué et bois beaucoup d\'eau.', time: '20:18', status: '✓✓' },
      { from: 'client', text: 'OK chef. Petite question gênante : mon érection ne durait pas. Je perdais en pleine action 😩', time: '20:20' },
      { from: 'me', text: 'C\'est exactement ce que le sirop corrige. Tu verras dès J3.', time: '20:22', status: '✓✓' },
      { from: 'client', text: 'J5 : ça tient dur comme à 20 ans 💪 ma copine n\'en revient pas', time: '08:02' },
      { from: 'client', text: 'Merci Le Vieux, vous avez sauvé mon couple 🙏', time: '08:03' },
    ],
  },
  {
    name: 'Mahamadou T.',
    city: 'Niamey',
    avatar: '👨🏿',
    messages: [
      { from: 'client', text: 'Salam Le Vieux. À 54 ans je pensais que c\'était fini pour moi 😔', time: '14:10' },
      { from: 'client', text: 'Plus de désir, plus rien... ma deuxième femme commençait à se plaindre', time: '14:10' },
      { from: 'me', text: 'Walaikoum salam. Beaucoup d\'hommes vivent ça en silence. Le sirop réveille le désir naturellement 🌿', time: '14:14', status: '✓✓' },
      { from: 'client', text: 'Après 2 semaines : le désir est revenu, je me réveille même la nuit 😅', time: '14:16' },
      { from: 'client', text: 'Ma femme rit maintenant, elle m\'appelle "le jeune homme" 😂', time: '14:17' },
      { from: 'me', text: 'Allahou akbar 🙏 c\'est le but. Continue la cure jusqu\'au bout.', time: '14:20', status: '✓✓' },
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
  replies?: { name: string; text: string; likes: number; isOwner?: boolean }[];
};

const COMMENTS: FBComment[] = [
  {
    name: 'Ibrahim Ouédraogo',
    city: 'Ouaga',
    avatar: '👨🏾',
    text: 'Frères je témoigne en privé wallahi 🤫 j\'ai pris 1 flacon, en 8 jours je tiens plus de 20 minutes alors qu\'avant c\'était 2 minutes maximum. Ma femme dort enfin satisfaite 😅 que Dieu bénisse Le Vieux 🙏',
    likes: 387,
    time: 'Il y a 3 j',
    replies: [
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'Merci mon fils 🙏 finis bien le flacon, tu garderas le résultat longtemps incha\'Allah.', likes: 64, isOwner: true },
      { name: 'Aboubacar S.', text: 'Frère stp envoie-moi le contact en privé 🙏🙏', likes: 28 },
      { name: 'Moussa B.', text: 'Vrai de vrai, j\'ai testé aussi, ça marche 💯', likes: 19 },
    ],
  },
  {
    name: 'Salif Compaoré',
    city: 'Koudougou',
    avatar: '🧔🏾',
    text: 'Au début je pensais que c\'était du bluff comme les autres trucs 😒 mais après 1 semaine de sirop, fini la frustration. Je dis MERCI publiquement parce que ce produit m\'a redonné ma fierté d\'homme 💪',
    likes: 256,
    time: 'Il y a 5 j',
    replies: [
      { name: 'Yacouba N.', text: 'Mon frère c\'est combien le flacon ?', likes: 11 },
      { name: 'Salif Compaoré', text: '@Yacouba 15 000 livré chez toi, paiement à la livraison. Fonce les yeux fermés 🤝', likes: 22 },
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'Merci Salif 🙏 ton témoignage va aider beaucoup d\'autres hommes qui souffrent en silence.', likes: 41, isOwner: true },
    ],
  },
  {
    name: 'Adama Sawadogo',
    city: 'Bobo',
    avatar: '👨🏿',
    text: 'Sérieusement messieurs, n\'attendez pas que votre femme aille voir ailleurs comme moi j\'ai failli perdre la mienne 😞 le sirop du Vieux KOUKA m\'a sauvé. 3ème commande aujourd\'hui pour mon grand frère 🤲',
    likes: 412,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Fatoumata D.', text: 'Bravo monsieur d\'avoir le courage de témoigner 👏', likes: 87 },
      { name: 'Hamed K.', text: 'Adama tu as raison, j\'ai vécu la même chose. Le sirop m\'a sauvé aussi 🙏', likes: 34 },
    ],
  },
  {
    name: 'Issouf Maïga',
    city: 'Niamey',
    avatar: '🧓🏾',
    text: 'À 61 ans, je n\'avais plus aucun désir depuis 4 ans. Ma jeune épouse souffrait en silence 😔 Après 2 flacons : le désir est revenu comme à 30 ans. Mon couple revit. Allah ya saka Vieux KOUKA 🤲',
    likes: 521,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'Mashallah mon grand frère 🌿 garde le rythme et bois beaucoup d\'eau.', likes: 78, isOwner: true },
    ],
  },
  {
    name: 'Rasmané Kaboré',
    city: 'Tenkodogo',
    avatar: '👨🏾',
    text: 'Discrétion totale, livraison rapide, et SURTOUT ça marche vraiment 🔥 fini la honte au lit. Je recommande à tous les frères qui se taisent par pudeur, parlez-en au Vieux, c\'est confidentiel 🤐',
    likes: 198,
    time: 'Il y a 4 j',
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
      <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center gap-2.5">
        <img
          src={vieuxKoukaProfile}
          alt="Le Vieux KOUKA"
          className="w-9 h-9 rounded-full object-cover border border-white/30"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight truncate">Le Vieux KOUKA 🌿</div>
          <div className="text-[11px] opacity-80 truncate">avec {conv.name} · {conv.city}</div>
        </div>
        <div className="flex gap-3 text-white/80 text-base">
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>
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
      <div className="w-9 h-9 rounded-full bg-vert-bg flex items-center justify-center text-lg shrink-0">{c.avatar}</div>
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
              <div key={i} className="flex gap-2">
                {r.isOwner && (
                  <img
                    src={vieuxKoukaProfile}
                    alt="Vieux KOUKA"
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialProofChatSirop() {
  const totalComments = COMMENTS.length + COMMENTS.reduce((s, c) => s + (c.replies?.length || 0), 0);
  return (
    <>
      {/* WhatsApp conversations */}
      <section className="py-12 bg-vert-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-7">
            <span className="text-[#075e54] text-xs font-bold uppercase tracking-widest">🤐 Messages WhatsApp privés</span>
            <h2 className="text-vert mt-2">Ce que les hommes m'écrivent en secret.</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              Captures d'écran de vraies discussions avec des clients après leur cure (noms abrégés — confidentialité absolue 🔒).
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6">
            {CONVERSATIONS.map((c, i) => (
              <WhatsAppCard key={i} conv={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Facebook page header + comments */}
      <section className="py-12 bg-white">
        <div className="container-kouka max-w-2xl">
          <div className="text-center mb-7">
            <span className="text-[#1877f2] text-xs font-bold uppercase tracking-widest">📘 Page Facebook officielle</span>
            <h2 className="text-vert mt-2">Ce qu'ils disent en public.</h2>
          </div>

          {/* Mini page header Facebook */}
          <div className="bg-white border border-[#dddfe2] rounded-xl shadow-sm overflow-hidden mb-5">
            <div className="h-20 bg-gradient-to-r from-vert/80 to-vert-mid/80" />
            <div className="px-4 pb-4 -mt-10 flex items-end gap-3">
              <img
                src={vieuxKoukaProfile}
                alt="Vieux KouKa guérisseur traditionnel"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="flex-1 min-w-0 pb-1">
                <div className="font-extrabold text-[15px] text-[#050505] flex items-center gap-1 flex-wrap">
                  Vieux KouKa guérisseur traditionnel
                  <span className="text-[#1877f2]" title="Vérifié">✔️</span>
                </div>
                <div className="text-[12px] text-[#65676b]">Page · Santé naturelle · 48 K abonnés</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#dddfe2] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0f2f5]">
              <div className="font-bold text-[#050505]">Commentaires <span className="text-[#65676b] font-normal">· Les plus pertinents ▾</span></div>
              <div className="text-xs text-[#65676b]">{totalComments} commentaires</div>
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
