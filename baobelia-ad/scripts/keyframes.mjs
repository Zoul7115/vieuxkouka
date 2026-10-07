// Contrôle qualité : exporte des images clés de chaque scène dans out/keyframes/.
// Usage : node scripts/keyframes.mjs [frame1 frame2 ...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const frames = process.argv.slice(2).map(Number);
const list = frames.length ? frames : [5, 30, 55, 80, 89, 92, 100, 130, 170, 205, 215, 240, 280, 325, 340, 370, 400, 449];
const outDir = path.resolve("out/keyframes");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({ serveUrl, id: "BaobeliaAd", browserExecutable });
for (const frame of list) {
  const output = path.join(outDir, `frame-${String(frame).padStart(3, "0")}.png`);
  await renderStill({ composition, serveUrl, frame, output, browserExecutable });
  console.log("✓", output);
}
