import { createFileRoute, Outlet, Link, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LivreurLogin } from '@/components/livreur/LivreurLogin';
import { getStoredSession, clearSession, type LivreurSession } from '@/lib/livreur-auth';

export const Route = createFileRoute('/livreur')({
  head: () => ({
    meta: [
      { title: 'KOUKA Livreur' },
      { name: 'theme-color', content: '#059669' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'KOUKA Livreur' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest-livreur.webmanifest' },
      { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
    ],
  }),
  component: LivreurLayout,
});

function LivreurLayout() {
  const [session, setSession] = useState<LivreurSession | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSession(getStoredSession());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-emerald-50 flex items-center justify-center"><div className="text-emerald-700">Chargement…</div></div>;
  }

  if (!session) {
    return <LivreurLogin onSuccess={(s) => setSession(s)} />;
  }

  const logout = () => {
    clearSession();
    setSession(null);
    router.navigate({ to: '/livreur' });
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-emerald-700 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <div className="text-xs opacity-80">Bonjour 🛵</div>
            <div className="font-bold">{session.name}</div>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/livreur" className="px-3 py-1.5 rounded hover:bg-emerald-600 [&.active]:bg-emerald-800" activeOptions={{ exact: true }}>Commandes</Link>
            <Link to="/livreur/bilan" className="px-3 py-1.5 rounded hover:bg-emerald-600 [&.active]:bg-emerald-800">Bilan</Link>
            <button onClick={logout} className="px-2 py-1.5 rounded hover:bg-emerald-600 text-xs opacity-80">Déco</button>
          </nav>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-3 py-4 pb-20">
        <Outlet />
      </main>
    </div>
  );
}
