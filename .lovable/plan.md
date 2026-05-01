## Contexte de tes 3 demandes

Tu poses en réalité **3 sujets distincts**. Je traite chacun avec une recommandation claire.

---

## 1. Notifications admin : faut-il passer en App mobile ?

### Diagnostic
Tu as déjà tout l'arsenal Web Push installé (service worker `public/sw.js`, edge function `send-push`, clés VAPID, trigger Postgres `notify_admin_new_order` qui appelle l'edge function à chaque nouvelle commande, hook `usePWAAdmin` qui souscrit le navigateur). **Techniquement les notifications RÉELLES sont censées marcher, app fermée.**

Si tu ne reçois rien, le problème n'est presque jamais "il faut une vraie app native". Les vraies causes habituelles :
- **iOS** : Web Push ne marche QUE si l'admin est **installé via "Ajouter à l'écran d'accueil"** depuis Safari (pas Chrome iOS) + iOS 16.4+. Sinon zéro notif possible.
- **Android Chrome** : marche, mais il faut avoir cliqué "Activer notifications" dans l'admin ET autorisé dans le navigateur.
- **Edge function `send-push`** : si elle plante (clé VAPID invalide, payload mal formé, souscription expirée non nettoyée), aucune notif ne part.
- **Trigger DB** : si `extensions.http_post` échoue silencieusement (extension `http` non activée), aucun appel n'est fait.

### Recommandation : NE PAS faire d'app native maintenant
Construire une vraie app Android/iOS native = plusieurs semaines, comptes développeur (25 $ Google + 99 $/an Apple), build natif, store review. Pour 1 utilisateur (toi). **Disproportionné.**

