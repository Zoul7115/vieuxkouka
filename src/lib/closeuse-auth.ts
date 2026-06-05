import { supabase } from '@/integrations/supabase/client';
import type { Closeuse } from './closeuses';

const STORAGE_KEY = 'kouka_closeuse_session_v1';
const SALT = 'kouka_closeuse_2026';

export function normalizePhone(raw: string): string {
  return (raw || '').replace(/\D/g, '');
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type CloseuseSession = {
  idx: number;
  id: string;
  name: string;
  whatsapp: string;
  token: string;
  savedAt: number;
};

export function getStoredSession(): CloseuseSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as CloseuseSession;
    if (Date.now() - s.savedAt > 90 * 24 * 3600 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function saveSession(s: CloseuseSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

async function findCloseuseByPhone(phone: string): Promise<Closeuse | null> {
  const target = normalizePhone(phone);
  const { data } = await supabase.from('closeuses').select('*').eq('active', true);
  if (!data) return null;
  return (data as Closeuse[]).find((c) => normalizePhone(c.whatsapp) === target) || null;
}

export type LoginResult =
  | { ok: true; session: CloseuseSession; firstLogin: boolean }
  | { ok: false; reason: 'not_found' | 'wrong_password' };

export async function loginCloseuse(phone: string, password: string): Promise<LoginResult> {
  const c = await findCloseuseByPhone(phone);
  if (!c) return { ok: false, reason: 'not_found' };
  const hash = await hashPassword(password);
  const stored = c.password_hash;
  let firstLogin = false;
  const now = new Date().toISOString();
  if (!stored) {
    await supabase.from('closeuses').update({ password_hash: hash, last_login_at: now, last_activity_at: now } as any).eq('id', c.id);
    firstLogin = true;
  } else if (stored !== hash) {
    return { ok: false, reason: 'wrong_password' };
  } else {
    await supabase.from('closeuses').update({ last_login_at: now, last_activity_at: now } as any).eq('id', c.id);
  }
  const session: CloseuseSession = {
    idx: c.idx,
    id: c.id,
    name: c.name,
    whatsapp: c.whatsapp,
    token: hash,
    savedAt: Date.now(),
  };
  saveSession(session);
  return { ok: true, session, firstLogin };
}
