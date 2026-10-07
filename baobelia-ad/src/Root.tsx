import React from "react";
import { Composition, Folder } from "remotion";
import { BaobeliaAd } from "./BaobeliaAd";
import { VIDEO } from "./config/video";

export const RemotionRoot: React.FC = () => (
  <Folder name="BAOBELIA">
    <Composition id={VIDEO.id} component={BaobeliaAd} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={VIDEO.durationInFrames} />
  </Folder>
);
