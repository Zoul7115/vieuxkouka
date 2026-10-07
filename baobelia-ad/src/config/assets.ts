import { staticFile } from "remotion";

/**
 * Ressources locales. Tout est servi depuis /public : aucun fichier distant
 * n'est nécessaire au rendu.
 */
export const FONT_FILES = [
  { family: "Cormorant Garamond", weight: "500", style: "normal", file: "fonts/cormorant-garamond-latin-500-normal.woff2" },
  { family: "Cormorant Garamond", weight: "600", style: "normal", file: "fonts/cormorant-garamond-latin-600-normal.woff2" },
  { family: "Cormorant Garamond", weight: "500", style: "italic", file: "fonts/cormorant-garamond-latin-500-italic.woff2" },
  { family: "Montserrat", weight: "400", style: "normal", file: "fonts/montserrat-latin-400-normal.woff2" },
  { family: "Montserrat", weight: "500", style: "normal", file: "fonts/montserrat-latin-500-normal.woff2" },
  { family: "Montserrat", weight: "600", style: "normal", file: "fonts/montserrat-latin-600-normal.woff2" },
] as const;

/**
 * Musique : aucune piste n'est fournie pour l'instant (export sans musique).
 * Déposez un fichier dans public/audio/ puis indiquez son nom ici,
 * par exemple : file: "audio/musique.mp3".
 */
export const MUSIC: { file: string | null; volume: number; fadeOutFrames: number } = {
  file: null,
  volume: 0.7,
  fadeOutFrames: 30,
};

/** Les quatre emplacements produits utilisés dans la vidéo. */
export type ProductSlot = "serum" | "pump" | "jar" | "tube";

/**
 * Produits : les flacons sont pour l'instant des illustrations vectorielles
 * GÉNÉRIQUES (packagings non validés). Pour utiliser une vraie photo détourée
 * (PNG transparent, cadrage serré, produit vertical), déposez-la dans
 * public/produits/ et renseignez son chemin, par ex. "produits/serum.png".
 */
export const PRODUCT_IMAGES: Record<ProductSlot, string | null> = {
  serum: null,
  pump: null,
  jar: null,
  tube: null,
};

export const resolveAsset = (file: string) => staticFile(file);
