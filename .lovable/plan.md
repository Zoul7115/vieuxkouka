# Plan — Synchronisation globale du CRM KOUKA

Objectif : ajouter une **couche de synchronisation** sans casser l'existant. Le **lead = source de vérité**. Tout est propagé en temps réel via triggers DB + Supabase Realtime.

---

## 1. Synchronisation Lead → Commande (DB triggers)

Aujourd'hui : `updateLeadStatus` crée la commande quand `valide`, mais si la closeuse rebascule le lead en `discussion` / `refusee` / `annulee` / `perdue`, la commande reste `confirmed`.

**Migration** : créer `sync_order_from_lead()` (trigger AFTER UPDATE OF status ON leads) qui mappe :

| Lead status        | Order status      |
|--------------------|-------------------|
| nouveau_lead       | pending           |
| discussion         | pending           |
| a_relancer         | pending           |
| valide             | confirmed         |
| expediee           | expediee          |
| livree             | delivered         |
| refusee            | cancelled         |
| annulee            | cancelled         |
| perdue             | cancelled         |

- Met à jour `orders.status` via `lead_id`.
- Si statut "annulé" → déverrouille (`locked=false`) pour permettre une éventuelle re-validation ultérieure.
- Si re-validation après annulation → relock + recrée `delivered_at` au besoin.
- Reporte `refusal_reason` / `refusal_comment` sur la commande.

## 2. Stock automatique (déjà partiellement OK)

Le trigger `handle_order_stock_change` gère déjà `delivered`. Étendre :

- **Confirmation** (`status = 'confirmed'`) → réserver le stock (sortie "Réservation · {order_number}").
- **Retour à pending/cancelled** → ré-entrée automatique idempotente (par `motif` unique).
- **Livraison** : conserver la logique existante mais éviter double déduction si déjà réservée → convertir la "Réservation" en "Livraison" (UPDATE motif au lieu d'INSERT).

Garde-fou : index unique sur `stock_transactions(motif, type)` pour empêcher tout doublon.

## 3. Comptabilité unifiée

Les vues admin (Bilan, Compta, Stats, Commissions) lisent `orders`. En propageant **toutes** les commandes closeuses dans `orders` avec les bons statuts (étape 1), la compta devient automatiquement cohérente. Vérifier que `BilanTab` / `ComptaTab` / `CommissionsTab` ne filtrent pas les commandes par `closeuse_idx IS NULL` — sinon enlever ce filtre.

## 4. Realtime dashboard closeuse

`useLeads` est déjà abonné aux `leads`. Ajouter :
- Abonnement aux `orders` filtré par `closeuse_idx` dans le dashboard (pour refléter changements admin → closeuse).
- Abonnement aux `lead_relances` pour rafraîchir RelancesView automatiquement.
- Toast discret à chaque nouveau lead entrant.

## 5. Statuts unifiés admin/closeuse + carte commande complète

Côté closeuse, enrichir `LeadCard` (ou nouvelle `OrderCard` partagée) pour afficher quand le lead a une commande liée :
- Référence (`order_number`), produit, offre, client, tél, ville, pays, date, montant, **statut commande** (badge même couleur que admin).
- Historique : lire `lead_events` (déjà existant) → afficher les 5 derniers changements.
- "Dernière activité" = `updated_at`.

Réutiliser les couleurs/badges existants (`LEAD_STATUS_META`).

## 6. Historique global (audit)

`lead_events` existe déjà. Ajouter dans le trigger `sync_order_from_lead` un INSERT dans `lead_events` (event_type=`order_synced`, payload=`{old_order_status, new_order_status}`).
Afficher cet historique dans la carte (étape 5).

## 7. Garde-fous

- Trigger idempotent : check si le statut cible est déjà le bon avant UPDATE.
- Unique partial index sur `orders(lead_id)` (un seul ordre par lead).
- Unique sur `stock_transactions(motif)` pour bloquer double écriture.
- Le trigger existant `lock_order_on_validation` reste, mais on autorise unlock automatique sur statut `cancelled` (étape 1).

---

## Détails techniques (résumé)

- **1 migration SQL** : nouveau trigger `sync_order_from_lead`, extension de `handle_order_stock_change`, index uniques.
- **Frontend** :
  - `src/lib/leads.ts` : simplifier `updateLeadStatus` (la création de commande sur `valide` reste, mais la mise à jour de statut est désormais gérée par trigger ; on garde le code TS comme fallback safety).
  - `src/routes/closeuse.tsx` : ajout abonnement realtime `orders` + `lead_relances`.
  - `src/components/closeuse/LeadCard.tsx` : afficher infos commande liée + historique `lead_events`.
- Pas de changement au dashboard admin (lit déjà `orders`, auto-sync).

Aucun module existant n'est supprimé ni renommé.