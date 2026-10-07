import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS } from "../config/theme";
import { TextLines } from "../config/texts";
import { EASE_OUT } from "./motion";

type AnimatedTextProps = {
  lines: TextLines;
  /** Image (temps local de la scène) à laquelle le premier mot apparaît. */
  start: number;
  frame: number;
  fontSize: number;
  brandFontSize?: number;
  color?: string;
  brandColor?: string;
  /** Décalage entre deux mots (images). */
  stagger?: number;
  wordDuration?: number;
  lineGap?: number;
  weight?: number;
  shadow?: string;
  style?: React.CSSProperties;
};

/**
 * Texte révélé mot par mot : montée douce, fondu et mise au point (flou → net).
 * Les segments « brand » utilisent la typographie du logo.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  lines,
  start,
  frame,
  fontSize,
  brandFontSize = fontSize * 1.9,
  color = COLORS.brown,
  brandColor = COLORS.brown,
  stagger = 4,
  wordDuration = 20,
  lineGap = 0.18,
  weight = 500,
  shadow,
  style,
}) => {
  let wordIndex = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "baseline", marginTop: li === 0 ? 0 : fontSize * lineGap }}>
          {line.map((seg, si) =>
            seg.text.split(" ").map((word, wi) => {
              const i = wordIndex++;
              const t = interpolate(frame, [start + i * stagger, start + i * stagger + wordDuration], [0, 1], {
                easing: EASE_OUT,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const isBrand = !!seg.brand;
              return (
                <span
                  key={`${si}-${wi}`}
                  style={{
                    display: "inline-block",
                    whiteSpace: "pre",
                    fontFamily: isBrand ? FONTS.brand : FONTS.text,
                    fontWeight: isBrand ? 600 : weight,
                    fontSize: isBrand ? brandFontSize : fontSize,
                    letterSpacing: isBrand ? "0.08em" : "0.01em",
                    lineHeight: 1.12,
                    color: isBrand ? brandColor : color,
                    opacity: t,
                    transform: `translateY(${(1 - t) * fontSize * 0.55}px)`,
                    filter: t < 1 ? `blur(${(1 - t) * 10}px)` : undefined,
                    textShadow: shadow,
                    marginRight: wi < seg.text.split(" ").length - 1 || si < line.length - 1 ? "0.28em" : 0,
                  }}
                >
                  {word}
                </span>
              );
            }),
          )}
        </div>
      ))}
    </div>
  );
};
