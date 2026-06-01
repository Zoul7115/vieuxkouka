import { useState } from 'react';
import { toast } from 'sonner';
import { loginCloseuse, type CloseuseSession } from '@/lib/closeuse-auth';

export function CloseuseLogin({ onSuccess }: { onSuccess: (s: CloseuseSession) => void }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create' && password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 4) {
      toast.error('Mot de passe trop court (4 caractères min)');
      return;
    }
    setLoading(true);
    const res = await loginCloseuse(phone, password);
    setLoading(false);
    if (!res.ok) {
      if (res.reason === 'not_found') toast.error('Numéro inconnu — contacte l\'admin');
      else toast.error('Mot de passe incorrect');
      return;
    }
    if (res.firstLogin) toast.success('Compte créé ! Bienvenue 🎉');
    else toast.success(`Bonjour ${res.session.name} 👋`);
    onSuccess(res.session);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-800 to-pink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">👩‍💼</div>
          <h1 className="text-2xl font-bold text-rose-900">Espace Closeuse KOUKA</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Connecte-toi pour saisir tes ventes' : 'Crée ton mot de passe (1ʳᵉ connexion)'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Numéro WhatsApp</label>
            <input
              type="tel" inputMode="tel" autoComplete="tel" required placeholder="22670000000"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-rose-600 focus:ring-2 focus:ring-rose-200 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} required minLength={4}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-rose-600 focus:ring-2 focus:ring-rose-200 outline-none"
            />
          </div>
          {mode === 'create' && (
            <div>
              <label className="text-sm font-medium text-gray-700">Confirme</label>
              <input
                type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-rose-600 focus:ring-2 focus:ring-rose-200 outline-none"
              />
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 mt-2 disabled:opacity-50">
            {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer & se connecter'}
          </button>
        </form>

        <button onClick={() => setMode(mode === 'login' ? 'create' : 'login')}
          className="w-full mt-3 text-sm text-rose-700 hover:underline">
          {mode === 'login' ? '🆕 Première connexion ? Créer mon mot de passe' : '← Retour à la connexion'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Mot de passe oublié ? Demande à l'admin de le réinitialiser.
        </p>
      </div>
    </div>
  );
}
