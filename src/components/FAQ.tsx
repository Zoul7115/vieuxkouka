import { useState } from 'react';

const FAQ_DATA = [
  { q: "La Poudre KOUKA a-t-elle des effets secondaires ?", a: "Aucun. 100% naturelle — racines et écorces de plantes africaines, aucun produit chimique, aucune dépendance. Beaucoup de nos clients la prennent sans interruption et ne signalent rien." },
  { q: "En combien de temps je vois les résultats ?", a: "Les premières améliorations sont souvent visibles dès les 3 premiers jours. Pour un traitement complet et définitif, 1 à 2 semaines selon la sévérité du problème." },
  { q: "Combien de sachets dois-je prendre ?", a: "1 sachet suffit pour les cas récents ou légers (moins de 1 an). Pour les cas chroniques ou anciens, l'offre <strong>2 + 1 OFFERT</strong> (2 sachets achetés + 1 gratuit) est recommandée pour un traitement complet et définitif. L'offre <strong>3 + 2 OFFERTS</strong> est idéale pour traiter toute la famille." },
  { q: "Est-ce que ça traite les hémorroïdes ET les ulcères en même temps ?", a: "Oui. La poudre KOUKA agit sur l'ensemble du système digestif — estomac, intestins, côlon et vaisseaux hémorroïdaux simultanément. C'est sa force : elle traite la cause profonde." },
  { q: "La livraison est-elle discrète ?", a: "Oui. Emballage neutre, sans mention du produit. Livraison directement à ton adresse. Personne ne sait ce que tu as commandé." },
  { q: "Le paiement, ça se passe comment ?", a: "Cash à la réception uniquement. Tu vérifies ton colis, tu paies le livreur. Aucun paiement à l'avance, aucune carte bancaire nécessaire." },
  { q: "Est-ce vraiment efficace ou c'est du mensonge ?", a: "C'est la question la plus honnête. La réponse : écoute les audios de nos clients sur cette page. Lis les messages WhatsApp réels. Regarde les reçus Rakieta et TSR. Nous ne pouvons pas inventer 'le rectum ne sort plus, suis totalement guéri'. Si ça ne marche pas pour toi, tu es remboursé intégralement." },
  { q: "Et si ça ne marche pas — je suis remboursé ?", a: "Oui. Traitement complet sans résultat ? Contacte-nous sur WhatsApp avec photo du sachet vide. Remboursement intégral, immédiat, sans question posée." },
];

export function FAQ({ items = FAQ_DATA }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-2.5 mt-6">
      {items.map((item, i) => (
        <div
          key={i}
          className={`bg-white rounded-xl overflow-hidden border-2 border-vert-bg shadow-sm transition-all ${open === i ? 'border-vert-mid' : ''}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-5 py-4 font-bold text-foreground flex justify-between items-center gap-3"
          >
            <span>{item.q}</span>
            <span className={`text-vert-mid text-xl transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div
            className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="overflow-hidden">
              <p
                className="px-5 pb-4 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { FAQ_DATA };
