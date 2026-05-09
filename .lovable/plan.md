## Page Livreur — App PWA dédiée

Nouvelle route `/livreur` (PWA installable) où chaque livreur se connecte avec son numéro WhatsApp + mot de passe et gère ses commandes en temps réel.

### 1. Authentification livreur
- **Connexion** : numéro WhatsApp (déjà dans table `livreurs`) + mot de passe
- **Première connexion** : si aucun mot de passe défini → écran "créer mon mot de passe"
- **Session persistante** : token stocké en `localStorage` (auto-login après 1ère connexion, validité 90 jours)
- Nouvelle colonne `password_hash` + `last_login_at` sur table `livreurs`
- Hash bcrypt côté server function (jamais en clair)

### 2. Dashboard livreur (page principale)
**En haut** :
- Salutation + emoji livreur
- Carte "Stock disponible" : Poudre KOUKA / Sirop / Anti-Diabète (lecture `stock_transactions`)
- Compteur du jour : commandes assignées / livrées / en attente

**Liste des commandes assignées** (temps réel via Supabase Realtime) :
- Filtrage automatique `livreur_idx = mon_idx` + statut ≠ delivered/cancelled (par défaut)
- Onglets : `À livrer` · `Aujourd'hui livrées` · `Historique 7j`
- Carte commande : nom client, ville/quartier, téléphone (bouton appel + WhatsApp), produit + offre, montant, créneau
- **Sync auto** : si admin retire/réassigne, la commande disparaît/apparaît instantanément

### 3. Actions sur commande
Bouton principal "Mettre à jour le statut" → modal avec 4 choix :
- **Livré** : demande montant frais livraison (pré-rempli depuis `delivery_fee` du livreur, modifiable) → enregistre, déclenche trigger stock auto
- **Expédié** : marque comme expédié (l'argent du produit revient à l'admin, pas comptabilisé pour le livreur)
- **Annulé** : motif obligatoire (court texte)
- **Reprogrammé** : choisir nouvelle date/créneau

Nouveau statut `shipped` à ajouter (si pas déjà supporté) + colonne `reschedule_date`.

### 4. Bilan du soir
Page `/livreur/bilan` :
- Livraisons du jour (nombre + pièces)
- CA encaissé (somme `product_price` des livrées hors expédiées)
- Frais de livraison (sa part à garder)
- **Reste à reverser à l'admin** = CA encaissé − frais livraison
- Bouton "J'ai versé à l'admin" → marque les commandes comme `cash_confirmed = true` (colonne déjà présente)
- Historique des bilans des 30 derniers jours

### 5. PWA + Notifications
- `manifest-livreur.webmanifest` séparé (scope `/livreur`, start_url `/livreur`, theme vert KOUKA)
- Service worker dédié `sw-livreur.js` (basé sur `sw.js` existant) :
  - Push notifications quand une nouvelle commande lui est assignée
  - Notif quand une commande est retirée
  - Son + vibration
- Bouton "Installer l'app" si non installée
- Subscription push stockée avec `livreur_idx` dans `push_subscriptions` (ajouter colonne `livreur_idx`)
- Edge function `notify-livreur` déclenchée par trigger DB sur `UPDATE orders.livreur_idx`

### 6. Fonctionnalités bonus utiles
- **Itinéraire Google Maps** : bouton "Naviguer" qui ouvre Maps avec l'adresse
- **Appel rapide** + **WhatsApp pré-rempli** ("Bonjour, je suis votre livreur KOUKA, j'arrive…")
- **Mode hors-ligne** : cache des commandes du jour (via service worker)
- **Tri par zone** : regrouper les livraisons par quartier pour optimiser tournée
- **Indicateur "nouvelle commande"** : badge rouge + son d'alerte
- **Photo de preuve de livraison** (optionnel, upload Supabase Storage)
- **Demande de réassignation** : bouton "Je ne peux pas livrer" qui notifie l'admin

---

### Détails techniques

**Migrations DB** :
- `ALTER TABLE livreurs ADD COLUMN password_hash text, last_login_at timestamptz, session_token text`
- `ALTER TABLE push_subscriptions ADD COLUMN livreur_idx int`
- `ALTER TABLE orders ADD COLUMN reschedule_date timestamptz, cancellation_reason text`
- Trigger `handle_order_stock_change` : ajouter cas `shipped` (pas de sortie stock immédiate, mais marquer pour admin)
- Realtime : `ALTER PUBLICATION supabase_realtime ADD TABLE orders`

**Routes nouvelles** :
- `src/routes/livreur.tsx` (layout + login)
- `src/routes/livreur.index.tsx` (dashboard commandes)
- `src/routes/livreur.bilan.tsx`
- `src/routes/livreur.commande.$id.tsx` (détail + actions)

**Server functions** :
- `loginLivreur`, `setPasswordLivreur`, `validateSession`
- `updateOrderStatus` (livré/expédié/annulé/reprogrammé)
- `getMyOrders`, `getMyDailyReport`, `confirmCashHandover`

**Sécurité** :
- RLS livreur : ne voit que `orders WHERE livreur_idx = session.livreur_idx`
- Session token validé dans middleware server function
- Mot de passe bcrypt + rate limiting login

**Files** :
- `public/manifest-livreur.webmanifest`, `public/sw-livreur.js`, `public/icons/livreur-*.png`
- `src/components/livreur/*` (LoginForm, OrderCard, StatusModal, StockBadge, BilanCard, InstallPWA)
- `src/lib/livreur-auth.functions.ts`, `src/lib/livreur-orders.functions.ts`

### Questions à confirmer avant implémentation
1. Pour les **commandes expédiées** (transport en gare), le livreur encaisse-t-il les frais d'expédition ou est-ce 100% admin ?
2. Le **mot de passe oublié** : reset via WhatsApp (admin réinitialise depuis l'onglet Livreurs) — OK ?
3. **Photo preuve livraison** : on l'inclut dès maintenant ou plus tard ?
4. Les commandes `shipped` doivent-elles aussi déduire le stock immédiatement ou seulement à confirmation admin ?