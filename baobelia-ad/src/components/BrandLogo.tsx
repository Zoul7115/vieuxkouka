import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { BRAND_NAME } from "../config/texts";
import { EASE_OUT, progress } from "./motion";

/**
 * Logo typographique BAOBÉLIA : texte réel (modifiable), espacement qui se resserre,
 * filets dorés qui se dessinent, et reflet lumineux qui traverse les lettres.
 */
export const BrandLogo: React.FC<{
  frame: number;
  start: number;
  fontSize: number;
  color?: string;
  ruleColor?: string;
  /** Image (temps local) du reflet lumineux ; null pour le désactiver. */
  shineAt?: number | null;
  showRules?: boolean;
  glow?: boolean;
}> = ({ frame, start, fontSize, color = COLORS.brown, ruleColor = COLORS.gold, shineAt = null, showRules = true, glow }) => {
  const letters = Array.from(BRAND_NAME);
  const spacing = interpolate(progress(frame, start, 42), [0, 1], [0.42, 0.16]);
  const rule = progress(frame, start + 14, 30);
  const shine = shineAt === null ? -1 : interpolate(frame, [shineAt, shineAt + 28], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const letterRow = (layer: "base" | "shine") => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily: FONTS.brand,
        fontWeight: 600,
        fontSize,
        lineHeight: 1,
        letterSpacing: `${spacing}em`,
        marginRight: `-${spacing}em`, // compense l'espacement après la dernière lettre
        whiteSpace: "nowrap",
        ...(layer === "shine"
          ? {
              position: "absolute",
              inset: 0,
              color: "transparent",
              backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${shine - 14}%, rgba(255,246,222,0.95) ${shine}%, rgba(255,255,255,0) ${shine + 14}%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }
          : {}),
      }}
    >
      {letters.map((l, i) => {
        const t = interpolate(frame, [start + i * 2.5, start + i * 2.5 + 22], [0, 1], {
          easing: EASE_OUT,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: t,
              color: layer === "base" ? color : undefined,
              filter: layer === "base" && t < 1 ? `blur(${(1 - t) * 12}px)` : undefined,
              transform: `translateY(${(1 - t) * 18}px)`,
              textShadow: layer === "base" && glow ? "0 0 40px rgba(216,194,154,0.45)" : undefined,
            }}
          >
            {l}
          </span>
        );
      })}
    </div>
  );

  const ruleEl = (
    <div style={{ display: "flex", alignItems: "center", gap: fontSize * 0.12, transform: `scaleX(${rule})`, opacity: rule }}>
      <div style={{ width: fontSize * 1.1, height: 2, background: `linear-gradient(90deg, rgba(182,154,105,0), ${ruleColor})` }} />
      <div style={{ width: fontSize * 0.08, height: fontSize * 0.08, background: ruleColor, transform: "rotate(45deg)" }} />
      <div style={{ width: fontSize * 1.1, height: 2, background: `linear-gradient(90deg, ${ruleColor}, rgba(182,154,105,0))` }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: fontSize * 0.26 }}>
      <div style={{ position: "relative" }}>
        {letterRow("base")}
        {shine > -30 && shine < 130 && letterRow("shine")}
      </div>
      {showRules && ruleEl}
    </div>
  );
};
