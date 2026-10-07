import React from "react";
import { Img } from "remotion";
import { PRODUCT_IMAGES, ProductSlot, resolveAsset } from "../../config/assets";
import { CreamJar } from "./CreamJar";
import { PumpBottle } from "./PumpBottle";
import { SerumBottle } from "./SerumBottle";
import { Tube } from "./Tube";

/** Hauteur relative de chaque produit (pour des proportions cohérentes entre scènes). */
export const PRODUCT_SCALE: Record<ProductSlot, number> = {
  serum: 1,
  pump: 1.12,
  jar: 0.46,
  tube: 0.9,
};

type ProductProps = {
  slot: ProductSlot;
  /** Centre horizontal (px). */
  x: number;
  /** Ligne de pose (px) : le bas du produit. */
  baseY: number;
  /** Hauteur d'un flacon sérum de référence (px). */
  size: number;
  sweep?: number;
  open?: boolean;
  opacity?: number;
  /** Décalage vertical (px) pendant les animations — l'ombre s'estompe quand le produit s'élève. */
  lift?: number;
  rotate?: number;
  scale?: number;
  shadow?: number;
};

/**
 * Emplacement produit remplaçable : affiche la photo définie dans
 * config/assets.ts (PRODUCT_IMAGES) ou, à défaut, l'illustration vectorielle générique.
 */
export const Product: React.FC<ProductProps> = ({
  slot,
  x,
  baseY,
  size,
  sweep = 0,
  open,
  opacity = 1,
  lift = 0,
  rotate = 0,
  scale = 1,
  shadow = 1,
}) => {
  const height = size * PRODUCT_SCALE[slot] * scale;
  const image = PRODUCT_IMAGES[slot];
  const liftFade = Math.max(0, 1 - Math.abs(lift) / (height * 0.6));

  let visual: React.ReactNode;
  if (image) {
    visual = <Img src={resolveAsset(image)} style={{ height, width: "auto", display: "block" }} />;
  } else if (slot === "serum") {
    visual = <SerumBottle height={height} sweep={sweep} />;
  } else if (slot === "pump") {
    visual = <PumpBottle height={height} sweep={sweep} />;
  } else if (slot === "jar") {
    visual = <CreamJar height={height} open={open} sweep={sweep} />;
  } else {
    visual = <Tube height={height} sweep={sweep} />;
  }

  const shadowWidth = height * (slot === "jar" ? 1.25 : 0.5);
  return (
    <div style={{ position: "absolute", left: x, top: baseY, opacity, width: 0, height: 0 }}>
      {/* Ombre de contact + ombre portée douce */}
      <div
        style={{
          position: "absolute",
          left: -shadowWidth * 0.8,
          top: -shadowWidth * 0.09,
          width: shadowWidth * 1.6,
          height: shadowWidth * 0.2,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(43,31,25,0.32), rgba(43,31,25,0))",
          opacity: shadow * liftFade,
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -shadowWidth * 0.55,
          top: -shadowWidth * 0.04,
          width: shadowWidth * 1.1,
          height: shadowWidth * 0.08,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(30,20,15,0.55), rgba(30,20,15,0))",
          opacity: shadow * liftFade * liftFade,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          transform: `translate(-50%, ${-lift}px) rotate(${rotate}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        {visual}
      </div>
    </div>
  );
};
