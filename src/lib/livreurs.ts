export type Livreur = {
  idx: number;
  name: string;
  whatsapp: string;
  zone: string;
  emoji: string;
};

export const LIVREURS: Livreur[] = [
  { idx: 0, name: 'Boukary', whatsapp: '22670000001', zone: 'Ouagadougou Centre', emoji: '🛵' },
  { idx: 1, name: 'Issouf', whatsapp: '22670000002', zone: 'Ouagadougou Nord', emoji: '🛵' },
  { idx: 2, name: 'Salif', whatsapp: '22670000003', zone: 'Ouagadougou Sud', emoji: '🛵' },
  { idx: 3, name: 'Adama', whatsapp: '22670000004', zone: 'Bobo-Dioulasso', emoji: '🛵' },
];

export const getLivreur = (idx: number | null | undefined) =>
  idx == null ? null : LIVREURS.find((l) => l.idx === idx) || null;
