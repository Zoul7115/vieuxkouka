import React from "react";
import { COLORS, FONTS } from "../../config/theme";
import { BRAND_NAME } from "../../config/texts";
import { CylinderShade, GoldGradient, HighlightGradient, SweepBand, SweepGradient } from "./gradients";
import { useSvgId } from "./useSvgId";

export const SERUM_VIEWBOX = { w: 200, h: 560 };

/** Flacon compte-gouttes en verre ambré — visuel générique remplaçable. */
export const SerumBottle: React.FC<{ height: number; sweep?: number }> = ({ height, sweep = 0 }) => {
  const id = useSvgId("serum");
  const { w, h } = SERUM_VIEWBOX;
  const body =
    "M74 214 C74 238 22 236 22 272 L22 518 Q22 546 50 546 L150 546 Q178 546 178 518 L178 272 C178 236 126 238 126 214 Z";
  return (
    <svg width={(height * w) / h} height={height} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <GoldGradient id={`${id}-gold`} />
        <CylinderShade id={`${id}-shade`} strength={0.28} />
        <HighlightGradient id={`${id}-hl`} opacity={0.55} />
        <SweepGradient id={`${id}-sw`} opacity={0.4} />
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3E2616" />
          <stop offset="0.25" stopColor="#8A5A34" />
          <stop offset="0.5" stopColor="#B07A45" />
          <stop offset="0.78" stopColor="#7A4C2B" />
          <stop offset="1" stopColor="#331F12" />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3A24E" stopOpacity={0.55} />
          <stop offset="1" stopColor="#7B4A22" stopOpacity={0.75} />
        </linearGradient>
        <linearGradient id={`${id}-bulb`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COLORS.brownDeep} />
          <stop offset="0.32" stopColor={COLORS.brownSoft} />
          <stop offset="0.62" stopColor={COLORS.brown} />
          <stop offset="1" stopColor="#1E1511" />
        </linearGradient>
        <linearGradient id={`${id}-label`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.cream} />
          <stop offset="1" stopColor={COLORS.ivory} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
          <rect x="60" y="112" width="80" height="92" rx="6" />
        </clipPath>
        <clipPath id={`${id}-body`}>
          <path d={body} />
        </clipPath>
      </defs>

      {/* Poire du compte-gouttes */}
      <path d="M74 122 L74 54 C74 16 126 16 126 54 L126 122 Z" fill={`url(#${id}-bulb)`} />
      <ellipse cx="88" cy="62" rx="5" ry="26" fill="#fff" opacity={0.22} />

      {/* Bague dorée */}
      <rect x="60" y="116" width="80" height="88" rx="6" fill={`url(#${id}-gold)`} />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1="62" x2="138" y1={128 + i * 8} y2={128 + i * 8} stroke={COLORS.goldDeep} strokeOpacity={0.28} strokeWidth={1} />
      ))}
      <rect x="57" y="110" width="86" height="11" rx="4" fill={`url(#${id}-gold)`} />
      <rect x="57" y="110" width="86" height="3" rx="1.5" fill="#fff" opacity={0.35} />

      {/* Corps en verre */}
      <rect x="74" y="200" width="52" height="24" fill="#4A2E1B" />
      <path d={body} fill={`url(#${id}-glass)`} />
      <g clipPath={`url(#${id}-body)`}>
        <rect x="0" y="302" width={w} height="260" fill={`url(#${id}-liquid)`} />
        <ellipse cx="100" cy="302" rx="80" ry="5" fill="#F0C27C" opacity={0.45} />
        {/* Pipette visible à travers le verre */}
        <rect x="93" y="214" width="14" height="292" rx="7" fill="#fff" opacity={0.1} stroke="#fff" strokeOpacity={0.22} />
        <ellipse cx="100" cy="540" rx="68" ry="7" fill="#F5CF92" opacity={0.35} />
      </g>

      {/* Étiquette */}
      <rect x="40" y="346" width="120" height="128" rx="3" fill={`url(#${id}-label)`} />
      <line x1="56" x2="144" y1="368" y2="368" stroke={COLORS.gold} strokeWidth={1.2} />
      <text x="100" y="414" textAnchor="middle" fontFamily={FONTS.brand} fontWeight={600} fontSize={21} letterSpacing={2.2} fill={COLORS.brown}>
        {BRAND_NAME}
      </text>
      <path d="M100 432 l4 4 -4 4 -4 -4 Z" fill={COLORS.gold} />
      <line x1="56" x2="144" y1="452" y2="452" stroke={COLORS.gold} strokeWidth={1.2} />
      <rect x="40" y="346" width="120" height="128" rx="3" fill={`url(#${id}-shade)`} />

      {/* Ombrage + reflets */}
      <path d={body} fill={`url(#${id}-shade)`} />
      <rect x="32" y="262" width="13" height="262" rx="6.5" fill={`url(#${id}-hl)`} />
      <rect x="163" y="276" width="4" height="236" rx="2" fill="#fff" opacity={0.22} />
      <path d="M78 228 C78 246 40 246 34 266" stroke="#fff" strokeOpacity={0.45} strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x="66" y="118" width="6" height="84" rx="3" fill="#fff" opacity={0.35} />

      <SweepBand gradientId={`${id}-sw`} clipId={`${id}-clip`} progress={sweep} width={w} height={h} />
    </svg>
  );
};
