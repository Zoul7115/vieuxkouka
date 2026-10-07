import React from "react";
import { Audio, interpolate, useVideoConfig } from "remotion";
import { MUSIC, resolveAsset } from "../config/assets";

/** Musique facultative : rien n'est rendu tant que MUSIC.file vaut null. */
export const MusicTrack: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  if (!MUSIC.file) return null;
  return (
    <Audio
      src={resolveAsset(MUSIC.file)}
      volume={(f) =>
        interpolate(f, [0, 15, durationInFrames - MUSIC.fadeOutFrames, durationInFrames], [0, MUSIC.volume, MUSIC.volume, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};
