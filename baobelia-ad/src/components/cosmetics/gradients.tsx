import React from "react";
import { COLORS } from "../../config/theme";

/** Dégradé métallique doré (bouchons, bagues, pompes). */
export const GoldGradient: React.FC<{ id: string; vertical?: boolean }> = ({ id, vertical }) => (
  <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
    <stop offset="0" stopColor={COLORS.goldDeep} />
    <stop offset="0.18" stopColor={COLORS.goldLight} />
    <stop offset="0.38" stopColor={COLORS.gold} />
    <stop offset="0.55" stopColor="#F3E6C8" />
    <stop offset="0.72" stopColor={COLORS.gold} />
    <stop offset="1" stopColor="#7A6240" />
  </linearGradient>
);

/** Ombrage cylindrique : assombrit les bords pour donner du volume. */
export const CylinderShade: React.FC<{ id: string; strength?: number }> = ({ id, strength = 0.22 }) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stopColor="#000" stopOpacity={strength} />
    <stop offset="0.22" stopColor="#000" stopOpacity={0} />
    <stop offset="0.7" stopColor="#000" stopOpacity={0} />
    <stop offset="1" stopColor="#000" stopOpacity={strength * 1.3} />
  </linearGradient>
);

/** Reflet vertical doux (fenêtre de studio). */
export const HighlightGradient: React.FC<{ id: string; opacity?: number }> = ({ id, opacity = 0.6 }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="#fff" stopOpacity={opacity} />
    <stop offset="0.6" stopColor="#fff" stopOpacity={opacity * 0.45} />
    <stop offset="1" stopColor="#fff" stopOpacity={0} />
  </linearGradient>
);

/** Bande lumineuse animée (balayage de lumière). */
export const SweepGradient: React.FC<{ id: string; opacity?: number }> = ({ id, opacity = 0.45 }) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stopColor="#fff" stopOpacity={0} />
    <stop offset="0.5" stopColor="#fff" stopOpacity={opacity} />
    <stop offset="1" stopColor="#fff" stopOpacity={0} />
  </linearGradient>
);

/** Bande de lumière diagonale qui traverse l'objet selon `progress` (0 → 1). */
export const SweepBand: React.FC<{
  gradientId: string;
  clipId: string;
  progress: number;
  width: number;
  height: number;
}> = ({ gradientId, clipId, progress, width, height }) => {
  if (progress <= 0 || progress >= 1) return null;
  const x = -width * 0.6 + progress * width * 1.8;
  return (
    <g clipPath={`url(#${clipId})`}>
      <rect
        x={x}
        y={-height * 0.2}
        width={width * 0.32}
        height={height * 1.4}
        fill={`url(#${gradientId})`}
        transform={`rotate(-18 ${x} ${height / 2})`}
      />
    </g>
  );
};
