import { useId } from "react";

/** Identifiant unique et sûr pour les dégradés / filtres SVG. */
export const useSvgId = (prefix: string) =>
  `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
