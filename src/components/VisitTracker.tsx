import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function VisitTracker({ page }: { page: string }) {
  useEffect(() => {
    const sk = `kouka_visit_${new Date().toISOString().slice(0, 10)}_${page}`;
    if (sessionStorage.getItem(sk)) return;
    sessionStorage.setItem(sk, '1');

    const getSource = () => {
      const ref = document.referrer || '';
      const utm = new URLSearchParams(window.location.search).get('utm_source') || '';
      if (utm) return utm;
      if (ref.includes('facebook') || ref.includes('fb.com')) return 'Facebook';
      if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'WhatsApp';
      if (ref.includes('google')) return 'Google';
      if (ref.includes('tiktok')) return 'TikTok';
      if (ref.includes('instagram')) return 'Instagram';
      if (ref.includes('youtube')) return 'YouTube';
      if (ref) return 'Autre';
      return 'Direct';
    };

    const save = async (country?: string, city?: string) => {
      try {
        await supabase.from('visits').insert({
          page,
          source: getSource(),
          referrer: document.referrer || null,
          country: country || 'Inconnu',
          city: city || null,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        });
      } catch {
        /* silent */
      }
    };

    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => save(d.country_name, d.city))
      .catch(() => save());
  }, [page]);

  return null;
}
