import { loadFont } from "@remotion/fonts";
import { FONT_FILES, resolveAsset } from "./config/assets";

// Chargement des polices locales (le rendu attend leur disponibilité).
let loaded = false;
export const loadBrandFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const f of FONT_FILES) {
    loadFont({ family: f.family, url: resolveAsset(f.file), weight: f.weight, style: f.style, display: "block" });
  }
};
