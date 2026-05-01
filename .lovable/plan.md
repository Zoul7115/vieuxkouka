
# Plan d'optimisation conversion — Pages KOUKA & Sirop KOUKA

Objectif chiffré : passer de **2.92% → 4.5%** de conversion ET de **57% → 75%** de taux de livraison réelle.
Levier principal identifié : le no-show livraison coûte plus cher que la conversion brute. On attaque les deux en parallèle.

---

## VAGUE 1 — Quick wins conversion (impact fort, effort faible)

### 1.1 Hero "above-the-fold" plus efficace
- Ajouter un **bandeau prix d'ancrage** visible immédiatement : "À partir de 10 000 FCFA · Garanti remboursé"
- Remplacer le texte "+200 clients" par un **mini-compteur live** : "🟢 X visiteurs en ce moment · Y commandes aujourd'hui" (data réelle depuis `visits` + `orders` du jour)
- Ajouter une **note moyenne visuelle** : ⭐ 4.8/5 · 187 avis (au lieu d'un texte plat)
- Repositionner l'image produit à droite du H1 sur desktop, et avec un **badge flottant "RUPTURE PROCHE"** sur mobile
- Ajouter une **vignette vidéo/audio courte (15s) du Vieux KOUKA** qui parle directement au visiteur (à enregistrer côté business — fallback : audio existant + portrait)

### 1.2 Renforcer la preuve sociale dynamique
- LiveSocialProof : déduplication des entrées fallback vues dans la session (localStorage)
- Ajouter une **bandelette "Aujourd'hui"** sous le hero : "📦 X commandes livrées cette semaine à Ouaga, Bobo, Koudougou…" (calculé depuis `orders` status='delivered' des 7 derniers jours)
- Ajouter un **compteur CA cumulé** en footer ("Plus de Y FCFA de produits livrés depuis 2024")

### 1.3 Cross-sell Poudre ↔ Sirop
- Sur la page Poudre KOUKA, ajouter une **section "Souvent commandé ensemble"** avant le formulaire avec une offre combo : Poudre 2+1 + Sirop 1 = remise -3 000 FCFA
- Symétrique sur la page Sirop
- Logique : injection du combo comme nouvelle Offer dans `OfferSelector` ou comme bump alternatif

---

## VAGUE 2 — Réduire le no-show livraison (impact MAXIMAL sur CA)

### 2.1 Renforcer la qualification dans le formulaire
- Ajouter 2 nouveaux champs obligatoires :
  - **Adresse précise** (rue, repère visuel) — pas juste "ville/quartier"
  - **Créneau de livraison préféré** : matin / midi / après-midi / soir
- Ajouter une **2e case de confirmation explicite** : "Je confirme que j'ai les [X] FCFA prêts en cash le jour de la livraison" (psychologie du commitment)
- Optionnel : champ "Si je ne réponds pas, contacter ce 2e numéro" — capture un secondary contact

### 2.2 Confirmation WhatsApp automatique post-commande
- Après insertion `orders`, ouvrir automatiquement WhatsApp avec un message pré-rempli envoyé par le client lui-même au numéro admin :
  "Bonjour, je viens de commander [produit] · Commande [numéro] · Je confirme ma disponibilité"
- Effet : le client s'engage explicitement + l'admin reçoit un signal "client réel"
- Implémentation : sur la page `/thank-you`, gros bouton WhatsApp pré-rempli en CTA principal, plus juste un récap

### 2.3 Détection des commandes "à risque" (scoring renforcé)
- Le champ `ai_score` existe déjà (default 80). On peut le calculer côté frontend :
  - Numéro WhatsApp avec préfixe valide BF : +5
  - Adresse précise renseignée (>15 caractères) : +5
  - Créneau choisi : +5
  - Nom complet (prénom + nom) : +5
  - Hors heures suspectes (2h-5h du matin) : +5
  - Source = "Direct" sans referrer : -10
- Affichage dans `OrdersTab` admin : badge couleur (vert >85, jaune 70-85, rouge <70) → priorisation des appels de confirmation

### 2.4 Système de relance automatique J+1
- Si une commande reste en `pending` >24h sans contact réussi : trigger Postgres qui marque `status='to_recall'` + envoie une notif push admin
- Optionnel : edge function `send-whatsapp-template` pour rappel client automatique si l'admin a Cloud API WhatsApp

---

## VAGUE 3 — Réduire l'abandon et capturer les hésitants

### 3.1 Lead magnet pour les non-acheteurs
- Sur ExitIntentPopup actuel, remplacer le simple "reste un peu" par une **vraie offre de valeur** :
  - "📥 Télécharge le guide gratuit du Vieux KOUKA : 7 erreurs qui aggravent les hémorroïdes"
  - Capture juste le WhatsApp → ajout dans une table `leads` pour relance manuelle
- Convertit ~5-8% des sortants en leads chauds réutilisables

### 3.2 Sticky bar de confiance (mobile)
- Sous le StickyMobileCTA, ajouter une mini-barre rotative : "🔒 Paiement à la livraison · 🛡️ Remboursé · 📦 Discret · ⭐ 4.8/5"
- Renforce la confiance sans prendre de place

### 3.3 Améliorations FAQ
- Ajouter 2 questions critiques :
  - "Combien de temps avant la livraison à [ville détectée] ?" — réponse dynamique selon ville déclarée
  - "Que se passe-t-il si je ne suis pas là à la livraison ?" — répond à la peur n°1 du client BF
- Ajouter un **bouton "Pose ta question au Vieux KOUKA"** WhatsApp en fin de FAQ (déjà présent en floating, mais redondance utile)

### 3.4 Urgence VRAIE (pas factice)
- Le `UrgencyTimer` actuel = compte à rebours fixe → le visiteur récurrent voit que c'est faux
- Remplacer par un **stock dynamique vraiment basé sur les commandes** (déjà présent via `useDynamicStock`) + une **liste live des 3 dernières commandes du jour avec ville réelle** (data depuis orders)

---

## Détails techniques

### Nouvelles tables / colonnes
- `orders` : ajouter colonnes `address_detail TEXT`, `delivery_slot TEXT`, `secondary_contact TEXT`
- Nouvelle table `leads` : `id, whatsapp, source_page, created_at, contacted BOOLEAN`

### Nouveaux composants
- `LiveStatsBar.tsx` : mini-compteur visiteurs/commandes du jour
- `ComboOffer.tsx` : sélecteur combo Poudre+Sirop
- `LeadMagnetPopup.tsx` : remplace ExitIntentPopup actuel
- `RecentDeliveriesBar.tsx` : "5 commandes livrées aujourd'hui à Ouaga, Bobo…"

### Edge functions
- Aucune nouvelle nécessaire pour la Vague 1 et 2
- Optionnel Vague 2.4 : `send-whatsapp-template` (nécessite Meta Cloud API + token)

### Tracking à ajouter
- Event Facebook Pixel `Lead` déjà OK
- Ajouter event `ConfirmedAvailability` au moment où le client clique sur le bouton WhatsApp post-commande
- Passer ces events dans l'optimisation des campagnes Meta → algorithme apprend à cibler les "vrais payeurs"

---

## Ordre d'exécution recommandé

1. **Vague 2** d'abord (no-show = ton plus gros leak de CA)
2. **Vague 1** ensuite (booste le top of funnel une fois le bottom étanche)
3. **Vague 3** pour scaler

Chaque vague ≈ 1 message d'implémentation. Tu peux aussi ne valider qu'une vague à la fois pour mesurer l'impact.

---

## Question pour toi avant d'implémenter
Tu veux qu'on commence par **quelle vague** ?
- **A** — Vague 2 (réduire no-show, +30% de CA potentiel à trafic constant) — recommandé
- **B** — Vague 1 (quick wins conversion visibles immédiatement)
- **C** — Les 3 vagues d'un coup (gros chantier, mais full refonte CRO)
- **D** — Sélection custom (dis-moi quels points précis)
