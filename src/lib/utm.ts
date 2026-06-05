/** Capture UTM / campagne depuis l'URL et persiste 30 jours en localStorage */
const KEY = 'kouka_attribution';
const KEYS = ['utm_source', 'utm_campaign', 'utm_content', 'utm_adset', 'utm_ad', 'campaign', 'adset', 'ad'] as const;
export type Attribution = Partial<Record<(typeof KEYS)[number], string>>;

export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const url = new URL(window.location.href);
    const fromUrl: Attribution = {};
    KEYS.forEach((k) => { const v = url.searchParams.get(k); if (v) fromUrl[k] = v; });
    if (Object.keys(fromUrl).length) {
      localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data: fromUrl }));
      return fromUrl;
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.at || 0) > 30 * 24 * 3600 * 1000) return {};
    return (parsed.data || {}) as Attribution;
  } catch { return {}; }
}
