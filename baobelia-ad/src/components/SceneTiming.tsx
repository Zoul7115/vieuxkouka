import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

/**
 * Chaque scène démarre quelques images avant son début officiel (fondu enchaîné).
 * `useSceneFrame()` renvoie le temps local aligné sur le storyboard :
 * 0 = début officiel de la scène (valeurs négatives pendant le fondu d'entrée).
 */
const LeadContext = createContext(0);

export const SceneTimingProvider: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => (
  <LeadContext.Provider value={lead}>{children}</LeadContext.Provider>
);

export const useSceneFrame = () => useCurrentFrame() - useContext(LeadContext);
