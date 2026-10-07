import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";
import { TRANSITION_FRAMES } from "../config/video";
import { EASE_IN_OUT } from "./motion";
import { SceneTimingProvider } from "./SceneTiming";

/**
 * Place une scène sur la timeline à sa position exacte du storyboard.
 * Elle commence TRANSITION_FRAMES/2 images plus tôt et apparaît par un fondu
 * (léger zoom et flou) par-dessus la scène précédente, qui reste opaque :
 * pas de baisse de luminosité pendant l'enchaînement.
 */
export const SceneSlot: React.FC<{
  from: number;
  duration: number;
  isFirst?: boolean;
  isLast?: boolean;
  name: string;
  children: React.ReactNode;
}> = ({ from, duration, isFirst, isLast, name, children }) => {
  const half = TRANSITION_FRAMES / 2;
  const lead = isFirst ? 0 : half;
  const tail = isLast ? 0 : half;
  return (
    <Sequence from={from - lead} durationInFrames={duration + lead + tail} name={name}>
      <SceneTimingProvider lead={lead}>
        <FadeIn enabled={!isFirst}>{children}</FadeIn>
      </SceneTimingProvider>
    </Sequence>
  );
};

const FadeIn: React.FC<{ enabled: boolean; children: React.ReactNode }> = ({ enabled, children }) => {
  const frame = useCurrentFrame();
  if (!enabled) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    easing: EASE_IN_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: t,
        transform: `scale(${1.04 - 0.04 * t})`,
        filter: t < 1 ? `blur(${(1 - t) * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Éclat de lumière ivoire (passage de l'ombre à la lumière entre deux scènes). */
export const LightBloom: React.FC<{ at: number; span?: number; strength?: number }> = ({ at, span = 18, strength = 0.85 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - span, at, at + span], [0, strength, 0], {
    easing: EASE_IN_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: o,
        background: `radial-gradient(ellipse 70% 55% at 50% 52%, ${COLORS.cream} 0%, rgba(247,242,233,0.85) 45%, rgba(217,198,170,0) 100%)`,
      }}
    />
  );
};
