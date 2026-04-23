import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/diagnostic')({
  head: () => ({ meta: [{ title: 'Consultation gratuite — KOUKA Thérapies' }] }),
  component: () => (
    <div className="min-h-screen bg-gradient-to-b from-vert-bg to-background py-12">
      <div className="container-kouka text-center">
        <span className="inline-block bg-vert-mid text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
          ✓ Consultation gratuite
        </span>
        <h1 className="text-vert mb-3">🌿 KOUKA Thérapies</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Le chatbot diagnostic IA arrive bientôt. En attendant, choisis ton produit en accueil ou
          contacte-nous sur WhatsApp.
        </p>
        <Link
          to="/"
          className="inline-block bg-vert-mid text-white px-8 py-4 rounded-xl font-extrabold shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          Voir les produits →
        </Link>
      </div>
    </div>
  ),
});
