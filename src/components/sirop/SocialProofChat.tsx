import { SocialProofChat as GenericSocialProofChat, type WAConversation, type FBComment } from '@/components/SocialProofChat';

const CONVERSATIONS: WAConversation[] = [
  {
    name: 'Ibrahim S.',
    city: 'Niamey',
    avatar: '👨🏾',
    messages: [
      { from: 'client', text: 'Le Vieux, j\'ai reçu le sirop hier soir 🙏 emballage vraiment discret merci', time: '07:42' },
      { from: 'me', text: 'Bienvenue mon frère 🌿 commence ce matin à jeun, 1 cuillère, comme indiqué.', time: '07:45', status: '✓✓' },
      { from: 'client', text: 'Ok c\'est fait. Question délicate… c\'est normal que je sente déjà comme une chaleur en bas ? 😅', time: '08:30' },
      { from: 'me', text: 'Oui c\'est les plantes qui activent la circulation 👌 c\'est bon signe.', time: '08:33', status: '✓✓' },
      { from: 'client', text: 'Hier soir avec ma femme… 25 min sans problème wallahi 😮🙏 ça fait 2 ans que j\'attendais ça', time: '23:14' },
      { from: 'me', text: 'Allahou akbar 🤲 termine bien les 2 flacons, le 3e c\'est ton stock de sécurité.', time: '23:16', status: '✓✓' },
    ],
  },
  {
    name: 'Moussa D.',
    city: 'Ouagadougou',
    avatar: '🧔🏾',
    messages: [
      { from: 'client', text: 'Vieux KOUKA, ça fait 6 jours que je prends le sirop', time: '21:08' },
      { from: 'client', text: 'L\'érection est dure comme à 25 ans 😳 ma femme n\'en revient pas', time: '21:09' },
      { from: 'me', text: 'Mashallah 👏 continue jusqu\'à finir le 2e flacon, après tu seras solide pour longtemps.', time: '21:15', status: '✓✓' },
      { from: 'client', text: 'Je vais commander 2 autres pour mon grand frère, il a le même problème', time: '21:16' },
      { from: 'me', text: 'Pas de souci, je t\'envoie le lien discret 🤝', time: '21:18', status: '✓✓' },
    ],
  },
  {
    name: 'Karim B.',
    city: 'Bobo-Dioulasso',
    avatar: '👨🏿',
    messages: [
      { from: 'client', text: 'Bonjour, j\'avoue que j\'avais honte de commander', time: '12:34' },
      { from: 'client', text: 'Mais après 4 jours, l\'éjaculation précoce a disparu 🙌 je tiens 20 min facile', time: '12:35' },
      { from: 'me', text: 'C\'est exactement le but mon frère 🌿 personne n\'a à savoir. Continue tranquille.', time: '12:40', status: '✓✓' },
      { from: 'client', text: 'Merci infiniment. Le colis neutre c\'est génial, même ma femme n\'a rien vu 😅', time: '12:41' },
    ],
  },
];

const COMMENTS: FBComment[] = [
  {
    name: 'Aboubacar Traoré',
    city: 'Niamey',
    avatar: '🧔🏾',
    text: 'Wallahi je confirme. Ça faisait 3 ans que je galérais avec ma femme, elle commençait à se plaindre. 2 flacons du sirop et aujourd\'hui c\'est elle qui me supplie d\'arrêter 😅🙏 Que Dieu bénisse le Vieux.',
    likes: 412,
    time: 'Il y a 3 j',
    replies: [
      { name: 'Vieux KOUKA 🌿', text: 'Mashallah mon frère 🤲 continue bien la cure jusqu\'au bout.', likes: 56 },
      { name: 'Souley M.', text: 'Frère stp envoie-moi le contact en privé 🙏', likes: 28 },
    ],
  },
  {
    name: 'Issouf Kaboré',
    city: 'Ouaga',
    avatar: '👨🏾',
    text: 'Au début j\'ai cru que c\'était du bluff. Après 5 jours seulement, l\'éjaculation précoce a disparu. Je tiens maintenant plus de 30 min. Wallahi c\'est la vérité 💯',
    likes: 287,
    time: 'Il y a 6 j',
    replies: [
      { name: 'Drissa O.', text: 'C\'est combien le pack ?', likes: 9 },
      { name: 'Issouf Kaboré', text: '@Drissa 25 000 les 3 flacons, livré cash chez toi. Vas-y les yeux fermés 🤝', likes: 34 },
    ],
  },
  {
    name: 'Salif Compaoré',
    city: 'Koudougou',
    avatar: '🧓🏾',
    text: '58 ans, marié à une 2e femme de 32 ans 😅 je commençais à avoir peur. Le sirop m\'a remis comme un jeune homme. Ma femme est rassurée et moi aussi 🙏❤️',
    likes: 521,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Hamado T.', text: '😂😂 grand frère tu nous donnes de l\'espoir', likes: 41 },
    ],
  },
  {
    name: 'Yacouba Diallo',
    city: 'Bobo',
    avatar: '👨🏿',
    text: 'Le plus important pour moi c\'était la discrétion. Colis neutre, le livreur ne savait rien, personne à la maison n\'a posé de questions. Et le produit fait son travail 🔥 Bravo Vieux KOUKA.',
    likes: 198,
    time: 'Il y a 4 j',
  },
  {
    name: 'Mahamadou Sawadogo',
    city: 'Tenkodogo',
    avatar: '🧔🏾',
    text: 'Reçu hier en 24h chrono. J\'ai commencé ce matin. Je reviens vous dire dans 2 semaines incha\'Allah mais déjà bravo pour le service 👌',
    likes: 76,
    time: 'Il y a 2 j',
  },
  {
    name: 'Ousmane Barry',
    city: 'Niamey',
    avatar: '👨🏾',
    text: 'Mes amis se moquaient de moi quand j\'ai commandé. Aujourd\'hui c\'est eux qui me demandent le contact en cachette 😂🤣 La vérité finit toujours par sortir.',
    likes: 356,
    time: 'Il y a 1 sem',
    replies: [
      { name: 'Vieux KOUKA 🌿', text: '😄 c\'est toujours comme ça mon fils, merci pour ta confiance.', likes: 47 },
    ],
  },
];

export function SocialProofChat() {
  return (
    <GenericSocialProofChat
      conversations={CONVERSATIONS}
      comments={COMMENTS}
      headline="Ce que les hommes m'écrivent en privé."
      fbHeadline="Ce qu'ils osent dire en public."
    />
  );
}
