## Rollback : focus 100% Burkina Faso

On retire toutes les références "Côte d'Ivoire / Abidjan" ajoutées récemment et on resserre la communication sur le marché burkinabè (Ouaga + autres villes BF). Le Bénin (déjà historique) reste mentionné comme livraison ponctuelle.

---

## Changements

### 1. `src/lib/products.ts`
- **`COUNTRIES`** : retirer `🇨🇮 Côte d'Ivoire` de la liste (le formulaire ne le proposera plus). On garde Burkina en tête, puis Bénin, Sénégal, Mali, Togo, Niger, Guinée, Autre.
- **`DELIVERY_PRICES`** : supprimer `CI_ABIDJAN` et `CI_OTHER`. On garde uniquement `BF_OUAGA`, `BF_OTHER`, `BJ`.

### 2. `src/routes/index.tsx` (page Poudre)
- Ligne ~197 : retirer `🇨🇮 Côte d'Ivoire` de la liste des 3 pays de récolte → la remplacer par `🇧🇯 Bénin` et `🇬🇭 Ghana` (ou rester sur 2 pays Burkina + Bénin si tu préfères — je propose 2 pays pour rester honnête).
- Ligne ~204 : remplacer la phrase "Déjà livré à Ouagadougou, Bobo, Abidjan, Cocody, Yopougon, Marcory, Cotonou…" par **"Déjà livré à Ouagadougou, Bobo, Koudougou, Banfora, Ouahigouya, Kaya, Tenkodogo, Fada…"**
- Ligne ~355 : titre "Livraison **Burkina · Côte d'Ivoire**" → **"Livraison partout au Burkina Faso"**.
- Ligne ~356 : sous-titre "partout en Afrique de l'Ouest" → **"Paiement cash à la livraison · partout au Burkina"**.
- Grille livraison : retirer les 2 cartes Abidjan + Côte d'Ivoire. Garder Ouagadougou, Burkina (autres), Bénin (optionnel — à confirmer), Paiement, Emballage, Garantie. Si on retire aussi le Bénin → grille en 6 cartes propre.

### 3. `src/routes/product.$slug.tsx` (page Sirop)
- Ligne ~127 : "racines et écorces récoltées au Burkina, Côte d'Ivoire et Bénin" → **"récoltées au Burkina Faso et au Bénin"**.
- Lignes ~157-181 : dans la carte "Livraison 100% discrète", retirer les 2 cellules Abidjan + Côte d'Ivoire. Garder Ouagadougou + Burkina (autres). Passer la grille de `grid-cols-2` à un layout 2 colonnes plus aéré ou ajouter une 3e cellule "💵 Cash à la livraison".

### 4. `src/components/LiveSocialProof.tsx`
- Retirer du `NAMES_FALLBACK` les 6 entrées ivoiriennes (Konan d'Abidjan, Aïcha de Cocody, Yao de Yopougon, Mariam de Marcory, Bakary de Treichville, Fanta de Bouaké).
- Ajouter à la place 4-5 villes BF supplémentaires (Houndé, Dédougou, Gaoua, Diébougou, Léo) pour garder un pool varié.
- Le commentaire "ouverture CI" est supprimé.

### 5. Vérifications finales
- `rg` confirmera qu'il ne reste **aucune** mention `Abidjan|Côte d'Ivoire|🇨🇮|CI_ABIDJAN|CI_OTHER|Cocody|Yopougon|Marcory|Treichville|Bouaké` dans `src/`.
- `ProductForm.tsx` consomme `COUNTRIES` directement → le pays disparaît automatiquement de la liste déroulante, aucune modif à faire.
- `ComptaTab` / `LivreursTab` / `OrdersTab` n'utilisent pas `DELIVERY_PRICES` (ils calculent sur `delivery_fee` réel par commande) → aucun impact.
- Les commandes existantes en base avec `country = 'CI'` resteront affichables (juste un libellé brut), aucune migration nécessaire.

---

## Question rapide

Pour la grille livraison de la page d'accueil, on garde le **Bénin** (1 500 FCFA) ou on le retire aussi pour rester 100% Burkina ? Je propose de **retirer aussi le Bénin** des bandeaux livraison (mais le laisser dans `COUNTRIES` au cas où), pour un message ultra-clair : "Burkina Faso uniquement". Dis-moi si tu préfères garder le Bénin visible.

---

## Fichiers modifiés
- `src/lib/products.ts`
- `src/routes/index.tsx`
- `src/routes/product.$slug.tsx`
- `src/components/LiveSocialProof.tsx`

Aucune migration DB. Aucun changement edge function. Notifications, livreurs, frais variables, compta : tout reste comme implémenté précédemment.