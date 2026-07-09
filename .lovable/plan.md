# Architecture multi-closeuses

Refonte additive — aucune page produit existante n'est cassée. Tout passe par de nouvelles routes et tables. Le système actuel (admin, livreur, closeuse v1, commandes directes) continue de fonctionner.

## 1. Base de données (migration unique)

**Évolutions sur `closeuses`** :
- ajout `slug` (text, unique, ex: `fatou`) — généré depuis le nom

**Nouvelle table `leads`** (cycle de vie prospect → commande)
- `id`, `closeuse_idx`, `closeuse_slug`, `product_slug`, `product_name`, `offer_label`, `product_price`
- `first_name`, `last_name`, `whatsapp`, `country`, `city`, `neighborhood`, `address_detail`
- `status` : `nouveau_lead` | `discussion` | `a_relancer` | `valide` | `expediee` | `livree` | `refusee` | `annulee` | `perdue`
- `notes`, `client_ip`, `source`, `created_at`, `updated_at`
- `validated_at` (timestamp) → quand le lead devient `valide`, on copie vers `orders`
- `order_id` (uuid nullable) → lien vers la commande générée

**Nouvelle table `lead_events`** (audit/historique)
- `id`, `lead_id`, `closeuse_idx`, `event_type` (status_change, note_added, edit, call, whatsapp), `from_status`, `to_status`, `payload jsonb`, `created_at`

**Évolutions sur `orders`** :
- `closeuse_idx` existe déjà
- ajout `closeuse_slug` (text) et `lead_id` (uuid) — pour traçabilité permanente
- ajout `assigned_at` (timestamp)

**Nouvelle table `commission_settings`** (1 ligne)
- `commission_per_validated_order` (int, défaut 1000)
- `commission_per_delivered_order` (int, défaut 0)

**Nouvelle table `commission_payouts`** (clôture mensuelle)
- `id`, `closeuse_idx`, `period_month` (date 1er du mois), `validated_count`, `delivered_count`, `amount_due`, `amount_paid`, `paid_at`, `notes`

**Nouvelle table `audit_log`** (journal global)
- `id`, `actor_type` (admin|closeuse|system), `actor_id`, `actor_name`, `entity_type` (lead|order|closeuse), `entity_id`, `action`, `payload jsonb`, `created_at`

Toutes les tables ouvertes au public anon (cohérent avec le reste du projet — l'auth est gérée côté app).

## 2. Routes publiques par closeuse

Nouvelle route catch : `src/routes/$closeuseSlug.$productSlug.tsx`
- Résout `closeuseSlug` → closeuse active (sinon 404)
- Résout `productSlug` → produit (faiblesse-sexuelle, anti-diabete, sirop-kouka, tonic-kouka)
- Rend exactement la même UI que la page produit existante, mais **toute commande créée passe par `leads`** avec `closeuse_idx` et `closeuse_slug` pré-remplis
- URLs : `/fatou/faiblesse-sexuelle`, `/aicha/anti-diabete`, etc.

Composant `ProductForm` modifié pour accepter un prop optionnel `assignedCloseuse` → quand présent, écrit dans `leads` au lieu de `orders`.

## 3. Dashboard closeuse (route `/closeuse`)

Refonte du dashboard existant :
- Onglets statuts : Nouveaux leads · Discussion · À relancer · Validées · Expédiées · Livrées · Refusées · Annulées · Perdues
- Liste filtrée `WHERE closeuse_idx = me`
- Carte lead : nom, téléphone, ville, produit, date, statut, notes
- Actions : Modifier · Appeler (tel:) · WhatsApp (wa.me) · Valider · Refuser · Ajouter note
- Lien public à partager : `vieuxkouka.lovable.app/{slug}/{produit}` (boutons copie rapide)
- **Aucune donnée financière visible** (pas de commission, pas de CA global)

Action "Valider" → passe `status=valide`, crée la `order` correspondante, log dans `lead_events` + `audit_log`.

## 4. Dashboard admin — nouveaux onglets

Ajout dans `src/routes/admin.tsx` :
1. **Commandes validées** (orders avec `closeuse_idx not null`)
2. **Commandes livrées** (filtre rapide)
3. **Commandes refusées** (leads `refusee` + orders annulées)
4. **Commandes par closeuse** (groupé)
5. **Performance closeuses** : leads, discussion, validées, expédiées, livrées, refusées, taux validation, taux livraison, dernière activité, classement. Filtres : aujourd'hui / 7j / 30j / custom
6. **Commissions** : montant configurable, total dû par closeuse, page de clôture mensuelle ("Marquer comme payé"), historique
7. **Commandes perdues / À relancer** : leads `perdue`/`a_relancer` avec actions de relance

Onglet existants conservés intacts.

## 5. Notifications & audit

- Badge "Nouvelle activité" sur dashboard closeuse (Realtime sur `leads WHERE closeuse_idx=me`)
- Badge admin sur Realtime `leads INSERT`, `orders status change`
- Page admin "Journal" filtrable (closeuse, produit, ville, téléphone, date, statut)

## 6. Détails techniques

**Pas de breaking change** :
- Routes existantes (`/`, `/anti-diabete`, `/tonic-kouka`, `/product/$slug`) → continuent à écrire dans `orders` directement (commandes directes / pub Facebook)
- Seules les routes `/:closeuse/:produit` écrivent dans `leads`
- Le système livreur, SAV, stock, compta : inchangés

**Sécurité** :
- Login closeuse custom conservé (table `closeuses` + `password_hash` SHA-256, déjà en place)
- Filtrage par `closeuse_idx` côté client (cohérent avec l'archi existante 100% RLS-open)
- Admin protégé par `requireAdminCode` existant

**Performance** :
- Index sur `leads(closeuse_idx, status, created_at)`, `leads(whatsapp)`, `orders(closeuse_idx, status)`
- Pagination 50 lignes par défaut

## 7. Fichiers créés (≈14) / modifiés (≈6)

Nouveaux :
- `supabase/migrations/...` (1 migration unique)
- `src/lib/leads.ts` (CRUD + types)
- `src/lib/commissions.ts`
- `src/lib/auditLog.ts`
- `src/routes/$closeuseSlug.$productSlug.tsx`
- `src/components/closeuse/LeadCard.tsx`
- `src/components/closeuse/LeadList.tsx`
- `src/components/closeuse/ShareLinks.tsx`
- `src/components/admin/ValidatedOrdersTab.tsx`
- `src/components/admin/DeliveredOrdersTab.tsx`
- `src/components/admin/RefusedTab.tsx`
- `src/components/admin/OrdersByCloseuseTab.tsx`
- `src/components/admin/PerformanceTab.tsx`
- `src/components/admin/CommissionsTab.tsx`
- `src/components/admin/LostLeadsTab.tsx`
- `src/components/admin/AuditLogTab.tsx`

Modifiés :
- `src/routes/closeuse.tsx` (nouveau dashboard)
- `src/routes/admin.tsx` (ajout onglets)
- `src/components/ProductForm.tsx` (mode lead vs order)
- `src/components/admin/CloseusesTab.tsx` (ajout slug + lien partage)
- `src/lib/closeuses.ts` (champ slug)
- `src/lib/products.ts` (helper `findProductBySlug`)

## 8. Livraison

Vu la taille (≈20 fichiers, 1 migration lourde), je vais livrer en **une seule passe** comme demandé, mais la migration sera soumise en premier pour validation avant le code applicatif (les types Supabase sont régénérés après approbation).

Si OK, je lance.
