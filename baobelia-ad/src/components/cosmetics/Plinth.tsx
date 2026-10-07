import React from "react";
import { useSvgId } from "./useSvgId";

/**
 * Socle minéral cylindrique (pierre beige type travertin),
 * avec texture de grain, veines et arête lumineuse.
 */
export const Plinth: React.FC<{
  width: number;
  height: number;
  /** Teinte : "sand" (défaut) ou "ivory". */
  tone?: "sand" | "ivory";
  style?: React.CSSProperties;
}> = ({ width, height, tone = "sand", style }) => {
  const id = useSvgId("plinth");
  const ry = width * 0.12;
  const top = tone === "sand" ? ["#EFE4D2", "#D9C6AA"] : ["#FFFDF8", "#EDE3D3"];
  const side = tone === "sand" ? ["#E4D4BB", "#CDB794", "#A88F6C"] : ["#F7F1E6", "#E4D8C4", "#C9B699"];
  const totalH = height + ry * 2;
  return (
    <svg width={width} height={totalH} viewBox={`0 0 ${width} ${totalH}`} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={side[2]} />
          <stop offset="0.28" stopColor={side[0]} />
          <stop offset="0.55" stopColor={side[1]} />
          <stop offset="1" stopColor={side[2]} />
        </linearGradient>
        <linearGradient id={`${id}-fall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.14} />
        </linearGradient>
        <radialGradient id={`${id}-top`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor={top[0]} />
          <stop offset="1" stopColor={top[1]} />
        </radialGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.2  0 0 0 -2.2 1.25" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={`M0 ${ry} L0 ${ry + height} A${width / 2} ${ry} 0 0 0 ${width} ${ry + height} L${width} ${ry} A${width / 2} ${ry} 0 0 1 0 ${ry} Z`} />
          <ellipse cx={width / 2} cy={ry} rx={width / 2} ry={ry} />
        </clipPath>
      </defs>
      <path
        d={`M0 ${ry} L0 ${ry + height} A${width / 2} ${ry} 0 0 0 ${width} ${ry + height} L${width} ${ry} Z`}
        fill={`url(#${id}-side)`}
      />
      <path
        d={`M0 ${ry} L0 ${ry + height} A${width / 2} ${ry} 0 0 0 ${width} ${ry + height} L${width} ${ry} Z`}
        fill={`url(#${id}-fall)`}
      />
      {/* Veines du travertin */}
      {[0.32, 0.55, 0.78].map((p, i) => (
        <path
          key={i}
          d={`M0 ${ry + height * p} A${width / 2} ${ry} 0 0 0 ${width} ${ry + height * p}`}
          fill="none"
          stroke="#8E7556"
          strokeOpacity={0.12 + i * 0.03}
          strokeWidth={1.4}
        />
      ))}
      <ellipse cx={width / 2} cy={ry} rx={width / 2} ry={ry} fill={`url(#${id}-top)`} />
      <rect x="0" y="0" width={width} height={totalH} filter={`url(#${id}-grain)`} clipPath={`url(#${id}-clip)`} opacity={0.14} />
      <ellipse cx={width / 2} cy={ry} rx={width / 2} ry={ry} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2} />
      <path d={`M${width * 0.04} ${ry * 1.4} L${width * 0.04} ${ry + height * 0.92}`} stroke="#fff" strokeOpacity={0.18} strokeWidth={width * 0.03} strokeLinecap="round" />
    </svg>
  );
};

/** Hauteur de l'ellipse supérieure : utile pour poser un produit au centre du plateau. */
export const plinthTopOffset = (width: number) => width * 0.12;
