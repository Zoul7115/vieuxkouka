import React from "react";
import { AbsoluteFill } from "remotion";
import { MusicTrack } from "./components/MusicTrack";
import { LightBloom, SceneSlot } from "./components/Transitions";
import { COLORS } from "./config/theme";
import { SCENES } from "./config/video";
import { loadBrandFonts } from "./fonts";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Discovery } from "./scenes/Scene2Discovery";
import { Scene3Range } from "./scenes/Scene3Range";
import { Scene4Finale } from "./scenes/Scene4Finale";

loadBrandFonts();

/** Publicité BAOBÉLIA — 4 séquences calées sur le storyboard (0-3 s, 3-7 s, 7-11 s, 11-15 s). */
export const BaobeliaAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.brownDeep }}>
    <SceneSlot name="1 · Accroche" from={SCENES.hook.from} duration={SCENES.hook.duration} isFirst>
      <Scene1Hook />
    </SceneSlot>
    <SceneSlot name="2 · Découverte" from={SCENES.discovery.from} duration={SCENES.discovery.duration}>
      <Scene2Discovery />
    </SceneSlot>
    <SceneSlot name="3 · Univers de la gamme" from={SCENES.range.from} duration={SCENES.range.duration}>
      <Scene3Range />
    </SceneSlot>
    <SceneSlot name="4 · Final" from={SCENES.finale.from} duration={SCENES.finale.duration} isLast>
      <Scene4Finale />
    </SceneSlot>
    {/* Passage de l'ombre à la lumière entre l'accroche et la découverte */}
    <LightBloom at={SCENES.discovery.from} span={10} strength={0.75} />
    <MusicTrack />
  </AbsoluteFill>
);
