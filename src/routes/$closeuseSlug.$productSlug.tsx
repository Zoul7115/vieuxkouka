import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProduct, PRODUCTS, formatFCFA } from '@/lib/products';
import { ProductForm } from '@/components/ProductForm';
import { ReassuranceBar } from '@/components/conversion/ReassuranceBar';

export const Route = createFileRoute('/$closeuseSlug/$productSlug')({
  component: AssignedProductPage,
});

type Closeuse = { id: string; idx: number; name: string; emoji: string | null; slug: string | null; active: boolean };

function AssignedProductPage() {
  const { closeuseSlug, productSlug } = Route.useParams();
  const [closeuse, setCloseuse] = useState<Closeuse | null>(null);
  const [resolving, setResolving] = useState(true);

  const product = getProduct(productSlug);

  useEffect(() => {
    (async () => {
      setResolving(true);
      const { data } = await supabase
        .from('closeuses')
        .select('*')
        .eq('slug', closeuseSlug)
        .eq('active', true)
        .maybeSingle();
      setCloseuse((data || null) as Closeuse | null);
      setResolving(false);
    })();
  }, [closeuseSlug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-6xl mb-3">🤔</div>
          <h1 className="text-xl font-extrabold mb-2">Produit introuvable</h1>
          <p className="text-sm text-muted-foreground mb-4">"{productSlug}" n'existe pas.</p>
          <Link to="/" className="text-vert font-bold underline">Retour à la boutique</Link>
          <div className="mt-6 text-xs text-muted-foreground">Produits disponibles : {PRODUCTS.map((p) => p.slug).join(', ')}</div>
        </div>
      </div>
    );
  }

  if (resolving) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement…</div>;
  }

  if (!closeuse) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-6xl mb-3">🔗</div>
          <h1 className="text-xl font-extrabold mb-2">Lien invalide</h1>
          <p className="text-sm text-muted-foreground mb-4">Ce lien ne correspond à aucune conseillère active.</p>
          <Link to="/" className="text-vert font-bold underline">Aller sur la boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* Bandeau closeuse */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white px-4 py-3 text-center text-sm sticky top-0 z-30">
        <strong>{closeuse.emoji || '👩‍💼'} {closeuse.name}</strong> t'accompagne pour ta commande
      </div>

      {/* Hero produit */}
      <section className="container-kouka py-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-or text-vert font-extrabold px-3 py-1.5 rounded-full text-xs mb-3">
            {product.emoji} {product.shortName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-vert mb-3">{product.name}</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">{product.tagline}</p>
          <img
            src={product.heroImage}
            alt={product.name}
            className="max-w-xs mx-auto mt-5 rounded-2xl shadow-lg"
            loading="eager"
          />
        </div>

        <ReassuranceBar />

        <div className="bg-white rounded-2xl p-4 my-5 border-2 border-vert-bg text-center">
          <div className="text-xs uppercase font-bold text-muted-foreground">À partir de</div>
          <div className="text-3xl font-extrabold text-vert">
            {formatFCFA(Math.min(...product.offers.map((o) => o.price)))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Paiement à la livraison · Cash uniquement</div>
        </div>
      </section>

      <ProductForm
        product={product}
        assignedCloseuse={{ idx: closeuse.idx, slug: closeuse.slug || closeuseSlug, name: closeuse.name }}
      />

      <div className="text-center text-xs text-muted-foreground mt-6 px-4">
        Tu as une question ? Contacte directement <strong>{closeuse.name}</strong> sur WhatsApp.
      </div>
    </div>
  );
}
