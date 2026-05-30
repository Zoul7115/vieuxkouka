
## Nouveau produit : Tonic du Vieux KOUKA

Amer naturel (herbal bitters) en bouteille — élixir traditionnel 12-en-1 qui complète la gamme KOUKA aux côtés de la Poudre, du Sirop et de l'Anti-Diabète.

**Les 12 maux mis sur l'étiquette** (extraits des étiquettes Dieudonné / Herbal Bitters fournies) :
Hémorroïdes (Kooko) · Ulcères d'estomac · Hypertension · Diabète · Fibromes/Myomes · Règles douloureuses · Hernie · Anémie · Paludisme · Fatigue chronique · Infections bactériennes · Faiblesse sexuelle & éjaculation précoce

---

## 1. Étiquette produit — Style "Tradition africaine premium"

Génération d'une image haute résolution (1200×1600, prête à imprimer en sticker bouteille) avec `imagegen` premium :

- **Palette** : vert forêt profond (#1a3c2a) + or vieilli (#c9a84c) + crème parchemin (#f5f0e0)
- **Bandeau supérieur** : "TONIC DU VIEUX KOUKA" en typo serif imposante (façon apothicaire ouest-africain)
- **Sous-titre** : "Élixir traditionnel 12-en-1 · Recette du Vieux"
- **Médaillon central** : silhouette/portrait stylisé du Vieux KOUKA (réutilisation de `src/assets/vieux-kouka-profile.jpg` comme référence) entouré de motifs Bogolan/feuilles tropicales
- **Liste des 12 maux** en 2 colonnes, typo nette, puces feuille verte
- **Bandeau bas** : "📍 Région des Kuilsés · Burkina Faso 🇧🇫 · +60 ans de tradition"
- **Sceau or** : "100% PLANTES NATURELLES · CASH À LA LIVRAISON"
- **Posologie + NB** (alcool/grossesse/conduite) dans un encadré discret

Sauvegarde : `src/assets/tonic-kouka-etiquette.jpg` + miniature hero `src/assets/tonic-kouka-bouteille.jpg`

QA : visualisation et re-génération si typo illisible ou éléments coupés.

---

## 2. Catalogue produit (`src/lib/products.ts`)

Ajout d'un 4ᵉ produit `TONIC_KOUKA` avec :

- `slug: 'tonic-kouka'`
- `name: 'Tonic du Vieux KOUKA'`, `shortName: 'Tonic KOUKA'`
- `pathology: 'Hémorroïdes · Ulcères · Diabète · Hypertension · Fibromes · Faiblesse sexuelle · +6 maux'`
- 3 offres alignées sur la grille Sirop (1 flacon / 2+1 offert / 3+2 offerts) — prix à confirmer, je propose **8 000 / 18 000 / 25 000 FCFA** (positionné légèrement sous le Sirop car polyvalent)
- Ajout au `PRODUCTS[]`, au `productFamily()`, `productBadge()` et `PRODUCT_COSTS` (PA proposé : 2 500 FCFA)

---

## 3. Nouvelle page de vente (`src/routes/tonic-kouka.tsx`)

Structure calquée sur `anti-diabete.tsx` (route plate, pas via `product.$slug`) :

1. **Bandeau urgence** + stock dynamique (`useDynamicStock('tonic-kouka', 18)`)
2. **Hero** : H1 "Un seul flacon. 12 maux soulagés." + visuel bouteille + prix offre recommandée + CTA "Je commande"
3. **Section "Reconnais-tu ces signes ?"** — checklist des 12 maux regroupés en 4 familles (digestif / circulatoire / féminin / vital)
4. **Présentation Vieux KOUKA** (réutilisation du bloc existant : photo + région des Kuilsés)
5. **Comment ça agit** — explication "amer = stimule foie + reins + circulation" en langage simple
6. **Liste détaillée des 12 maux** avec icônes (mise en avant visuelle = étiquette en grand)
7. **Posologie + précautions** (NB de l'étiquette : pas d'alcool, pas de conduite, pas de femmes enceintes)
8. **Bloc livraison BF/Niger** + paiement à la livraison (réutilisation du pattern existant)
9. **Tableau comparatif** "Tonic KOUKA vs aller voir 5 médecins différents"
10. **FAQ** (composant existant)
11. **`<ProductForm product={TONIC_KOUKA} />`** — formulaire de commande standard
12. Lien retour vers la home

Réutilise les classes Tailwind existantes (`sec`, `bloc`, `container-kouka`, `text-vert`, `text-rouge`, `bg-vert-bg`…) pour rester cohérent avec les 3 autres pages.

Head SEO : titre + meta description + og:image = étiquette tonic.

---

## 4. Mise en avant sur la home (`src/routes/index.tsx`)

Ajout d'une **4ᵉ carte produit** dans la grille des produits (à côté de Poudre / Sirop / Anti-Diabète), pointant vers `/tonic-kouka`, avec emoji 🌿 et accroche "12 maux · 1 flacon".

---

## 5. Détails techniques

- **Aucune migration BDD** : le champ `product` des commandes est texte libre, le nouveau produit s'insère automatiquement via `ProductForm`
- **Admin & livreur** : `productFamily()` et `productBadge()` étendus → la nouvelle famille apparaît automatiquement dans les onglets Commandes, Bilan, Compta, Stock, et chez le livreur
- **Stock** : `useDynamicStock('tonic-kouka', 18)` — pas de setup BDD requis (hook autonome)
- **Pas de modification** de `routeTree.gen.ts` (auto-généré par Vite plugin)

---

## Livrables finaux

1. `src/assets/tonic-kouka-etiquette.jpg` — étiquette imprimable haute résolution
2. `src/assets/tonic-kouka-bouteille.jpg` — visuel hero
3. Nouvelle page de vente live sur `/tonic-kouka`
4. Carte produit sur la home
5. Apparition automatique dans admin + livreur

**À confirmer avant build** : les prix (8 000 / 18 000 / 25 000 FCFA proposés) — dis-moi si tu veux autre chose.
