import { Easing, interpolate } from "remotion";

/** Courbes d'animation douces, sans rebond. */
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

/** Progression 0 → 1 entre `start` et `start + duration`. */
export const progress = (frame: number, start: number, duration: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const mix = (from: number, to: number, t: number) => from + (to - from) * t;
