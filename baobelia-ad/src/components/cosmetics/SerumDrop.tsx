import React from "react";
import { useSvgId } from "./useSvgId";

/** Goutte de sérum dorée avec réfraction et reflet spéculaire. */
export const SerumDrop: React.FC<{ size: number; stretch?: number }> = ({ size, stretch = 1 }) => {
  const id = useSvgId("drop");
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 100 135" style={{ overflow: "visible", transform: `scaleY(${stretch}) scaleX(${1 / Math.sqrt(stretch)})`, transformOrigin: "50% 100%" }}>
      <defs>
        <radialGradient id={`${id}-fill`} cx="0.38" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#FFE3A8" />
          <stop offset="0.35" stopColor="#E3A851" />
          <stop offset="0.75" stopColor="#A9692C" />
          <stop offset="1" stopColor="#6B3E1A" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F3C77A" stopOpacity={0.55} />
          <stop offset="1" stopColor="#F3C77A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="88" rx="80" ry="80" fill={`url(#${id}-glow)`} />
      <path d="M50 2 C56 30 92 58 92 88 C92 114 73 132 50 132 C27 132 8 114 8 88 C8 58 44 30 50 2 Z" fill={`url(#${id}-fill)`} />
      <path d="M50 2 C56 30 92 58 92 88 C92 114 73 132 50 132" fill="none" stroke="#FFF1D2" strokeOpacity={0.35} strokeWidth={2} />
      <ellipse cx="34" cy="80" rx="8" ry="16" fill="#fff" opacity={0.75} transform="rotate(18 34 80)" />
      <circle cx="40" cy="104" r="3.5" fill="#fff" opacity={0.6} />
      <path d="M30 118 C42 126 62 126 72 116" fill="none" stroke="#FFE7B5" strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};
