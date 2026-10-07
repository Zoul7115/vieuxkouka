import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Bokeh, FilmGrain, LightShafts, StudioBackdrop, Vignette } from "../components/Atmosphere";
import { AnimatedText } from "../components/AnimatedText";
import { BrandLogo } from "../components/BrandLogo";
import { CameraLayer } from "../components/Camera";
import { SerumDrop } from "../components/cosmetics/SerumDrop";
import { useSvgId } from "../components/cosmetics/useSvgId";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, progress } from "../components/motion";
import { useSceneFrame } from "../components/SceneTiming";
import { COLORS } from "../config/theme";
import { TEXTS } from "../config/texts";

// Repères temporels (images, temps local de la scène)
const T = {
  pipetteIn: 0,
  dropForm: 4,
  dropFall: 20,
  impact: 34,
  logo: 26,
  tagline: 32,
};
const TIP_Y = 340; // extrémité de la pipette
const POOL_Y = 1260; // surface du sérum

/** Pipette en verre ambré qui entre par le haut du cadre. */
const Pipette: React.FC<{ y: number }> = ({ y }) => {
  const id = useSvgId("pipette");
  return (
  <svg width="120" height="630" viewBox="0 0 80 420" style={{ position: "absolute", left: 480, top: TIP_Y - 600 + y }}>
    <defs>
      <linearGradient id={id} x1="0" x2="1">
        <stop offset="0" stopColor="#5A3A22" stopOpacity={0.9} />
        <stop offset="0.4" stopColor="#C89458" stopOpacity={0.75} />
        <stop offset="1" stopColor="#4A2E1B" stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <path d="M22 0 L58 0 L58 300 C58 340 48 370 44 398 Q40 408 36 398 C32 370 22 340 22 300 Z" fill={`url(#${id})`} />
    <path d="M27 0 L27 300 C27 330 33 360 37 390" stroke="#FFF1D2" strokeOpacity={0.55} strokeWidth={3} fill="none" />
    <rect x="26" y="230" width="28" height="120" rx="12" fill="#E3A24E" opacity={0.5} />
  </svg>
  );
};

export const Scene1Hook: React.FC = () => {
  const f = useSceneFrame();

  const camera = {
    zoom: interpolate(f, [0, 96], [1, 1.07], { easing: EASE_IN_OUT, extrapolateRight: "clamp" }),
    x: 0,
    y: interpolate(f, [0, 96], [0, -24], { extrapolateRight: "clamp" }),
  };

  // Pipette
  const pipetteY = interpolate(progress(f, T.pipetteIn, 16), [0, 1], [-200, 0]);
  const pipetteOut = progress(f, T.impact, 30, EASE_IN_OUT);

  // Goutte : formation, chute (accélérée), impact
  const form = progress(f, T.dropForm, T.dropFall - T.dropForm, EASE_OUT);
  const fall = progress(f, T.dropFall, T.impact - T.dropFall, EASE_IN);
  const dropSize = 40 + 60 * form;
  const dropTop = interpolate(fall, [0, 1], [TIP_Y - 6, POOL_Y - dropSize * 1.35 + 14]);
  const dropVisible = f < T.impact + 1;
  const stretch = 1 + fall * 0.22 + (1 - form) * 0.15;

  // Impact : ondes, éclat lumineux, gouttelettes
  const since = f - T.impact;
  const flare = since < 0 ? 0 : interpolate(since, [0, 6, 50], [0, 1, 0.35], { extrapolateRight: "clamp" });
  const ripples = [0, 9, 18].map((delay) => {
    const t = since - delay < 0 ? 0 : progress(f, T.impact + delay, 54, EASE_OUT);
    return { t, delay };
  });
  const splash = since < 0 ? 0 : progress(f, T.impact, 20, EASE_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.brownDeep }}>
      <CameraLayer camera={camera} depth={0.3}>
        <StudioBackdrop top="#3B2A21" bottom="#171009" glow="rgba(182,154,105,0.35)" glowY={44} glowSize={95} />
        <LightShafts frame={f} opacity={0.07} angle={-20} />
      </CameraLayer>
      <CameraLayer camera={camera} depth={0.5}>
        <Bokeh frame={f + 40} count={22} seed="hook" opacity={0.45} />
      </CameraLayer>

      <CameraLayer camera={camera} depth={1}>
        {/* Surface de sérum */}
        <div
          style={{
            position: "absolute",
            left: 540 - 520,
            top: POOL_Y - 70,
            width: 1040,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(227,168,81,0.55), rgba(140,86,38,0.25) 60%, rgba(43,31,25,0) 100%)",
            filter: "blur(4px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - 300,
            top: POOL_Y - 12,
            width: 600,
            height: 24,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,232,186,0.7), rgba(255,232,186,0))",
            opacity: 0.4 + flare * 0.6,
          }}
        />
        {/* Ondes concentriques */}
        <svg width="1080" height="400" viewBox="0 0 1080 400" style={{ position: "absolute", left: 0, top: POOL_Y - 200 }}>
          {ripples.map(({ t, delay }) =>
            t > 0 ? (
              <ellipse
                key={delay}
                cx="540"
                cy="200"
                rx={20 + t * 440}
                ry={(20 + t * 440) * 0.13}
                fill="none"
                stroke="#F3D9A4"
                strokeWidth={3.5 - t * 2.5}
                opacity={(1 - t) * 0.85}
              />
            ) : null,
          )}
          {/* Gouttelettes projetées */}
          {splash > 0 &&
            [-1, -0.45, 0.4, 1].map((d, i) => {
              const s = splash;
              const x = 540 + d * 70 * s;
              const y = 200 - Math.sin(s * Math.PI) * (60 + Math.abs(d) * 30);
              return <circle key={i} cx={x} cy={y} r={5 - Math.abs(d) * 1.5} fill="#F6D398" opacity={1 - s} />;
            })}
        </svg>
        {/* Éclat lumineux à l'impact */}
        <div
          style={{
            position: "absolute",
            left: 540 - 380,
            top: POOL_Y - 380,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,226,168,0.55), rgba(255,226,168,0))",
            opacity: flare,
            mixBlendMode: "screen",
          }}
        />

        <div style={{ opacity: 1 - pipetteOut, transform: `translateY(${-pipetteOut * 220}px)` }}>
          <Pipette y={pipetteY} />
        </div>
        {dropVisible && (
          <div style={{ position: "absolute", left: 540 - dropSize / 2, top: dropTop }}>
            <SerumDrop size={dropSize} stretch={stretch} />
          </div>
        )}
      </CameraLayer>

      {/* Textes (hors caméra : parfaitement stables et lisibles) */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 610, width: "100%" }}>
          <BrandLogo frame={f} start={T.logo} fontSize={118} color={COLORS.cream} ruleColor={COLORS.gold} glow />
        </div>
        <div style={{ position: "absolute", top: 860, width: "100%" }}>
          <AnimatedText
            lines={TEXTS.hook}
            start={T.tagline}
            frame={f}
            fontSize={62}
            color={COLORS.ivory}
            stagger={3}
            wordDuration={18}
            weight={500}
            shadow="0 2px 24px rgba(0,0,0,0.45)"
          />
        </div>
      </AbsoluteFill>

      <Vignette strength={0.55} color="15,10,7" />
      <FilmGrain opacity={0.08} />
      {/* Ouverture : fondu depuis le noir */}
      <AbsoluteFill style={{ backgroundColor: "#0E0906", opacity: interpolate(f, [0, 10], [1, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
