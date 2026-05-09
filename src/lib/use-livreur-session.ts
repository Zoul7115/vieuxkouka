import { useEffect, useState } from 'react';
import { getStoredSession, type LivreurSession } from './livreur-auth';

/** Hook partagé pour les routes enfants /livreur/* */
export function useLivreurSession() {
  const [session, setSession] = useState<LivreurSession | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSession(getStoredSession());
    setReady(true);
  }, []);
  return { session, ready };
}
