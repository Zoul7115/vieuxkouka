import React from "react";
import { AbsoluteFill } from "remotion";

export type CameraState = { zoom: number; x: number; y: number };

/**
 * Plan de parallaxe : `depth` = 0 (fond immobile) → 1 (premier plan suivant la caméra).
 * Simule un mouvement de caméra virtuel en déplaçant les couches à des vitesses différentes.
 */
export const CameraLayer: React.FC<{
  camera: CameraState;
  depth: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ camera, depth, origin = "50% 55%", children }) => {
  const zoom = 1 + (camera.zoom - 1) * depth;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${camera.x * depth}px, ${camera.y * depth}px) scale(${zoom})`,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
