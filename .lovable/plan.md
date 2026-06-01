## Objectif

Mettre en place un système complet pour les closeuses qui prennent des commandes par téléphone : gestion admin, espace privé par closeuse, calcul de salaire (1000 FCFA / commande livrée), intégration auto en compta et déduction de stock.

## 1. Base de données (migration Supabase)

**Nouvelle table `closeuses`** (similaire à `livreurs`)
- `id`, `idx` (auto-increment), `name`, `whatsapp` (unique, sert d'identifiant de connexion), `password_hash`, `session_token`, `active`, `emoji` (👩‍💼), `created_at`, `updated_at`, `last_login_at`

**Modification table `orders`**
- Ajouter `closeuse_idx` (integer, nullable) → identifie la closeuse qui a validé la commande
- Les commandes saisies par une closeuse sont créées avec `status = 'delivered'` directement (puisqu'elle ne saisit que les livrées) et `closeuse_idx` renseigné

**Logique salaire** : pas de table dédiée, calculé à la volée = `COUNT(orders WHERE closeuse_idx = X AND status = 'delivered' AND delivered_at dans le mois) × 1000`

**Logique compta** : pas besoin d'insérer dans `daily_expenses` automatiquement (sinon double comptage si on régénère). Plutôt : la commission closeuse est calculée dynamiquement dans le tab Compta et affichée comme ligne de dépense virtuelle "Commissions closeuses (mois)".

**Logique stock** : un trigger DB existe déjà (`handle_order_stock_change`) qui déduit le stock quand `status` passe à `delivered`. Comme les commandes closeuse sont insérées directement avec `status='delivered'`, on étend ce trigger pour aussi traiter le cas INSERT (actuellement il ne gère que UPDATE). Le nombre de pièces saisi par la closeuse alimente `offer_label` au format compatible (ex: "3 sachets") pour que le parser existant déduise la bonne quantité.

## 2. Admin — nouveaux tabs

**Tab "Closeuses"** (`src/components/admin/CloseusesTab.tsx`)
- Liste des closeuses (nom, whatsapp, active, dernière connexion, nb commandes du mois, salaire du mois)
- Ajouter / modifier / désactiver une closeuse
- Bouton "Réinitialiser mot de passe" (vide `password_hash`)

**Tab "Salaires"** (`src/components/admin/SalairesTab.tsx`)
- Pour chaque closeuse + chaque livreur : nb commandes livrées du mois en cours, salaire dû, statut payé/non payé
- Sélecteur de mois
- Le 1er du mois → bandeau "Salaires à verser"
- Pour les livreurs : on garde le même calcul (1000 FCFA / livrée) — confirmer si différent

**Tab "Compta" — mise à jour**
- Ajouter ligne automatique "Commissions closeuses" = nb commandes livrées par closeuses × 1000 sur la période
- S'assure que le CA et le bénéfice net intègrent cette charge

## 3. Espace Closeuse

**Route `/closeuse`** (publique, gère login + dashboard)
- Login par numéro WhatsApp
- Si `password_hash` est null → écran "Créer ton mot de passe" → bcrypt + save → connecté
- Sinon → écran login → vérifie hash → save `session_token` en localStorage
- Session persistante (comme livreur)

**Dashboard closeuse** (3 onglets)

a) **Nouvelle commande** — formulaire simple :
- Nom client (facultatif)
- Ville (requis)
- Produit (select : Poudre KOUKA, Sirop KOUKA, Anti-Diabète, Tonic)
- Nombre de pièces (number, défaut 1)
- Prix total (number)
- Frais de livraison (défaut 2000)
- Bouton "Valider la commande livrée" → insert dans `orders` avec `status='delivered'`, `closeuse_idx`, `delivered_at=now()`, `offer_label = "{N} {sachet|flacon|bouteille}"`

b) **Historique** — liste de ses commandes (date, client, produit, prix)

c) **Mon salaire** — total du mois en cours (nb commandes × 1000), historique mensuel, mention "Disponible le 1er de chaque mois"

## 4. Modifications utilitaires

- `src/lib/closeuse-auth.ts` (login, hash via bcryptjs déjà utilisé pour livreurs)
- `src/lib/use-closeuse-session.ts` (hook session)
- Mise à jour `src/components/admin/ComptaTab.tsx` : ligne commissions
- Trigger DB `handle_order_stock_change` étendu pour traiter INSERT avec status='delivered'

## 5. Vérification compta finale

- CA = somme `product_price` commandes delivered
- Charges = `daily_expenses` + commissions closeuses (auto) + salaires livreurs (auto)
- Bénéfice net = CA − charges
- Test : créer 1 commande closeuse de 12000 → vérifier que CA augmente de 12000, commission +1000, stock déduit, bénéfice = 11000 − autres charges

## Points à confirmer (1 question)

**Salaire des livreurs** : actuellement il n'y a pas de système de salaire pour les livreurs dans le code (ils sont rémunérés via `delivery_fee` directement). Le point 4 mentionne "Sur l'espace de chaque livreur, tu ajoutes Salaire" — est-ce que tu veux :
- (a) Que les livreurs aient aussi 1000 FCFA / commande livrée comme salaire en plus du delivery_fee ?
- (b) Ou bien c'était une faute de frappe et tu parlais de "closeuse" (donc seules les closeuses ont ce salaire) ?

Je pars sur **(b)** par défaut (closeuses seulement) sauf indication contraire — c'est cohérent avec le reste du message.
