import { useState } from 'react';

const FAQ_DATA = [
  { q: "La Poudre KOUKA a-t-elle des effets secondaires ?", a: "Aucun. 100% naturelle — racines et écorces de plantes africaines, aucun produit chimique, aucune dépendance. Contrairement aux médicaments classiques, tu ne deviens jamais accro et tu peux arrêter quand tu veux sans rebond." },
  { q: "En combien de temps je vois les résultats ?", a: "<strong>Dès J3 :</strong> 87% de nos clients ressentent les premiers soulagements (saignements qui diminuent, brûlures qui calment). <strong>Entre J7 et J14 :</strong> guérison complète pour la grande majorité. Pour les cas très anciens (plus de 5 ans), prévois une cure complète (pack 2+1)." },
  { q: "Combien de sachets dois-je prendre ?", a: "<strong>1 sachet</strong> = pour tester ou cas léger récent. <strong>Pack 2 + 1 OFFERT</strong> = LE choix recommandé — c'est le traitement complet qui guérit définitivement (90% de nos clients prennent ce pack). <strong>Pack 3 + 2 OFFERTS</strong> = pour traiter toute la famille ou faire des cures préventives." },
  { q: "Est-ce que ça traite les hémorroïdes ET les ulcères en même temps ?", a: "Oui. C'est exactement la force de la Poudre KOUKA — elle agit sur tout le système digestif d'un coup : estomac, intestins, côlon, vaisseaux hémorroïdaux. Un seul produit pour 5 problèmes. C'est pour ça que nos clients appellent ça 'le miracle du Vieux'." },
  { q: "La livraison est-elle vraiment discrète ?", a: "100% discrète. Emballage neutre — aucune mention du produit, aucun logo. Personne (livreur, voisin, famille) ne peut deviner ce que tu as commandé. Ton intimité est notre priorité." },
  { q: "Le paiement, ça se passe comment ? Je dois payer d'avance ?", a: "<strong>Jamais d'avance.</strong> Tu paies cash UNIQUEMENT quand le livreur te remet le colis en main propre. Tu vérifies, tu paies. Pas de carte bancaire, pas de virement, pas de risque. Si tu n'es pas là, tu ne paies rien." },
  { q: "Est-ce vraiment efficace ou c'est encore du mensonge ?", a: "Question honnête. Notre réponse : <strong>écoute les 4 audios de vrais clients sur cette page</strong>. Lis les 8 messages WhatsApp non modifiés. Regarde les reçus Rakieta et TSR. On ne peut pas inventer un client qui dit 'le rectum ne sort plus, je suis totalement guéri'. Et si malgré tout ça ne marche pas pour toi → tu es remboursé à 100%. Tu n'as littéralement rien à perdre." },
  { q: "Et si ça ne marche pas — je suis vraiment remboursé ?", a: "<strong>Oui, sans débat.</strong> Tu as suivi le traitement complet et tu n'as vu aucun résultat ? Tu nous envoies une photo du sachet vide sur WhatsApp → remboursement intégral immédiat. Aucune question posée. C'est notre engagement." },
  { q: "Pourquoi attendre ? Je peux commander plus tard non ?", a: "Tu peux. Mais : (1) le stock est limité — la récolte est manuelle dans 3 pays. (2) Plus tu attends, plus tes problèmes s'aggravent et plus le traitement est long. (3) Le tarif promo actuel ne durera pas. Le bon moment pour agir, c'était il y a 6 mois. Le second meilleur moment, c'est maintenant." },
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