### Plan : diagnostiquer puis fiabiliser le Push existant
1. **Lire les logs de l'edge function `send-push`** des 7 derniers jours pour voir si elle est bien appelée à chaque commande et si elle renvoie des erreurs (souscriptions expirées 410, clé VAPID mauvaise, etc.).
2. **Vérifier en DB** qu'il y a bien une ligne dans `push_subscriptions` pour ton appareil et qu'elle n'est pas obsolète.
3. **Vérifier que le trigger `notify_admin_new_order` est bien attaché à `orders`** (les db-functions montrent la fonction mais la section db-triggers dit "no triggers" — c'est probablement le problème principal).
4. **Recréer le trigger AFTER INSERT sur `orders`** s'il manque.
5. **Nettoyage automatique** : dans `send-push`, supprimer les souscriptions qui renvoient 404/410 pour éviter la pollution.
6. **Bouton "Tester le push réel"** dans l'admin qui appelle directement `send-push` avec un payload de test → tu sauras tout de suite si c'est le navigateur ou le serveur qui foire.
7. **Page de diagnostic Push** dans l'admin listant : permission notif, SW enregistré, souscription active, dernière notif reçue.

Si après ce diagnostic tu veux quand même une "vraie app", la solution la moins coûteuse sera **TWA / Bubblewrap** (encapsuler la PWA dans un APK Android), pas une app native from scratch — mais on en reparle après le fix.

---

## 2. Premier marché international : recommandation pays

Critères : **diaspora burkinabè présente, langue française, monnaie FCFA (zéro friction de change), logistique cash-on-delivery réaliste, taille du marché digital, pouvoir d'achat sur ton ticket 20 000 FCFA**.

| Pays | Avantages | Risques |
|---|---|---|
| **Côte d'Ivoire** | 28M hab, Abidjan = capitale économique CFA, énorme communauté burkinabè (1er pays de la diaspora), Facebook/WhatsApp ads très matures, livreurs cash dispo (Yango, Glovo, livreurs indépendants), pouvoir d'achat le plus élevé de la zone | Concurrence pub plus chère, marché saturé sur la santé naturelle |
| Sénégal | Bon pouvoir d'achat Dakar, FCFA, marché digital actif | Diaspora burkinabè plus faible, moins de cousinage culturel sur les pathologies "vieux KOUKA" |
| Mali | Proximité culturelle max, FCFA | Instabilité, pub Facebook plus risquée, pouvoir d'achat plus faible |
| Niger | FCFA, proche culturellement | Marché digital très petit, instabilité |

### Recommandation : **Côte d'Ivoire (Abidjan d'abord)**
Raisons : taille de marché × diaspora burkinabè × maturité ads × FCFA × livraison cash organisée. Tu peux même recruter un livreur partenaire à Abidjan (Cocody / Yopougon / Marcory) et copier ton modèle de Ouaga.

### Adaptations à faire sur les 2 pages de vente
Sans tout dupliquer, on adapte le contenu existant :
- **Bandeau livraison** (`src/routes/index.tsx` ligne ~349 + équivalent sirop) : remplacer "rapide dans tout le Burkina" par "Burkina + Côte d'Ivoire", ajouter une carte "🇨🇮 Abidjan — Livraison 24-48h · 2 000 FCFA" et "🇨🇮 Côte d'Ivoire (autres villes) · 3 000 FCFA".
- **`COUNTRIES`** dans `src/lib/products.ts` : mettre la Côte d'Ivoire en 2e position (après Burkina, avant les autres) pour la pousser dans le formulaire.
- **`FloatingWhatsApp` / formulaires** : pré-cocher Burkina mais détecter automatiquement le pays via l'IP (déjà capturée dans `VisitTracker` via ipapi) et basculer le préfixe + la livraison côté Côte d'Ivoire si le visiteur est ivoirien.
- **Témoignages / preuve sociale** : le bloc "Plantes récoltées dans 3 pays" (ligne 194) inclut déjà 🇨🇮 — on peut ajouter à côté un nouveau bloc "Déjà livré à Abidjan, Cocody, Yopougon, Marcory…" pour signaler la présence.
- **`LiveSocialProof`** : ajouter quelques villes ivoiriennes au pool de villes affichées.
- **Page de remerciement / WhatsApp** : message localisé si pays = CI ("Ton livreur à Abidjan te contacte sous 2h").
- **Frais de livraison** : ne pas hardcoder, créer une petite table `DELIVERY_PRICES` par pays/zone dans `src/lib/products.ts` que les pages de vente affichent et que le formulaire pré-remplit.
- **Aucune modification SEO destructrice** : on garde `metaTitle`/`metaDesc` orientés Burkina (c'est ton marché principal) mais on enrichit avec "Burkina · Côte d'Ivoire" dans les `og:description`.

---

## 3. Origine du Vieux KOUKA — région des Kuilsés

C'est **déjà présent** dans `src/routes/index.tsx` ligne 183 :
> "Kouka est un guérisseur traditionnel **de la région des Kuilsés**…"

Mais uniquement sur la page Poudre. À ajouter aussi :
- Sous le titre "📖 Vieux KOUKA" ligne 178 : ajouter explicitement la ligne **"📍 Région des Kuilsés — Burkina Faso"** (visible, pas seulement noyée dans la citation).
- Sur la **page Sirop** (`src/routes/product.$slug.tsx`) : ajouter le même bloc "Le Vieux KOUKA · région des Kuilsés (Burkina Faso) · +60 ans de pratique" dans la section présentation du produit (autour de la ligne 125).

---

## Plan d'exécution proposé (dans cet ordre)

1. **Présentation Vieux KOUKA — région des Kuilsés**
   - Ajouter ligne "📍 Région des Kuilsés · Burkina Faso" sur page Poudre (homepage).
   - Ajouter bloc présentation du Vieux KOUKA (avec "région des Kuilsés") sur la page Sirop, qui n'en a pas.

2. **Ouverture marché Côte d'Ivoire**
   - Ajouter table `DELIVERY_PRICES` dans `src/lib/products.ts` (Burkina/Ouaga/CI Abidjan/CI autres/Bénin).
   - Mettre `🇨🇮 Côte d'Ivoire` en 2e position dans `COUNTRIES`.
   - Carte livraison sur les 2 pages : ajouter Abidjan + CI.
   - Bloc "Déjà livré à Abidjan, Cocody, Yopougon…" sous la zone "3 pays".
   - `LiveSocialProof` : ajouter villes ivoiriennes au pool.
   - `ProductForm` : auto-sélection du pays via la géoloc IP (déjà fetchée), affichage du frais de livraison correspondant.
   - `FAQ` : ajouter 1 question "Vous livrez en Côte d'Ivoire ?".
   - Pas d'app séparée par pays — un seul site, contenu localisé selon visiteur.

3. **Diagnostic + fix notifications Push (sans app native)**
   - Vérifier en DB que le trigger `notify_admin_new_order` est bien attaché à `orders` (probablement absent → c'est LA cause). Le recréer si manquant.
   - Lire les logs récents de `send-push`.
   - Améliorer `send-push` : nettoyage des souscriptions 404/410, log clair par étape.
   - Ajouter dans l'admin un onglet "🔔 Diagnostic notifications" : permission, SW actif, souscription en DB (oui/non + endpoint tronqué), bouton "Envoyer une notif test réelle" (appelle `send-push` côté serveur, pas le `postMessage` local actuel).
   - Documenter en clair dans l'UI : "Sur iPhone, installe d'abord l'app via Safari → Partager → Sur l'écran d'accueil, sinon iOS bloque les notifs."

4. **Pas d'app native pour l'instant.** Si après ces fixes les notifs sont toujours K.O., on parlera d'un wrapper TWA Android (1 journée de boulot, APK Play Store) — pas une app native React Native / Flutter.

---

## Ce que je veux confirmer avant de coder

- **Tarifs de livraison Côte d'Ivoire** : je propose Abidjan 2 000 FCFA, autres villes CI 3 000 FCFA — tu valides ou tu veux d'autres montants ?
- **Livreur en Côte d'Ivoire** : tu en as déjà un ? Sinon le formulaire prendra la commande mais tu géreras la livraison à la main au début (j'ajouterai un statut "À assigner").
- **Notifications** : OK pour qu'on commence par le diagnostic + fix avant de parler d'app native ?