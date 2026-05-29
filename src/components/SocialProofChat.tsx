import vieuxKoukaProfile from '@/assets/vieux-kouka-profile.png';

export type WAMessage = {
  from: 'client' | 'me';
  text: string;
  time: string;
  status?: '✓' | '✓✓';
};

export type WAConversation = {
  name: string;
  avatar: string;
  city: string;
  messages: WAMessage[];
};

export type FBComment = {
  name: string;
  city: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  replies?: { name: string; text: string; likes: number }[];
};

const BRAND_NAME = 'Vieux KOUKA · Guérisseur Traditionnel';
const BRAND_FOLLOWERS = '175 followers';

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
        <img src={vieuxKoukaProfile} alt="Vieux KOUKA" className="w-9 h-9 rounded-full object-cover bg-white/15" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight truncate">Vieux KOUKA 🌿</div>
          <div className="text-[11px] opacity-80 truncate">en discussion avec {conv.name} · {conv.city}</div>
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
        <div className="text-center text-[10px] text-muted-foreground bg-white/60 rounded-full inline-block px-2 py-0.5 mx-auto mb-2">
          {conv.avatar} {conv.name}
        </div>
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
            {c.replies.map((r, i) => {
              const isMe = r.name.toLowerCase().includes('vieux kouka');
              return (
                <div key={i} className="flex gap-2">
                  {isMe && (
                    <img src={vieuxKoukaProfile} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  )}
                  <div className="min-w-0">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialProofChat({
  conversations,
  comments,
  headline = "Ce que les clients m'écrivent.",
  fbHeadline = 'Ce qu\'ils disent en public.',
}: {
  conversations: WAConversation[];
  comments: FBComment[];
  headline?: string;
  fbHeadline?: string;
}) {
  const totalComments = comments.length + comments.reduce((s, c) => s + (c.replies?.length || 0), 0);
  return (
    <>
      <section className="py-12 bg-bleu-bg">
        <div className="container-kouka max-w-3xl">
          <div className="text-center mb-7">
            {/* Profil page Facebook */}
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl border border-[#dddfe2] px-4 py-2.5 mb-4 shadow-sm">
              <img src={vieuxKoukaProfile} alt="Vieux KOUKA" className="w-12 h-12 rounded-full object-cover" />
              <div className="text-left">
                <div className="font-extrabold text-[#050505] text-sm leading-tight">{BRAND_NAME}</div>
                <div className="text-[11px] text-[#65676b]">{BRAND_FOLLOWERS} · Santé/Beauté ✓</div>
              </div>
            </div>
            <span className="text-[#075e54] text-xs font-bold uppercase tracking-widest">💬 Messages WhatsApp réels</span>
            <h2 className="text-bleu mt-2">{headline}</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Discussions avec de vrais clients (noms abrégés pour la confidentialité 🔒).
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6">
            {conversations.map((c, i) => (
              <WhatsAppCard key={i} conv={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-kouka max-w-2xl">
          <div className="text-center mb-7">
            <span className="text-[#1877f2] text-xs font-bold uppercase tracking-widest">📘 Commentaires Facebook</span>
            <h2 className="text-bleu mt-2">{fbHeadline}</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Extraits de commentaires sous les publications de la page <strong>Vieux KouKa guérisseur Traditionnel</strong>.
            </p>
          </div>

          <div className="bg-white border border-[#dddfe2] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0f2f5]">
              <div className="font-bold text-[#050505]">Commentaires <span className="text-[#65676b] font-normal">· Les plus pertinents ▾</span></div>
              <div className="text-xs text-[#65676b]">{totalComments} commentaires</div>
            </div>
            <div className="space-y-5">
              {comments.map((c, i) => (
                <FacebookComment key={i} c={c} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
