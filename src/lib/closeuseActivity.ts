import { supabase } from '@/integrations/supabase/client';

export async function touchCloseuseActivity(closeuseIdx: number | null | undefined) {
  if (closeuseIdx == null) return;
  try {
    await (supabase as any).from('closeuses').update({ last_activity_at: new Date().toISOString() }).eq('idx', closeuseIdx);
  } catch {}
}

export function formatLastActivity(iso: string | null | undefined): string {
  if (!iso) return 'Jamais';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Aujourd'hui ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  return d.toLocaleDateString('fr-FR');
}
