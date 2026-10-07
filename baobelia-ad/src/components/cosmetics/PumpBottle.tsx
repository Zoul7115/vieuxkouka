import React from "react";
import { COLORS, FONTS } from "../../config/theme";
import { BRAND_NAME } from "../../config/texts";
import { CylinderShade, GoldGradient, HighlightGradient, SweepBand, SweepGradient } from "./gradients";
import { useSvgId } from "./useSvgId";

export const PUMP_VIEWBOX = { w: 200, h: 620 };

/** Flacon pompe givré ivoire — visuel générique remplaçable. */
export const PumpBottle: React.FC<{ height: number; sweep?: number }> = ({ height, sweep = 0 }) => {
  const id = useSvgId("pump");
  const { w, h } = PUMP_VIEWBOX;
  const body =
    "M62 168 C62 198 26 198 26 240 L26 580 Q26 610 56 610 L144 610 Q174 610 174 580 L174 240 C174 198 138 198 138 168 Z";
  return (
    <svg width={(height * w) / h} height={height} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <GoldGradient id={`${id}-gold`} />
        <CylinderShade id={`${id}-shade`} strength={0.2} />
        <HighlightGradient id={`${id}-hl`} opacity={0.85} />
        <SweepGradient id={`${id}-sw`} opacity={0.5} />
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COLORS.sandDeep} />
          <stop offset="0.2" stopColor="#EFE5D5" />
          <stop offset="0.42" stopColor={COLORS.cream} />
          <stop offset="0.72" stopColor="#EDE2D0" />
          <stop offset="1" stopColor="#B9A27F" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
          <rect x="62" y="20" width="76" height="160" />
        </clipPath>
      </defs>

      {/* Tête de pompe dorée */}
      <path d="M110 38 L180 38 Q188 38 188 46 L188 54 Q188 58 184 58 L110 60 Z" fill={`url(#${id}-gold)`} />
      <rect x="66" y="26" width="68" height="64" rx="10" fill={`url(#${id}-gold)`} />
      <rect x="66" y="26" width="68" height="5" rx="2.5" fill="#fff" opacity={0.4} />
      <rect x="92" y="88" width="16" height="36" fill={`url(#${id}-gold)`} />
      <rect x="60" y="120" width="80" height="54" rx="6" fill={`url(#${id}-gold)`} />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1="62" x2="138" y1={130 + i * 7} y2={130 + i * 7} stroke={COLORS.goldDeep} strokeOpacity={0.25} />
      ))}
      <rect x="70" y="122" width="6" height="50" rx="3" fill="#fff" opacity={0.35} />

      {/* Corps givré */}
      <path d={body} fill={`url(#${id}-body)`} />
      <line x1="58" x2="142" y1="330" y2="330" stroke={COLORS.gold} strokeWidth={1.4} />
      <text x="100" y="392" textAnchor="middle" fontFamily={FONTS.brand} fontWeight={600} fontSize={24} letterSpacing={2.6} fill={COLORS.brown}>
        {BRAND_NAME}
      </text>
      <circle cx="100" cy="416" r="2.6" fill={COLORS.gold} />
      <line x1="58" x2="142" y1="440" y2="440" stroke={COLORS.gold} strokeWidth={1.4} />
      <path d={body} fill={`url(#${id}-shade)`} />
      <rect x="40" y="232" width="15" height="348" rx="7.5" fill={`url(#${id}-hl)`} />
      <path d="M66 182 C66 204 38 206 34 232" stroke="#fff" strokeOpacity={0.7} strokeWidth={4} fill="none" strokeLinecap="round" />

      <SweepBand gradientId={`${id}-sw`} clipId={`${id}-clip`} progress={sweep} width={w} height={h} />
    </svg>
  );
};
