import { SocialProofChat as GenericSocialProofChat, type WAConversation, type FBComment } from '@/components/SocialProofChat';

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

const COMMENTS: FBComment[] = [
  {
    name: 'Aminata Sawadogo',
    city: 'Ouaga',
    avatar: '👩🏾‍🦱',
    text: 'Wallahi je confirme ! Ma tante prenait la metformine depuis 8 ans, sa glycémie restait élevée. 3 semaines de poudre du Vieux KOUKA et elle est descendue à 1.2 😱 Que Dieu vous bénisse 🙏',
    likes: 247,
    time: 'Il y a 2 j',
    replies: [
      { name: 'Vieux KOUKA 🌿', text: 'Merci ma fille 🙏 dis à ta tante de continuer la cure complète.', likes: 38 },
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

export function SocialProofChat() {
  return <GenericSocialProofChat conversations={CONVERSATIONS} comments={COMMENTS} />;
}
