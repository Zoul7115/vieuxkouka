import React from "react";
import { COLORS, FONTS } from "../../config/theme";
import { BRAND_NAME } from "../../config/texts";
import { CylinderShade, GoldGradient, SweepBand, SweepGradient } from "./gradients";
import { useSvgId } from "./useSvgId";

export const JAR_VIEWBOX = { w: 300, h: 250 };

/**
 * Pot de crème en verre brun laqué, couvercle doré.
 * `open` affiche le pot ouvert avec une texture de crème.
 */
export const CreamJar: React.FC<{ height: number; open?: boolean; sweep?: number }> = ({ height, open, sweep = 0 }) => {
  const id = useSvgId("jar");
  const { w, h } = JAR_VIEWBOX;
  const body = "M30 112 L30 214 Q30 244 62 244 L238 244 Q270 244 270 214 L270 112 Z";
  return (
    <svg width={(height * w) / h} height={height} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <GoldGradient id={`${id}-gold`} />
        <CylinderShade id={`${id}-shade`} strength={0.3} />
        <SweepGradient id={`${id}-sw`} opacity={0.4} />
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#21170F" />
          <stop offset="0.24" stopColor={COLORS.brownSoft} />
          <stop offset="0.4" stopColor="#8A6A55" />
          <stop offset="0.6" stopColor={COLORS.brown} />
          <stop offset="1" stopColor="#1C130E" />
        </linearGradient>
        <radialGradient id={`${id}-cream`} cx="0.42" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor={COLORS.cream} />
          <stop offset="1" stopColor="#E7DBC6" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
          {!open && <rect x="24" y="30" width="252" height="90" rx="10" />}
        </clipPath>
      </defs>

      <path d={body} fill={`url(#${id}-glass)`} />
      <text x="150" y="190" textAnchor="middle" fontFamily={FONTS.brand} fontWeight={600} fontSize={26} letterSpacing={3.2} fill={COLORS.goldLight}>
        {BRAND_NAME}
      </text>
      <line x1="112" x2="188" y1="206" y2="206" stroke={COLORS.gold} strokeWidth={1.2} />
      <path d={body} fill={`url(#${id}-shade)`} />
      <rect x="48" y="120" width="12" height="112" rx="6" fill="#fff" opacity={0.2} />
      <rect x="250" y="124" width="4" height="96" rx="2" fill="#fff" opacity={0.14} />

      {open ? (
        <g>
          <ellipse cx="150" cy="112" rx="120" ry="22" fill="#2A1D15" />
          <ellipse cx="150" cy="114" rx="110" ry="17" fill={`url(#${id}-cream)`} />
          {/* Volute de crème */}
          <path d="M98 114 C104 84 150 70 176 86 C196 98 186 116 160 114 C146 113 140 104 150 98" fill="none" stroke="#E2D4BE" strokeWidth={9} strokeLinecap="round" />
          <path d="M98 112 C104 82 150 68 176 84 C196 96 186 114 160 112 C146 111 140 102 150 96" fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" />
          <ellipse cx="150" cy="112" rx="120" ry="22" fill="none" stroke={COLORS.brownSoft} strokeWidth={2} />
        </g>
      ) : (
        <g>
          <rect x="24" y="40" width="252" height="78" rx="10" fill={`url(#${id}-gold)`} />
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={i} x1={30 + i * 6.1} x2={30 + i * 6.1} y1="52" y2="114" stroke={COLORS.goldDeep} strokeOpacity={0.16} />
          ))}
          <ellipse cx="150" cy="40" rx="126" ry="15" fill={COLORS.goldLight} />
          <ellipse cx="150" cy="40" rx="104" ry="10" fill="#EBDDBD" opacity={0.7} />
          <rect x="40" y="56" width="10" height="54" rx="5" fill="#fff" opacity={0.35} />
        </g>
      )}

      <SweepBand gradientId={`${id}-sw`} clipId={`${id}-clip`} progress={sweep} width={w} height={h} />
    </svg>
  );
};
