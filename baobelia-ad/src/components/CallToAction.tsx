import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { TextLines } from "../config/texts";
import { EASE_OUT, progress } from "./motion";

/** Bouton d'appel à l'action : fort contraste (ivoire sur brun) et filet doré. */
export const CallToAction: React.FC<{ lines: TextLines; frame: number; start: number }> = ({ lines, frame, start }) => {
  const t = progress(frame, start, 22, EASE_OUT);
  const text = progress(frame, start + 6, 20, EASE_OUT);
  const label = lines.map((l) => l.map((s) => s.text).join(" ")).join(" ");
  // Respiration lumineuse très discrète du filet doré une fois le bouton affiché
  const pulse = frame > start + 30 ? 0.55 + 0.45 * Math.sin((frame - start - 30) / 9) : 1;
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * 26}px) scale(${0.94 + 0.06 * t})`,
        padding: "30px 54px",
        borderRadius: 999,
        background: `linear-gradient(180deg, #5A4235 0%, ${COLORS.brown} 55%, #3C2B22 100%)`,
        boxShadow: `0 18px 40px rgba(73,53,43,0.28), inset 0 0 0 2px rgba(216,194,154,${0.45 + 0.35 * pulse}), inset 0 2px 0 rgba(255,255,255,0.12)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.text,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: "0.01em",
          color: COLORS.cream,
          whiteSpace: "nowrap",
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [10, 0])}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};
