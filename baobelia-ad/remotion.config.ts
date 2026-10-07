import { Config } from "@remotion/cli/config";

// Export H.264 vertical, qualité élevée, compatible réseaux sociaux.
// Images intermédiaires PNG : sortie en yuv420p standard (plage TV), sans perte avant encodage.
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);

// Facultatif : utiliser un Chromium déjà installé (ex. hors ligne).
// BROWSER_EXECUTABLE=/chemin/vers/chrome-headless-shell npm run render
if (process.env.BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.BROWSER_EXECUTABLE);
}
