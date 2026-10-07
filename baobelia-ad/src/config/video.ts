// Réglages techniques de la vidéo et découpage du storyboard (en images).
export const VIDEO = {
  id: "BaobeliaAd",
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 450, // 15 s
} as const;

const s = (seconds: number) => Math.round(seconds * VIDEO.fps);

/** Storyboard : début et durée de chaque scène. */
export const SCENES = {
  hook: { from: s(0), duration: s(3) }, // 0 → 3 s
  discovery: { from: s(3), duration: s(4) }, // 3 → 7 s
  range: { from: s(7), duration: s(4) }, // 7 → 11 s
  finale: { from: s(11), duration: s(4) }, // 11 → 15 s
} as const;

/** Durée (en images) des fondus enchaînés, centrés sur chaque changement de scène. */
export const TRANSITION_FRAMES = 14;

/**
 * Zones de sécurité des interfaces mobiles (Reels / TikTok) en pixels.
 * Les textes et le logo restent à l'intérieur de ce cadre.
 */
export const SAFE_AREA = {
  top: 250,
  bottom: 420, // légende, boutons, nom du compte
  left: 90,
  right: 150, // colonne d'icônes (j'aime, partage…)
} as const;
