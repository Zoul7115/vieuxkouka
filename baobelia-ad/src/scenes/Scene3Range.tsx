import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Bokeh, FilmGrain, LeafShadows, LightShafts, StudioBackdrop, Vignette } from "../components/Atmosphere";
import { AnimatedText } from "../components/AnimatedText";
import { CameraLayer } from "../components/Camera";
import { CreamSwatch } from "../components/cosmetics/CreamSwatch";
import { Plinth, plinthTopOffset } from "../components/cosmetics/Plinth";
import { Product } from "../components/cosmetics/Product";
import { EASE_IN_OUT, EASE_OUT, progress } from "../components/motion";
import { useSceneFrame } from "../components/SceneTiming";
import { ProductSlot } from "../config/assets";
import { COLORS } from "../config/theme";
import { TEXTS } from "../config/texts";

/** Colonnes minérales de hauteurs différentes, chacune portant un produit. */
const STAGE: {
  slot: ProductSlot;
  x: number;
  top: number;
  width: number;
  size: number;
  delay: number;
  tone: "sand" | "ivory";
  open?: boolean;
}[] = [
  { slot: "pump", x: 280, top: 1110, width: 310, size: 520, delay: 2, tone: "ivory" },
  { slot: "tube", x: 805, top: 1200, width: 280, size: 530, delay: 8, tone: "ivory" },
  { slot: "jar", x: 545, top: 1370, width: 420, size: 660, delay: 14, tone: "sand", open: true },
];

const T = { swatch: -4, text: 18, sweep: 62 };

export const Scene3Range: React.FC = () => {
  const f = useSceneFrame();

  // Travelling latéral doux + léger recul
  const cam = progress(f, -7, 134, EASE_IN_OUT);
  const camera = { zoom: 1.05 - 0.05 * cam, x: 36 - 72 * cam, y: 0 };
  const swatch = progress(f, T.swatch, 34, EASE_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.sand }}>
      <CameraLayer camera={camera} depth={0.2}>
        <StudioBackdrop top="#EFE4D3" bottom={COLORS.sand} glow="rgba(255,253,248,0.85)" glowY={52} glowSize={95} />
        <LeafShadows frame={f + 30} opacity={0.09} items={[{ x: 170, y: 420, size: 520, rotate: 150 }, { x: 980, y: 1060, size: 420, rotate: -30 }]} />
        <LightShafts frame={f} opacity={0.28} angle={22} />
      </CameraLayer>

      <CameraLayer camera={camera} depth={0.45}>
        <div style={{ position: "absolute", left: 40, top: 860, transform: `rotate(-5deg) translateY(${(1 - swatch) * 30}px)`, opacity: Math.min(1, swatch * 2) }}>
          <CreamSwatch width={1000} reveal={swatch} />
        </div>
      </CameraLayer>

      <CameraLayer camera={camera} depth={1} origin="50% 65%">
        {STAGE.map((s) => {
          const rise = progress(f, s.delay - 6, 34, EASE_OUT);
          const sweep = interpolate(f, [T.sweep + s.delay, T.sweep + s.delay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={s.slot} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - rise) * 320}px)`, opacity: Math.min(1, rise * 1.6) }}>
              <div style={{ position: "absolute", left: s.x - s.width / 2, top: s.top }}>
                <Plinth width={s.width} height={900} tone={s.tone} />
              </div>
              <Product slot={s.slot} x={s.x} baseY={s.top + plinthTopOffset(s.width) + 6} size={s.size} open={s.open} sweep={sweep} />
            </div>
          );
        })}
      </CameraLayer>

      <CameraLayer camera={camera} depth={0.7}>
        <Bokeh frame={f} count={10} seed="range" opacity={0.35} color="#FFFFFF" />
      </CameraLayer>

      <AbsoluteFill>
        <div style={{ position: "absolute", top: 300, width: "100%" }}>
          <AnimatedText lines={TEXTS.range} start={T.text} frame={f} fontSize={66} stagger={3} wordDuration={18} />
        </div>
      </AbsoluteFill>

      <Vignette strength={0.2} />
      <FilmGrain opacity={0.06} />
    </AbsoluteFill>
  );
};
