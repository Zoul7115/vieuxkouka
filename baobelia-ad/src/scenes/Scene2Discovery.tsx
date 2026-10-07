import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Arch, Bokeh, FilmGrain, LeafShadows, LightShafts, StudioBackdrop, Vignette } from "../components/Atmosphere";
import { AnimatedText } from "../components/AnimatedText";
import { CameraLayer } from "../components/Camera";
import { Plinth, plinthTopOffset } from "../components/cosmetics/Plinth";
import { Product } from "../components/cosmetics/Product";
import { EASE_IN_OUT, EASE_OUT, progress } from "../components/motion";
import { useSceneFrame } from "../components/SceneTiming";
import { COLORS } from "../config/theme";
import { TEXTS } from "../config/texts";

const T = { plinth: -6, bottle: 4, text: 24, sweep: 58 };
const PLINTH = { width: 470, top: 1360 };

export const Scene2Discovery: React.FC = () => {
  const f = useSceneFrame();

  // Caméra virtuelle : lent travelling avant avec légère dérive latérale
  const cam = progress(f, -7, 134, EASE_IN_OUT);
  const camera = { zoom: 1 + 0.08 * cam, x: -22 * cam, y: -40 * cam };

  const plinthIn = progress(f, T.plinth, 30, EASE_OUT);
  const bottleIn = progress(f, T.bottle, 40, EASE_OUT);
  const baseY = PLINTH.top + plinthTopOffset(PLINTH.width) + 8;
  const sweep = interpolate(f, [T.sweep, T.sweep + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ivory }}>
      <CameraLayer camera={camera} depth={0.2}>
        <StudioBackdrop top={COLORS.ivory} bottom="#E2D2B9" glowY={40} glowSize={90} />
        <LeafShadows
          frame={f}
          opacity={0.11}
          items={[
            { x: 930, y: 380, size: 560, rotate: 200 },
            { x: 120, y: 980, size: 460, rotate: 40 },
          ]}
        />
      </CameraLayer>
      <CameraLayer camera={camera} depth={0.45}>
        <Arch x={540} y={600} width={640} height={1500} color="#EFE5D5" />
        <LightShafts frame={f} opacity={0.32} />
      </CameraLayer>

      <CameraLayer camera={camera} depth={1} origin="50% 62%">
        <div style={{ position: "absolute", left: 540 - PLINTH.width / 2, top: PLINTH.top, transform: `translateY(${(1 - plinthIn) * 160}px)`, opacity: plinthIn }}>
          <Plinth width={PLINTH.width} height={760} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - plinthIn) * 160}px)` }}>
          <Product
            slot="serum"
            x={540}
            baseY={baseY}
            size={740}
            lift={(1 - bottleIn) * 280}
            opacity={progress(f, T.bottle, 16)}
            sweep={sweep}
          />
        </div>
      </CameraLayer>

      <CameraLayer camera={camera} depth={0.7}>
        <Bokeh frame={f} count={10} seed="discovery" opacity={0.35} color="#FFFFFF" />
      </CameraLayer>

      <AbsoluteFill>
        <div style={{ position: "absolute", top: 280, width: "100%" }}>
          <AnimatedText lines={TEXTS.discovery} start={T.text} frame={f} fontSize={62} brandFontSize={132} stagger={5} lineGap={0.05} />
        </div>
      </AbsoluteFill>

      <Vignette strength={0.18} />
      <FilmGrain opacity={0.06} />
    </AbsoluteFill>
  );
};
