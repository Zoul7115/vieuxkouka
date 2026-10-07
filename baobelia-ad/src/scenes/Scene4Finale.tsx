import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Bokeh, FilmGrain, LightShafts, StudioBackdrop, Vignette } from "../components/Atmosphere";
import { BrandLogo } from "../components/BrandLogo";
import { CameraLayer } from "../components/Camera";
import { CallToAction } from "../components/CallToAction";
import { Plinth, plinthTopOffset } from "../components/cosmetics/Plinth";
import { Product } from "../components/cosmetics/Product";
import { EASE_IN_OUT, EASE_OUT, mix, progress } from "../components/motion";
import { useSceneFrame } from "../components/SceneTiming";
import { ProductSlot } from "../config/assets";
import { COLORS } from "../config/theme";
import { TEXTS } from "../config/texts";

const PLINTH = { width: 860, top: 1400 };
const TOP_Y = PLINTH.top + plinthTopOffset(PLINTH.width);

/** Composition finale : rangée arrière (pompe, sérum), rangée avant (pot, tube). */
const GROUP: { slot: ProductSlot; x: number; baseY: number; size: number; fromX: number; delay: number }[] = [
  { slot: "pump", x: 415, baseY: TOP_Y - 30, size: 520, fromX: 120, delay: 0 },
  { slot: "serum", x: 615, baseY: TOP_Y - 34, size: 540, fromX: 620, delay: 4 },
  { slot: "jar", x: 300, baseY: TOP_Y + 58, size: 600, fromX: 20, delay: 8 },
  { slot: "tube", x: 800, baseY: TOP_Y + 50, size: 520, fromX: 1080, delay: 6 },
];

const T = { gather: -6, halo: 4, logo: 14, cta: 34, shine: 80 };

export const Scene4Finale: React.FC = () => {
  const f = useSceneFrame();

  // Caméra : très léger travelling avant, stabilisé pour la lecture finale
  const cam = progress(f, -7, 127, EASE_IN_OUT);
  const camera = { zoom: 1 + 0.04 * cam, x: 0, y: -16 * cam };

  const plinthIn = progress(f, T.gather, 28, EASE_OUT);
  const halo = progress(f, T.halo, 40, EASE_OUT);
  const ring = progress(f, T.halo + 6, 50, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ivory }}>
      <CameraLayer camera={camera} depth={0.25}>
        <StudioBackdrop top="#FBF8F2" bottom="#E7D9C3" glow="rgba(255,253,248,1)" glowY={58} glowSize={100} />
        <LightShafts frame={f} opacity={0.25} />
      </CameraLayer>

      {/* Halo solaire sable et anneau doré derrière la composition */}
      <CameraLayer camera={camera} depth={0.5}>
        <div
          style={{
            position: "absolute",
            left: 540 - 420,
            top: 1130 - 420,
            width: 840,
            height: 840,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(217,198,170,0.75) 0%, rgba(217,198,170,0.35) 55%, rgba(217,198,170,0) 72%)`,
            opacity: halo,
            transform: `scale(${0.85 + 0.15 * halo})`,
          }}
        />
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <circle
            cx="540"
            cy="1130"
            r="370"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={2}
            strokeOpacity={0.7}
            strokeDasharray={2 * Math.PI * 370}
            strokeDashoffset={2 * Math.PI * 370 * (1 - ring)}
            transform="rotate(-90 540 1130)"
          />
        </svg>
      </CameraLayer>

      <CameraLayer camera={camera} depth={1} origin="50% 70%">
        <div style={{ position: "absolute", left: 540 - PLINTH.width / 2, top: PLINTH.top, transform: `translateY(${(1 - plinthIn) * 220}px)`, opacity: plinthIn }}>
          <Plinth width={PLINTH.width} height={700} tone="ivory" />
        </div>
        {GROUP.map((p) => {
          const t = progress(f, T.gather + p.delay, 36, EASE_OUT);
          const sweep = interpolate(f, [T.shine + p.delay, T.shine + p.delay + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={p.slot} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - plinthIn) * 220}px)` }}>
              <Product
                slot={p.slot}
                x={mix(p.fromX, p.x, t)}
                baseY={p.baseY}
                size={p.size}
                lift={(1 - t) * 120}
                opacity={Math.min(1, t * 1.8)}
                sweep={sweep}
              />
            </div>
          );
        })}
      </CameraLayer>

      <CameraLayer camera={camera} depth={0.6}>
        <Bokeh frame={f} count={12} seed="finale" opacity={0.4} />
      </CameraLayer>

      {/* Logo et appel à l'action — fixes, dans la zone de sécurité haute */}
      <AbsoluteFill>
        <div style={{ position: "absolute", top: 300, width: "100%" }}>
          <BrandLogo frame={f} start={T.logo} fontSize={124} shineAt={T.shine} />
        </div>
        <div style={{ position: "absolute", top: 520, width: "100%", display: "flex", justifyContent: "center" }}>
          <CallToAction lines={TEXTS.finale} frame={f} start={T.cta} />
        </div>
      </AbsoluteFill>

      <Vignette strength={0.16} />
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
