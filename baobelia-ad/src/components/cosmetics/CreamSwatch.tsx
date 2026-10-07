import React from "react";
import { COLORS } from "../../config/theme";
import { useSvgId } from "./useSvgId";

/**
 * Trace de crème étalée (texture onctueuse), révélée de gauche à droite
 * selon `reveal` (0 → 1).
 */
export const CreamSwatch: React.FC<{ width: number; reveal: number; style?: React.CSSProperties }> = ({ width, reveal, style }) => {
  const id = useSvgId("cream");
  const h = width * 0.36;
  const swatch =
    "M40 210 C60 120 170 92 300 104 C430 116 520 70 640 78 C760 86 860 140 940 120 C990 108 1010 150 980 186 C940 236 840 230 740 242 C620 256 520 300 380 292 C250 284 140 300 70 276 C38 264 30 238 40 210 Z";
  return (
    <svg width={width} height={h} viewBox="0 0 1000 360" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor={COLORS.cream} />
          <stop offset="1" stopColor="#E2D3BC" />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="0.35" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-10%" y="-20%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id={`${id}-reveal`}>
          <rect x="0" y="-60" width={1000 * reveal + 40} height="480" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-reveal)`}>
        <path d={swatch} fill={COLORS.brown} opacity={0.18} transform="translate(10 22)" filter={`url(#${id}-shadow)`} />
        {/* Épaisseur de la crème (tranche inférieure) */}
        <path d={swatch} fill="#DCCBB0" transform="translate(0 16)" />
        <path d={swatch} fill="#EADDC8" transform="translate(0 8)" />
        <path d={swatch} fill={`url(#${id}-fill)`} />
        <path d={swatch} fill={`url(#${id}-sheen)`} />
        {/* Sillons laissés par l'étalement */}
        <path d="M90 214 C220 170 380 190 520 160 C660 130 780 150 900 150" fill="none" stroke="#E4D6BF" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
        <path d="M90 208 C220 164 380 184 520 154 C660 124 780 144 900 144" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        <path d="M130 254 C260 240 400 250 540 226 C660 206 760 208 860 196" fill="none" stroke="#E4D6BF" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
        <path d="M130 249 C260 235 400 245 540 221 C660 201 760 203 860 191" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
        <path d="M200 120 C320 108 420 124 560 100" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.9} />
        {/* Petite volute en bout de trace */}
        <path d="M930 128 C970 110 1000 150 968 178" fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
      </g>
    </svg>
  );
};
