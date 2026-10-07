import React, { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";
import { COLORS } from "../config/theme";
import { useSvgId } from "./cosmetics/useSvgId";

/** Fond de studio : dégradé chaud + halo de lumière principal. */
export const StudioBackdrop: React.FC<{
  top: string;
  bottom: string;
  glow?: string;
  glowX?: number;
  glowY?: number;
  glowSize?: number;
}> = ({ top, bottom, glow = "rgba(255,253,248,0.9)", glowX = 50, glowY = 42, glowSize = 70 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)` }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse ${glowSize}% ${glowSize * 0.62}% at ${glowX}% ${glowY}%, ${glow} 0%, rgba(255,253,248,0) 100%)`,
      }}
    />
  </AbsoluteFill>
);

/** Arche architecturale douce derrière la composition. */
export const Arch: React.FC<{ x: number; y: number; width: number; height: number; color: string; opacity?: number }> = ({
  x,
  y,
  width,
  height,
  color,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - width / 2,
      top: y,
      width,
      height,
      borderRadius: `${width / 2}px ${width / 2}px 0 0`,
      background: `linear-gradient(180deg, ${color} 0%, rgba(255,255,255,0) 115%)`,
      boxShadow: "inset 18px 30px 60px rgba(255,255,255,0.35), inset -24px 0 50px rgba(73,53,43,0.06)",
      opacity,
    }}
  />
);

/** Feuille palmée de baobab (ombre portée façon « gobo » de studio). */
const BaobabLeaf: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const leaflets = [-78, -46, -16, 14, 44, 76, 104];
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200">
      <g fill={color}>
        {leaflets.map((a, i) => {
          const len = 82 - Math.abs(a - 14) * 0.28;
          return <ellipse key={i} cx={0} cy={-len / 2 - 6} rx={13} ry={len / 2} transform={`rotate(${a})`} />;
        })}
        <rect x={-2.5} y={0} width={5} height={95} rx={2.5} transform="rotate(195)" />
      </g>
    </svg>
  );
};

export const LeafShadows: React.FC<{
  frame: number;
  opacity?: number;
  items: { x: number; y: number; size: number; rotate: number }[];
}> = ({ frame, opacity = 0.1, items }) => (
  <AbsoluteFill style={{ filter: "blur(16px)", opacity, pointerEvents: "none" }}>
    {items.map((it, i) => {
      const sway = Math.sin(frame / 38 + i * 1.7) * 2.2;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: it.x - it.size / 2,
            top: it.y - it.size / 2,
            transform: `rotate(${it.rotate + sway}deg)`,
          }}
        >
          <BaobabLeaf size={it.size} color={COLORS.brown} />
        </div>
      );
    })}
  </AbsoluteFill>
);

/** Rayons de lumière diagonaux, très doux (fenêtre hors champ). */
export const LightShafts: React.FC<{ frame: number; opacity?: number; angle?: number }> = ({ frame, opacity = 0.35, angle = -24 }) => {
  const drift = Math.sin(frame / 50) * 20;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "screen", pointerEvents: "none", filter: "blur(28px)" }}>
      {[
        { x: 120, w: 150 },
        { x: 380, w: 90 },
        { x: 560, w: 200 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x + drift * (i + 1) * 0.4,
            top: -300,
            width: b.w,
            height: 2600,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50% 0%",
            background: "linear-gradient(180deg, rgba(255,250,236,0.95) 0%, rgba(255,250,236,0.25) 60%, rgba(255,250,236,0) 100%)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Particules lumineuses dorées en suspension (bokeh discret). */
export const Bokeh: React.FC<{ frame: number; count?: number; seed?: string; color?: string; opacity?: number }> = ({
  frame,
  count = 18,
  seed = "bokeh",
  color = COLORS.goldLight,
  opacity = 0.5,
}) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: random(`${seed}-x-${i}`) * 1080,
        y: random(`${seed}-y-${i}`) * 1920,
        r: 6 + random(`${seed}-r-${i}`) * 26,
        speed: 0.25 + random(`${seed}-s-${i}`) * 0.6,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
        a: 0.25 + random(`${seed}-a-${i}`) * 0.6,
      })),
    [count, seed],
  );
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const y = p.y - frame * p.speed;
        const x = p.x + Math.sin(frame / 40 + p.phase) * 12;
        const twinkle = 0.65 + 0.35 * Math.sin(frame / 18 + p.phase);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - p.r,
              top: y - p.r,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, rgba(216,194,154,0) 70%)`,
              opacity: p.a * twinkle,
              filter: p.r > 20 ? "blur(3px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Grain photographique fin (évite les aplats numériques et le banding). */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const id = useSvgId("grain");
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
      <svg width="1080" height="1920">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Vignettage doux pour concentrer le regard. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.35, color = "43,31,25" }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 85% 70% at 50% 48%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);
