// Tracking Facebook désactivé : aucun pixel n'est configuré sur ce projet.
// Les fonctions restent en place (no-op) pour ne pas casser les appels existants.

export const FB_PIXEL_IDS: readonly string[] = [];
export const FB_PIXEL_ID = '';

type CapiUser = { phone?: string; country?: string; city?: string };

export async function trackFB(
  _eventName: string,
  _params: { value?: number; currency?: string; content_name?: string } = {},
  _user: CapiUser = {},
): Promise<void> {
  // no-op
}
