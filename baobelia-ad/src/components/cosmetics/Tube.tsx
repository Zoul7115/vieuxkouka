import React from "react";
import { COLORS, FONTS } from "../../config/theme";
import { BRAND_NAME } from "../../config/texts";
import { CylinderShade, GoldGradient, HighlightGradient, SweepBand, SweepGradient } from "./gradients";
import { useSvgId } from "./useSvgId";

export const TUBE_VIEWBOX = { w: 170, h: 560 };

/** Tube souple sable posé sur son bouchon doré — visuel générique remplaçable. */
export const Tube: React.FC<{ height: number; sweep?: number }> = ({ height, sweep = 0 }) => {
  const id = useSvgId("tube");
  const { w, h } = TUBE_VIEWBOX;
  const body = "M14 46 L156 46 C154 200 140 340 124 442 L46 442 C30 340 16 200 14 46 Z";
  return (
    <svg width={(height * w) / h} height={height} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <GoldGradient id={`${id}-gold`} />
        <CylinderShade id={`${id}-shade`} strength={0.22} />
        <HighlightGradient id={`${id}-hl`} opacity={0.7} />
        <SweepGradient id={`${id}-sw`} opacity={0.45} />
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COLORS.sandDeep} />
          <stop offset="0.25" stopColor={COLORS.sandLight} />
          <stop offset="0.45" stopColor="#F3EADC" />
          <stop offset="0.75" stopColor={COLORS.sand} />
          <stop offset="1" stopColor="#A88F6C" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
        </clipPath>
      </defs>

      {/* Soudure plate */}
      <rect x="12" y="12" width="146" height="38" rx="3" fill={COLORS.sandDeep} />
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={i} x1="14" x2="156" y1={20 + i * 7} y2={20 + i * 7} stroke="#fff" strokeOpacity={0.3} />
      ))}
      <path d={body} fill={`url(#${id}-body)`} />
      <line x1="48" x2="122" y1="168" y2="168" stroke={COLORS.gold} strokeWidth={1.3} />
      <text x="85" y="214" textAnchor="middle" fontFamily={FONTS.brand} fontWeight={600} fontSize={20} letterSpacing={2} fill={COLORS.brown}>
        {BRAND_NAME}
      </text>
      <line x1="48" x2="122" y1="238" y2="238" stroke={COLORS.gold} strokeWidth={1.3} />
      <path d={body} fill={`url(#${id}-shade)`} />
      <path d="M32 60 C34 200 44 320 56 430" stroke={`url(#${id}-hl)`} strokeWidth={12} fill="none" strokeLinecap="round" />

      {/* Épaule et bouchon */}
      <path d="M46 440 L124 440 Q122 462 108 468 L62 468 Q48 462 46 440 Z" fill={COLORS.sandDeep} />
      <rect x="52" y="464" width="66" height="92" rx="8" fill={`url(#${id}-gold)`} />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={57 + i * 6.2} x2={57 + i * 6.2} y1="470" y2="550" stroke={COLORS.goldDeep} strokeOpacity={0.2} />
      ))}
      <rect x="58" y="468" width="5" height="82" rx="2.5" fill="#fff" opacity={0.35} />

      <SweepBand gradientId={`${id}-sw`} clipId={`${id}-clip`} progress={sweep} width={w} height={h} />
    </svg>
  );
};
