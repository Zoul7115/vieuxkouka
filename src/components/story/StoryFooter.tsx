import { Link } from '@tanstack/react-router';

export function StoryFooter() {
  return (
    <footer className="bg-foreground text-white">
      <div className="container-story py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-extrabold text-lg mb-2">🌿 KOUKA Thérapies</div>
          <p className="text-white/70 leading-relaxed">
            Savoir ancestral du Burkina Faso · Traitements naturels efficaces et discrets, livrés partout en Afrique de l'Ouest.
          </p>
        </div>

        <div>
          <div className="font-extrabold uppercase tracking-wider text-xs mb-3 text-white/60">Boutique</div>
          <ul className="space-y-2 text-white/85">
            <li><Link to="/" className="hover:text-white">Poudre KOUKA</Link></li>
            <li><Link to="/product/$slug" params={{ slug: 'sirop-kouka' }} className="hover:text-white">Sirop KOUKA</Link></li>
            <li><Link to="/diagnostic" className="hover:text-white">Diagnostic gratuit</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-extrabold uppercase tracking-wider text-xs mb-3 text-white/60">Aide & Support</div>
          <ul className="space-y-2 text-white/85">
            <li><a href="https://wa.me/22658444818" className="hover:text-white">WhatsApp +226 58 44 48 18</a></li>
            <li><a href="#story-faq" className="hover:text-white">FAQ</a></li>
            <li><a href="#story-reviews" className="hover:text-white">Avis clients</a></li>
          </ul>
        </div>

        <div>
          <div className="font-extrabold uppercase tracking-wider text-xs mb-3 text-white/60">Garanties</div>
          <ul className="space-y-2 text-white/85">
            <li>💵 Paiement à la livraison</li>
            <li>🛡️ Remboursé si insatisfait</li>
            <li>🤐 Colis 100% discret</li>
            <li>🚚 Livraison 24-48h Ouaga</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-story py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <span>© {new Date().getFullYear()} KOUKA Thérapies — Tous droits réservés.</span>
          <div className="flex gap-3">
            <Link to="/admin" className="hover:text-white">Espace admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
