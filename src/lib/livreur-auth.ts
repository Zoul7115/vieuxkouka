import { supabase } from '@/integrations/supabase/client';
import type { Livreur } from './livreurs';

const STORAGE_KEY = 'kouka_livreur_session_v1';
const SALT = 'kouka_livreur_2026';

/** Normalise un numéro WhatsApp (garde uniquement les chiffres) */
export function normalizePhone(raw: string): string {
  return (raw || '').replace(/\D/g, '');
}

/** Hash SHA-256 du mot de passe avec sel */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type LivreurSession = {
  idx: number;
  id: string;
  name: string;
  whatsapp: string;
  token: string; // = password_hash, sert de jeton de session local
  savedAt: number;
};

export function getStoredSession(): LivreurSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as LivreurSession;
    // Validité 90 jours
    if (Date.now() - s.savedAt > 90 * 24 * 3600 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function saveSession(s: LivreurSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Cherche un livreur par numéro WhatsApp (compare en chiffres uniquement) */
async function findLivreurByPhone(phone: string): Promise<Livreur | null> {
  const target = normalizePhone(phone);
  const { data } = await supabase.from('livreurs').select('*').eq('active', true);
  if (!data) return null;
  return (data as Livreur[]).find((l) => normalizePhone(l.whatsapp) === target) || null;
}

export type LoginResult =
  | { ok: true; session: LivreurSession; firstLogin: boolean }
  | { ok: false; reason: 'not_found' | 'wrong_password' };

/**
 * Connexion livreur :
 * - Si pas de password_hash → on crée le compte avec ce mot de passe (1ʳᵉ connexion).
 * - Sinon → on compare avec le hash en base.
 */
export async function loginLivreur(phone: string, password: string): Promise<LoginResult> {
  const livreur = await findLivreurByPhone(phone);
  if (!livreur) return { ok: false, reason: 'not_found' };
  const hash = await hashPassword(password);
  type WithAuth = Livreur & { password_hash?: string | null };
  const stored = (livreur as WithAuth).password_hash;
  let firstLogin = false;
  if (!stored) {
    // 1ʳᵉ connexion : on enregistre le hash
    await supabase
      .from('livreurs')
      .update({ password_hash: hash, last_login_at: new Date().toISOString() })
      .eq('id', livreur.id);
    firstLogin = true;
  } else if (stored !== hash) {
    return { ok: false, reason: 'wrong_password' };
  } else {
    await supabase.from('livreurs').update({ last_login_at: new Date().toISOString() }).eq('id', livreur.id);
  }
  const session: LivreurSession = {
    idx: livreur.idx,
    id: livreur.id,
    name: livreur.name,
    whatsapp: livreur.whatsapp,
    token: hash,
    savedAt: Date.now(),
  };
  saveSession(session);
  return { ok: true, session, firstLogin };
}
