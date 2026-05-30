import vieuxKoukaProfile from '@/assets/vieux-kouka-profile.jpg';

type WAMessage = { from: 'client' | 'me'; text: string; time: string; status?: '✓' | '✓✓' };
type WAConversation = { name: string; avatar: string; city: string; messages: WAMessage[] };

const CONVERSATIONS: WAConversation[] = [
  {
    name: 'Awa K.',
    city: 'Ouagadougou',
    avatar: '👩🏾',
    messages: [
      { from: 'client', text: 'Bonsoir Le Vieux 🙏 j\'ai pris le Tonic pendant 3 semaines', time: '19:22' },
      { from: 'client', text: 'Mes règles douloureuses ont diminué de 80%, et en plus ma tension est descendue 🤯', time: '19:22' },
      { from: 'me', text: 'Mashallah ma fille 🌿 c\'est l\'effet du Tonic : il agit sur plusieurs fronts à la fois.', time: '19:25', status: '✓✓' },
      { from: 'client', text: 'Même mon diabète : ma glycémie du matin est passée de 1,80 à 1,15 ✅', time: '19:27' },
      { from: 'client', text: 'Mon mari aussi en prend pour ses hémorroïdes, fini les saignements 🙌', time: '19:28' },
      { from: 'me', text: 'C\'est pour ça qu\'on l\'appelle l\'élixir des familles 🤝 commande 3 flacons pour la maison.', time: '19:30', status: '✓✓' },
    ],
  },
  {
    name: 'Issa M.',
    city: 'Bobo-Dioulasso',
    avatar: '🧔🏾',
    messages: [
      { from: 'client', text: 'Vieux KOUKA, ça fait 4 ans que je traîne des ulcères + tension + fatigue', time: '08:14' },
      { from: 'client', text: 'J\'achetais 3-4 médicaments différents chaque mois, ça me ruinait 😩', time: '08:14' },
      { from: 'me', text: 'Avec le Tonic, un seul flacon suffit pour tout ça. Commence par 2 flacons.', time: '08:18', status: '✓✓' },
      { from: 'client', text: 'J15 : plus de brûlures d\'estomac, je dors enfin la nuit 😴', time: '07:55' },
      { from: 'client', text: 'J30 : ma tension est stable à 13/8 et mes palus reviennent moins 💪', time: '07:55' },
      { from: 'client', text: 'Je vais commander le pack 3+2 pour ma femme et ma mère 🙏', time: '07:56' },
    ],
  },
  {
    name: 'Hadiza S.',
    city: 'Niamey',
    avatar: '🧕🏾',
    messages: [
      { from: 'client', text: 'Salam Le Vieux. Je souffrais de fibromes + anémie + fatigue chronique 😔', time: '15:40' },
      { from: 'me', text: 'Walaikoum salam. Le Tonic agit sur les 3 — purifie l\'utérus, refait le sang, redonne l\'énergie.', time: '15:44', status: '✓✓' },
      { from: 'client', text: 'Après 1 mois : mon échographie montre que les fibromes ont diminué 🤲', time: '15:46' },
      { from: 'client', text: 'Mon taux de fer est remonté, je ne suis plus essoufflée en marchant', time: '15:47' },
      { from: 'me', text: 'Allahou akbar 🙏 continue la cure 1 mois de plus pour ancrer le résultat.', time: '15:50', status: '✓✓' },
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
    name: 'Salimata Ouédraogo',
    city: 'Ouaga',
    avatar: '👩🏾',
    text: 'Wallahi je témoigne pour aider les autres 🙏 j\'avais hypertension + diabète + fibromes en même temps. Je payais 60 000 F de médicaments chaque mois. Avec 1 flacon du Tonic à 18 000 F, en 3 semaines tout est rentré dans l\'ordre. Mon médecin n\'en revient pas 😮',
    likes: 624,
    time: 'Il y a 2 j',
    replies: [
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'Mashallah ma fille 🙏 finis bien la cure complète, tu garderas la santé longtemps incha\'Allah.', likes: 89, isOwner: true },
      { name: 'Mariam D.', text: 'Sœur stp où l\'avoir ? Je suis dans le même cas 🙏', likes: 47 },
      { name: 'Aminata T.', text: 'Confirmé ! moi aussi en 2 semaines mes douleurs ont disparu 💯', likes: 31 },
    ],
  },
  {
    name: 'Boukary Sawadogo',
    city: 'Koudougou',
    avatar: '🧔🏾',
    text: 'À 58 ans j\'avais : hémorroïdes qui saignaient + ulcères + paludisme à répétition + fatigue. Le médecin m\'a donné 5 ordonnances 😩 J\'ai essayé le Tonic du Vieux KOUKA — UN SEUL FLACON pour tout. 1 mois après : tout est calmé. Merci Le Vieux 🤲',
    likes: 412,
    time: 'Il y a 4 j',
    replies: [
      { name: 'Issouf K.', text: 'Vrai ! mon père a vécu pareil, le Tonic l\'a sauvé', likes: 28 },
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'Merci Boukary 🌿 ton témoignage va aider beaucoup de familles.', likes: 56, isOwner: true },
    ],
  },
  {
    name: 'Fati Compaoré',
    city: 'Bobo',
    avatar: '🧕🏾',
    text: 'Règles très douloureuses depuis 10 ans, je ratais 2 jours de travail chaque mois 😞 Après 2 flacons du Tonic : mes règles passent sans douleur, je suis enfin libre. Et mon teint a éclairci en plus 😍 je recommande à toutes les femmes',
    likes: 387,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Roukia B.', text: 'Bénédiction ! ça soulage vraiment les règles ?', likes: 18 },
      { name: 'Fati Compaoré', text: '@Roukia oui ma sœur, en 1 mois plus rien. Fonce les yeux fermés 🤝', likes: 24 },
    ],
  },
  {
    name: 'Madi Traoré',
    city: 'Tenkodogo',
    avatar: '👨🏿',
    text: 'Diabétique depuis 12 ans, sous insuline tous les jours 💉 J\'ai pris le Tonic en complément (sans arrêter mon traitement). Ma glycémie est passée de 2,20 à 1,30 en 6 semaines. Mon médecin a réduit mes doses d\'insuline. Le Vieux KOUKA a changé ma vie 🙏',
    likes: 528,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'Mashallah Madi 🌿 jamais arrêter ton traitement médical sans avis du docteur — le Tonic est un complément naturel.', likes: 94, isOwner: true },
    ],
  },
  {
    name: 'Rasmata Kaboré',
    city: 'Ouaga',
    avatar: '👩🏾',
    text: 'Anémie chronique, je tombais malade tout le temps. Après 3 semaines de Tonic : mon taux de fer est remonté à 12,5 g/dL ! Je suis pleine d\'énergie, je ne suis plus fatiguée en montant les escaliers. Vraiment merci 🙏🌿',
    likes: 256,
    time: 'Il y a 3 j',
  },
  {
    name: 'Drissa Ilboudo',
    city: 'Pô',
    avatar: '🧓🏾',
    text: 'Toute la famille en prend maintenant : moi (hypertension), ma femme (fibromes), mon fils ainé (ulcères), ma fille (règles douloureuses). 1 produit pour tout le monde, ça nous coûte moins cher que les médicaments d\'un seul. Merci Vieux KOUKA 🤲',
    likes: 341,
    time: 'Il y a 6 j',
    replies: [
      { name: 'Vieux KouKa guérisseur traditionnel 🌿', text: 'C\'est exactement l\'esprit du Tonic 🌿 — l\'armoire à pharmacie naturelle des familles burkinabé.', likes: 67, isOwner: true },
    ],
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
    <div className="rounded-2xl overflow-hidden border-2 border-[#075e54]/20 shadow-md bg-[#ece5dd]">
      <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center gap-2.5">
        <img src={vieuxKoukaProfile} alt="Le Vieux KOUKA" className="w-9 h-9 rounded-full object-cover border border-white/30" loading="lazy" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight truncate">Le Vieux KOUKA 🌿</div>
          <div className="text-[11px] opacity-80 truncate">avec {conv.name} · {conv.city}</div>
        </div>
        <div className="flex gap-3 text-white/80 text-base"><span>📞</span><span>⋮</span></div>
      </div>
      <div className="p-3 min-h-[180px]" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
        {conv.messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
      </div>
      <div className="bg-white px-3 py-2 flex items-center gap-2 text-muted-foreground border-t border-black/5">
        <span>😊</span><div className="flex-1 bg-[#f0f0f0] rounded-full h-7" /><span>🎤</span>
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
            {c.name}<span className="text-[10px] font-normal text-[#65676b]">· {c.city}</span>
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
                  <img src={vieuxKoukaProfile} alt="Vieux KOUKA" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" loading="lazy" />
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

export function SocialProofChatTonic() {
  const totalComments = COMMENTS.length + COMMENTS.reduce((s, c) => s + (c.replies?.length || 0), 0);
  return (
    <>
      {/* WhatsApp conversations */}
      <section className="py-14 bg-[#0f2a1c] text-white">
        <div className="container-kouka max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-[#dcf8c6] text-xs font-bold uppercase tracking-[0.2em]">💬 Messages WhatsApp privés</span>
            <h2 className="text-[oklch(0.92_0.08_85)] mt-3 font-serif">Ce que les familles m'écrivent.</h2>
            <p className="text-white/70 text-sm mt-2 max-w-xl mx-auto">
              Captures de vraies discussions après leur cure (noms abrégés — confidentialité 🔒).
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {CONVERSATIONS.map((c, i) => <WhatsAppCard key={i} conv={c} />)}
          </div>
        </div>
      </section>

      {/* Facebook page header + comments */}
      <section className="py-14 bg-[#f5f0e0]/40">
        <div className="container-kouka max-w-2xl">
          <div className="text-center mb-7">
            <span className="text-[#1877f2] text-xs font-bold uppercase tracking-[0.2em]">📘 Page Facebook officielle</span>
            <h2 className="text-[#0f2a1c] mt-3 font-serif">Ce qu'ils disent en public.</h2>
          </div>
          <div className="bg-white border border-[#dddfe2] rounded-xl shadow-sm overflow-hidden mb-5">
            <div className="h-20 bg-gradient-to-r from-[#0f2a1c] to-[#1a3c2a]" />
            <div className="px-4 pb-4 -mt-10 flex items-end gap-3">
              <img src={vieuxKoukaProfile} alt="Vieux KouKa" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
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
              {COMMENTS.map((c, i) => <FacebookComment key={i} c={c} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
