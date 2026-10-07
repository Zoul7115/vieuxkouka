// Textes exacts de la publicité — modifiez-les ici uniquement.
// Chaque entrée est un tableau de lignes ; chaque ligne est une liste de segments.
// Un segment "brand" est composé dans la typographie du logo.
export type TextSegment = { text: string; brand?: boolean };
export type TextLines = TextSegment[][];

export const BRAND_NAME = "BAOBÉLIA";

export const TEXTS: Record<"hook" | "discovery" | "range" | "finale", TextLines> = {
  // Scène 1 : « Votre peau mérite un rituel d'exception. »
  hook: [[{ text: "Votre peau mérite" }], [{ text: "un rituel d’exception." }]],
  // Scène 2 : « Découvrez BAOBÉLIA. »
  discovery: [[{ text: "Découvrez" }], [{ text: "BAOBÉLIA.", brand: true }]],
  // Scène 3 : « Un rituel pensé pour votre peau. »
  range: [[{ text: "Un rituel pensé" }], [{ text: "pour votre peau." }]],
  // Scène 4 : « Découvrez notre univers. » (appel à l'action)
  finale: [[{ text: "Découvrez notre univers." }]],
};
