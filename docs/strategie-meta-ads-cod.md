# Stratégie Meta Ads — e-commerce COD en Afrique francophone

> Document de travail. Version du 7 octobre 2026.
> Légende utilisée partout :
> **[FAIT]** = vérifié dans la documentation Meta ou dans le code de ce dépôt ·
> **[PRATIQUE]** = bonne pratique de terrain, non garantie ·
> **[HYPOTHÈSE]** = chiffre provisoire à remplacer par tes données réelles.
>
> Taux de change de travail **[HYPOTHÈSE]** : **1 $ ≈ 600 FCFA**. Le FCFA est arrimé à l'euro, mais
> le taux dollar/FCFA varie. Utilise le taux réellement débité par ta banque ou ta carte, qui inclut
> les frais de change.

---

## 0. Trois points bloquants trouvés dans le code du site (à lire en premier)

J'ai lu le code de ce dépôt avant d'écrire la stratégie. Trois constats changent le plan.

1. **Le formulaire de commande n'accepte que le Burkina Faso et le Niger.** [FAIT]
   `src/lib/products.ts` → `COUNTRIES` ne contient que `BF (+226)` et `NE (+227)`, et
   `COUNTRY_DELIVERY` ne configure la livraison que pour Ouagadougou/BF et Niamey/NE.
   Un client du Mali, du Bénin ou de Côte d'Ivoire ne peut pas choisir son pays ni son indicatif.
   **Faire de la publicité dans ces trois pays aujourd'hui revient à payer pour des visites qui ne
   peuvent pas commander, ou qui laissent des commandes non livrables.** La structure ci-dessous
   démarre donc sur BF + NE. Les trois autres pays entrent par un test géographique séparé
   (section 10), une fois le formulaire, la livraison et la confirmation prêts dans chaque pays.

2. **Le produit à 12 500 FCFA dans le code est la « Poudre Anti-Diabète du Vieux KOUKA »** (offre
   découverte, 1 sachet). [FAIT] Tu as précisé que la stratégie concerne un produit dont la sécurité et
   la conformité sont vérifiées, sans allégation médicale. Si c'est bien ce produit, sois clair sur
   un point : un nom, une page ou des publicités qui présentent un produit comme « anti-diabète »
   sont une allégation de traitement d'une maladie.
   - Les règles publicitaires de Meta interdisent les affirmations trompeuses sur la santé. Elles
     interdisent aussi de cibler ou d'interpeller une personne sur son état de santé (« Vous êtes
     diabétique ? »). Une publicité refusée peut aller jusqu'à la restriction du compte publicitaire.
   - Le vrai risque n'est pas publicitaire : un diabétique peut arrêter son traitement.
   Aucune recommandation créative de ce document ne repose sur une promesse de guérison ou de
   résultat médical. La même remarque vaut pour les promesses chiffrées du « Sirop KOUKA »
   (« Tiens 30 minutes », « dès la 2ᵉ nuit »). Si le produit visé est l'un de ceux-là, le nom, la
   page de vente et les angles doivent être revus **avant** d'investir dans le scaling. Sinon, tout
   ce qui suit s'applique tel quel.

3. **Le suivi des conversions a des défauts qui faussent les données** (détail en section 11) :
   - pas d'événement `ViewContent` ;
   - `Lead` envoyé deux fois avec deux sens différents (à la commande, puis à la confirmation WhatsApp) ;
   - le pays envoyé à l'API Conversions est un nom (« Burkina Faso ») au lieu du code ISO (`bf`) ;
   - le pays vaut `bf` par défaut sur la page de remerciement, même pour un client nigérien.

   Ce sont des corrections de code rapides. Je ne les ai pas faites pour ne pas modifier tes
   campagnes en cours sans ton accord.

**Bonne nouvelle :** la base `orders` enregistre déjà les statuts `pending`, `confirmed`, `shipped`,
`delivered`, `cancelled` et `refused`, ainsi que `utm_campaign`, `utm_adset`, `utm_ad` et
`utm_content`. [FAIT] Tu peux donc mesurer le **taux de livraison par publicité**, ce que la
plupart des vendeurs COD ne peuvent pas faire. C'est l'avantage principal de ton dispositif, et
toute la méthode ci-dessous s'appuie dessus.

---

## 1. Diagnostic de ta situation

| Élément | Ce que ça implique |
|---|---|
| Prix 12 500 FCFA (~21 $) | Panier faible. La marge absolue par commande est petite, donc chaque commande refusée pèse lourd. |
| Paiement à la livraison | Meta voit une « commande » (Purchase), pas une vente encaissée. Écart typique **[HYPOTHÈSE]** : 40 à 60 % des commandes enregistrées ne sont jamais encaissées. |
| 50 $/jour | Assez pour **une** campagne consolidée qui sort d'apprentissage, plus un petit budget de test. Pas assez pour 5 pays × plusieurs audiences. |
| Dizaines de créatives | Ton avantage : tu peux tester des **concepts**, pas seulement des variantes. Le risque, c'est de tout lancer d'un coup et de diluer le budget. |
| Livraison réelle : BF et NE seulement | La géographie de départ est imposée par la logistique, pas par Meta. |
| Statuts et UTM en base | Tu peux piloter au **coût par commande livrée par publicité**. |

**Conclusion du diagnostic :** ton problème principal n'est pas la structure Meta. C'est l'écart
entre les commandes enregistrées et les commandes livrées. La structure doit donc rester **simple**,
pour concentrer les données, et tes décisions doivent se prendre **dans ta base de commandes**, pas
dans Ads Manager.

---

## 2. Comparaison des architectures

Repère utile : Meta indique qu'un ensemble de publicités sort de la phase d'apprentissage après
**environ 50 événements d'optimisation en 7 jours**. [FAIT, documentation Meta] C'est un repère
d'optimisation, pas une preuve statistique.

Calcul d'ordre de grandeur **[HYPOTHÈSE]** : à un coût de 1 500 à 3 000 FCFA par commande
enregistrée, 30 000 FCFA/jour donnent 10 à 20 commandes/jour, soit 70 à 140 par semaine.
**Le budget total permet donc d'alimenter correctement 1 à 2 ensembles, pas 5.**

| # | Architecture | Avantages | Inconvénients | Données nécessaires | Fragmentation | Pertinente quand | Adéquation à 50 $ + COD |
|---|---|---|---|---|---|---|---|
| 1 | **Une campagne unique, 5 pays** | Données concentrées, apprentissage rapide | Meta envoie le budget vers le pays où les commandes sont les **moins chères**, souvent celui qui livre le moins bien. On ne voit pas la livraison par pays. Aujourd'hui, 3 pays sur 5 ne peuvent pas commander. | ~50 achats/sem. | Nulle | Les pays ont des taux de livraison et des coûts logistiques comparables et mesurés | ❌ Aujourd'hui · ✅ plus tard, pour les pays « jumeaux » |
| 2 | **Test créatif + scaling** | Sépare l'exploration de l'exploitation, protège les gagnantes | Deux apprentissages en parallèle, et les gagnantes doivent être transférées | ~50/sem. sur le scaling, quelques dizaines par concept en test | Faible | Beaucoup de créatives à trier, ce qui est ton cas | ✅ Très bonne |
| 3 | **Une campagne par pays** | Lecture claire par pays, budget contrôlé | 5 apprentissages à 6–10 $ chacun : aucun ne sort d'apprentissage. Coût par commande gonflé. | ~50/sem. **par pays** | **Très forte** | Budget ≥ 150–250 $/jour et pays logistiquement très différents | ❌ |
| 4 | **ABO pour tester, CBO / Advantage+ pour développer** | Chaque concept testé reçoit un budget minimum garanti. Le CBO alloue bien sur le scaling. | Plus de gestion manuelle | Comme #2 | Contrôlée | Concepts à comparer équitablement | ✅ C'est la version précise du #2 |
| 5 | **Hybride : tests créatifs + tests géographiques** | Permet d'ouvrir un pays sans polluer la campagne principale | Trois campagnes, donc un risque de dispersion à 50 $ | Comme #2, plus un budget pays | Moyenne | Un nouveau pays est **opérationnel** (formulaire + livreurs + confirmation) | ⚠️ Plus tard (palier 100 $+) |

---

## 3. Architecture recommandée : **#4, ABO test + CBO scaling, sur BF + NE, avec un module géo (#5) activé seulement plus tard**

Justification :

- **Concentration des données :** une seule campagne « principale » reçoit 70 % du budget. Avec
  BF + NE regroupés, elle a des chances réalistes d'atteindre ~50 achats/semaine.
- **Test équitable :** en ABO, chaque concept reçoit son budget. Sans cela, en CBO, Meta coupe un
  concept après quelques centaines d'impressions, avant qu'on sache s'il livre bien.
- **Pas de campagne par pays au départ :** BF et NE sont tous deux opérationnels et ont des frais
  similaires (capitale gratuite, autres villes par car). On les regroupe, puis on **sépare
  seulement si les chiffres de livraison le justifient** (règle en section 10).
- **Advantage+ :** la campagne principale utilise la configuration Advantage+ d'une campagne
  Ventes (budget au niveau campagne, audience Advantage+, placements Advantage+). [FAIT] Meta active
  ces options par défaut dans les campagnes Ventes, et l'emplacement géographique reste une
  contrainte stricte. Avec un historique faible, une configuration manuelle large donne des
  résultats proches. [PRATIQUE] Ne te bats pas contre les réglages par défaut. Contrôle seulement la
  géographie et l'âge minimum.
- **Événement optimisé : `Purchase`** (= commande enregistrée sur le site). C'est le seul événement
  bas de tunnel assez fréquent pour l'apprentissage. La qualité, c'est-à-dire la livraison, se pilote
  **en dehors de Meta** via les UTM, puis plus tard par un signal de qualité envoyé à Meta (section 11).

---

## 4. Arborescence exacte (phase de lancement à 50 $/jour)

### Paramètres d'URL à mettre sur **toutes** les publicités

Champ « Paramètres d'URL » de chaque publicité, adapté aux clés que ton site enregistre déjà
(`src/lib/utm.ts`) :

```
utm_source=facebook&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&utm_content={{placement}}
```

`{{placement}}` dans `utm_content` te donne le placement (Feed, Reels, Audience Network…) de chaque
commande. Tu pourras ainsi couper un placement qui génère des commandes **non livrées**.

### Convention de nommage

`PAYS_OBJECTIF_TYPE_DATE` pour les campagnes, `CONCEPT_FORMAT_VERSION` pour les publicités
(ex. `TEMOIN-ADAMA_VID_v1`). Le nom de la publicité arrive dans `utm_ad` : il doit être lisible dans ta
base de commandes.

```
CAMPAGNE 1 — BFNE_VENTES_SCALE_CBO_2610
 Objectif : Ventes · Configuration Advantage+ (budget campagne / CBO)
 Budget : 35 $/j ≈ 21 000 FCFA/j · Stratégie d'enchère : volume maximal (sans plafond)
 Événement : Purchase (site web, pixel 2277004996431360)
 Attribution : défaut Meta (clic 7 jours + engagement/vue 1 jour)
 │
 └─ ENSEMBLE 1.1 — BFNE_BROAD_ADV+
      Pays : Burkina Faso + Niger (« personnes qui vivent » dans le lieu si l'option est proposée)
      Optionnel : si tu ne livres pas partout, limite aux villes livrables + rayon
      Âge minimum : 18 ans (plus si le produit l'exige légalement) · Sexe : tous · Langue : aucune
      Audience : Advantage+ (pas d'intérêts imposés, suggestions facultatives)
      Exclusion : acheteurs des 30 derniers jours (audience personnalisée Purchase), si l'audience
                  est assez grande
      Placements : Advantage+ (voir règle Audience Network en section 7)
      Publicités (5–6 maximum, 1 par concept) :
        → PUB 1  Concept A — Démonstration produit (vidéo 9:16)
        → PUB 2  Concept B — Témoignage client réel (vidéo)
        → PUB 3  Concept C — Problème quotidien → solution (vidéo ou carrousel)
        → PUB 4  Concept D — Offre / garantie / paiement à la livraison (image)
        → PUB 5  Concept E — Fondateur / « Vieux KOUKA » / origine des ingrédients (vidéo)
        → PUB 6  (facultatif) Concept F — Avis groupés / preuve sociale (image ou carrousel)

CAMPAGNE 2 — BFNE_VENTES_TEST_ABO_2610
 Objectif : Ventes · Budget au niveau de l'ensemble (ABO) · Advantage+ campaign budget DÉSACTIVÉ
 Budget total : 15 $/j ≈ 9 000 FCFA/j
 Événement : Purchase · Mêmes pays, âge, exclusions et placements que 1.1
 │
 ├─ ENSEMBLE 2.1 — TEST_[CONCEPT-G]   7,50 $/j ≈ 4 500 FCFA/j
 │     → PUB 1  Concept G, accroche 1 (3 premières secondes différentes)
 │     → PUB 2  Concept G, accroche 2
 │     → PUB 3  Concept G, format image (même message)
 │
 └─ ENSEMBLE 2.2 — TEST_[CONCEPT-H]   7,50 $/j ≈ 4 500 FCFA/j
       → PUB 1  Concept H, accroche 1
       → PUB 2  Concept H, accroche 2
       → PUB 3  Concept H, format image
```

**Conditions de lancement** (toutes obligatoires) :

1. Les corrections de suivi de la section 11 sont faites, ou au minimum un test d'achat a été
   vérifié dans le Gestionnaire d'événements.
2. Les paramètres d'URL ci-dessus sont présents sur chaque publicité, et une commande de test a
   bien rempli `utm_ad` en base.
3. L'équipe de confirmation peut traiter **≥ 25 commandes/jour** dans un délai de 2 heures.
4. Le stock couvre au moins 3 semaines au rythme visé.
5. Les publicités et la page de vente ne contiennent **aucune allégation médicale** (cf. section 0).
6. Une audience personnalisée « Purchase 30 j » existe, pour l'exclusion.

**Pourquoi 1 seul ensemble en scaling ?** Deux ensembles BF / NE à 17 $ chacun doubleraient le
temps d'apprentissage. Tu obtiens déjà la répartition par pays de deux façons : la ventilation
« Pays » d'Ads Manager pour le coût, et ta base de commandes pour la livraison.

---

## 5. Budgets quotidiens (en $ et en FCFA, 1 $ ≈ 600 FCFA **[HYPOTHÈSE]**)

| Palier | Total/j | Scaling (C1) | Test créa (C2) | Test géo (C3) | Total/j FCFA | ≈ /mois FCFA |
|---|---|---|---|---|---|---|
| Lancement | 50 $ | 35 $ (21 000) | 15 $ (9 000) | — | 30 000 | 900 000 |
| Palier 1 | 75 $ | 55 $ (33 000) | 20 $ (12 000) | — | 45 000 | 1 350 000 |
| Palier 2 | 100 $ | 70 $ (42 000) | 20 $ (12 000) | 10 $ (6 000) | 60 000 | 1 800 000 |
| Palier 3 | 150 $ | 105 $ (63 000) | 25 $ (15 000) | 20 $ (12 000) | 90 000 | 2 700 000 |
| Palier 4 | 200 $ + | ~70 % | ~15 % | ~15 % ou campagne pays dédiée | 120 000 + | 3 600 000 + |

---

## 6. Plan de test des créatives

### 6.1 Classer ta bibliothèque (une seule fois, dans un tableur)

Pour chaque fichier, note : **Angle**, **Format** (vidéo 9:16, 4:5, image, carrousel), **Accroche**
(les 3 premières secondes ou le titre), **Personne à l'écran**, **Preuve** (démo, témoignage,
chiffre vérifiable), **Conformité** (OK / à retravailler).

Les angles à utiliser (aucun ne repose sur une promesse médicale) :

| Angle | Exemple de message autorisé |
|---|---|
| Démonstration | Comment on le prépare ou l'utilise, texture, conditionnement |
| Témoignage d'expérience | Avis client sur le goût, la facilité, le service, la livraison. Pas de « j'ai guéri ». |
| Origine / savoir-faire | Ingrédients, provenance, fabrication, le personnage du Vieux KOUKA |
| Confiance COD | « Tu paies seulement quand tu reçois », livraison gratuite à Ouaga/Niamey, délai |
| Offre | Découverte vs pack, prix clair |
| Preuve sociale | Nombre de clients livrés (si c'est vrai), captures d'avis réels avec consentement |
| Objection | « Et si je ne suis pas là ? », « C'est livré comment ? » |

### 6.2 Choisir les premières publicités

1. Élimine tout ce qui est « à retravailler » sur la conformité.
2. Garde **un représentant par angle** : le meilleur fichier de chaque angle, pas cinq variantes du
   même témoignage.
3. Priorité aux créatives qui ont **déjà** produit des commandes **livrées** dans le passé. Regarde
   `utm_ad` sur les commandes `delivered` si tu as un historique.
4. La campagne 1 reçoit les 5–6 concepts les plus différents. Les concepts suivants passent en
   campagne 2, **2 concepts à la fois**.

### 6.3 Règles pour ne pas tester trop de choses

- Maximum **6 publicités** dans l'ensemble de scaling et **3 par ensemble de test**. Au-delà, Meta
  n'en diffuse réellement que 1 ou 2.
- Un ensemble de test = **un concept** (angle + promesse). On fait varier l'accroche et le format,
  pas le message.
- **2 nouveaux concepts par semaine** à 50 $/j, 3 à 75–100 $/j.

### 6.4 Quand remplacer une créative

| Signal | Lecture | Action |
|---|---|---|
| Dépense ≥ 2 × coût cible par commande livrée, 0 commande | Le concept n'accroche pas | Couper |
| Commandes OK mais **taux de livraison < moyenne − 15 points** (sur ≥ 20 commandes) | La pub attire des commandes « impulsives » ou une promesse mal comprise | Couper, même si le CPA Meta est bas |
| Gagnante dont le CPA monte > 30 % sur 7 jours glissants et la fréquence > 2,5–3 | Fatigue | Nouvelle accroche du même concept |
| CTR lien en baisse > 30 % vs ses 7 premiers jours | Fatigue | Idem |

### 6.5 Mauvaise créative, mauvaise offre, mauvaise page ou mauvais trafic ?

| Symptôme | Diagnostic probable |
|---|---|
| CTR faible (< ~0,8 % lien **[PRATIQUE]**) et CPM normal | **Créative** : l'accroche ne retient pas |
| CTR bon, peu d'`InitiateCheckout` | **Page** : promesse incohérente avec la pub, page lente, prix surprenant |
| `InitiateCheckout` bon, peu de `Purchase` | **Formulaire / offre** : friction, prix, frais de livraison découverts trop tard, pays absent |
| Beaucoup de Purchase, faible confirmation | **Qualité du trafic / promesse** : clics accidentels (vérifie `utm_content` = placement), promesse exagérée, faux numéros |
| Bonne confirmation, faible livraison | **Opérations** : délai trop long, client injoignable, livreur, zone non desservie |
| **Toutes** les pubs ont le même problème | Le problème n'est **pas** la créative : regarde l'offre, la page ou la logistique |

### 6.6 Exploiter les résultats

- Gagnant (coût par commande livrée ≤ cible, sur ≥ 15–20 commandes livrées) : le concept est
  **ajouté** à la campagne 1. Ajoute-le en **nouvelle publicité avec l'identifiant de la
  publication existante**, pour conserver commentaires et réactions.
- Décline chaque gagnant en **3 nouvelles accroches**, 1 nouveau format et 1 nouvelle personne à
  l'écran. Elles passent en test la semaine suivante.
- Tiens un « journal des apprentissages » : quel angle livre le mieux, et par pays.

### 6.7 Publications existantes ou nouvelles publicités ?

- **Phase de test :** nouvelles publicités. Ça garde des données propres et un nom lisible dans l'UTM.
- **Phase de scaling :** reprends la **publication existante** du gagnant (sélection par
  identifiant de publication). [FAIT] Meta permet de réutiliser une publication existante, avec ses
  réactions et commentaires. La preuve sociale accumulée améliore souvent le CTR. [PRATIQUE]
- **Modère les commentaires tous les jours** : réponds aux questions, masque les arnaques et les
  affirmations médicales des internautes. Elles engagent ta responsabilité.

---

## 7. Règles de décision : couper, maintenir, augmenter

Les seuils ci-dessous sont calculés à partir du **modèle de rentabilité (section 9)**. Avec les
hypothèses de l'exemple :

- **Coût maximal par commande livrée (seuil de rentabilité) : 6 324 FCFA** ;
- **Coût cible par commande livrée** (marge de sécurité de 30 %) : **~4 430 FCFA** ;
- **CPA Meta équivalent** (Purchase), avec 53 % de livraison : ≈ 4 430 × 0,53 ≈ **2 350 FCFA (~3,9 $)**.

⚠️ Recalcule ces trois chiffres avec **tes** coûts et **ton** taux de livraison réel avant de les appliquer.

| Niveau | Couper | Maintenir | Augmenter |
|---|---|---|---|
| **Publicité** | Dépense ≥ 2 × coût cible livré sans commande · ou taux de livraison très inférieur à la moyenne sur ≥ 20 commandes | Entre cible et seuil | Ne s'augmente pas : on la duplique en test ou on la garde |
| **Ensemble de test** | Après ≥ 3 × coût cible livré dépensé et coût par commande livrée (estimé) > seuil | Résultats entre cible et seuil : 3–4 jours de plus | Gagnant → transfert en campagne 1 |
| **Campagne principale** | Coût livré > seuil sur **14 jours de commandes clôturées** → retour au palier précédent, et diagnostic (section 6.5) | Entre cible et seuil | Conditions de la section 8 remplies |
| **Placement** | Audience Network ou autre placement dont le taux de **confirmation** est inférieur de 20 points à la moyenne, sur ≥ 30 commandes → exclure | — | — |

**Ce qui ne déclenche jamais une hausse :** un CPA Meta bas sur 1 à 3 jours, un ROAS affiché par Meta,
ou un jour exceptionnel.

**Limite statistique importante :** sur 20 commandes, un taux de livraison mesuré à 50 % est
compatible avec un vrai taux entre ~30 % et ~70 %. Les seuils de 20 à 30 commandes sont des **minima
pour décider**, pas des garanties. Plus l'enjeu est gros (doubler le budget, couper un pays), plus
il faut de commandes.

**Délai de livraison :** une commande passée aujourd'hui n'a un statut final qu'après 2 à 10 jours
**[HYPOTHÈSE]**. Les règles s'appliquent donc à des **cohortes clôturées** : commandes passées il y a
plus de *N* jours, où *N* est ton délai au 90ᵉ centile. Les 3–7 derniers jours restent « provisoires ».
On les estime avec le taux de livraison historique de la même publicité ou du même pays.

---

## 8. Plan de scaling progressif

| Palier | Conditions préalables (toutes) | Données minimales | Coût max par commande livrée | Risques |
|---|---|---|---|---|
| **50 $** (lancement) | Conditions de la section 4 | — | Seuil 6 324 FCFA, cible ~4 430 **[HYPOTHÈSE]** | Apprentissage instable sur les 3–5 premiers jours : ne rien toucher pendant ce temps |
| **→ 75 $** | 14 jours écoulés, campagne 1 sortie d'apprentissage, coût par commande livrée ≤ cible sur la cohorte clôturée, confirmation et stock OK | ≥ 60 commandes **livrées** | ≤ cible | La hausse de +50 % relance parfois l'apprentissage : préfère 2 hausses de ~20–25 % espacées de 3–4 jours (35 → 43 → 55 $ en C1) |
| **→ 100 $** | Coût livré ≤ cible 2 semaines de suite au palier 75 $ · ≥ 1 nouveau gagnant issu des tests · équipe de confirmation dimensionnée pour ~35–45 commandes/j | ≥ 120 commandes livrées cumulées | ≤ cible | Saturation de l'audience BF + NE (hausse de la fréquence et du CPM). C'est là qu'on ouvre le test géo C3, si un pays est prêt. |
| **→ 150 $** | Idem + taux de livraison stable (± 5 pts) + trésorerie couvrant ~3 semaines de dépenses (le COD encaisse en différé) | ≥ 250 commandes livrées | ≤ cible | Hausse des refus quand on élargit à des clients moins intéressés. Surveille la livraison **par jour de commande**. |
| **→ 200 $ +** | Plusieurs pays rentables · process de confirmation et de livraison qui tiennent la charge | Données par pays ≥ 100 livrées | ≤ cible **par pays** | Gestion de la complexité. C'est le moment de séparer les pays si la section 10 le justifie. |

**Scaling horizontal**, en parallèle de la hausse du budget : nouveaux concepts gagnants dans C1,
puis nouveaux pays via C3. **Scaling vertical :** hausses de 20–25 % du budget de C1 tous les 3–4
jours tant que les règles sont respectées. **Retour arrière :** si le coût par commande livrée
dépasse le seuil sur une cohorte clôturée de 7 jours, reviens au palier précédent. On ne baisse pas
en dessous du dernier palier rentable.

---

## 9. Modèle de rentabilité COD

### 9.1 Variables (à renseigner)

| Code | Variable | Unité |
|---|---|---|
| P | Prix de vente encaissé | FCFA / commande livrée |
| A | Coût d'achat ou de fabrication | FCFA / unité |
| T | Transport + importation | FCFA / unité |
| E | Emballage | FCFA / commande expédiée |
| L | Livraison (payée même si refusée ?) | FCFA / commande **expédiée** |
| R | Coût d'un retour (retour, casse, emballage perdu) | FCFA / commande expédiée non livrée |
| K | Commission commerciale (closeuse) | FCFA / commande **livrée** |
| F | Frais de confirmation (appels, WhatsApp, temps) | FCFA / commande **enregistrée** |
| M | Frais de paiement / transfert mobile money | % de P, par commande livrée |
| S | Dépense publicitaire | FCFA sur la période |
| N_e, N_c, N_x, N_l | Commandes enregistrées, confirmées, expédiées, livrées | nombre |
| FF | Frais fixes (salaires, outils, loyer) | FCFA / mois |
| Imp | Impôts et taxes | selon ton régime |

Taux : `t_conf = N_c / N_e`, `t_exp = N_x / N_c`, `t_liv = N_l / N_x`, **`t_global = N_l / N_e`**.

### 9.2 Formules

```
1. Coût par commande enregistrée   = S / N_e            (≈ CPA affiché par Meta, si le suivi est fidèle)
2. Coût par commande confirmée     = S / N_c
3. Coût par commande expédiée      = S / N_x
4. Coût par commande livrée (CAC réel) = S / N_l = (S / N_e) / t_global

5. Marge avant publicité, sur la période :
   MAP = N_l × (P − A − T − K − M×P)
       − N_x × (E + L)
       − (N_x − N_l) × R
       − N_e × F
   Marge avant publicité par commande livrée = MAP / N_l
   → c'est le COÛT MAXIMAL acceptable par commande livrée (seuil de rentabilité).

6. Bénéfice net estimé par commande livrée = (MAP − S − FF_période − Imp) / N_l
```

**Pourquoi le CAC réel intègre les commandes non livrées :** la publicité a payé les N_e commandes.
Les commandes refusées coûtent **en plus** la livraison (L), le retour (R) et la confirmation (F).
Elles sont dans MAP. On divise donc la dépense **totale** par les **seules** commandes livrées.

### 9.3 Exemple chiffré — **entièrement hypothétique**

Hypothèses : P = 12 500 · A + T = 2 500 (le code indique un coût d'achat de 2 000 pour la poudre, à
confirmer) · E = 200 · L = 2 000 par expédition (valeur `DELIVERY_COST` du code, appliquée ici à
toute expédition) · R = 500 · K = 500 · F = 100 · M = 1 % · confirmation 70 %, expédition 95 % des
confirmées, livraison 80 % des expédiées · CPA Meta 1 500 FCFA.

Pour **100 commandes enregistrées** :

| Étape | Nombre | Calcul |
|---|---|---|
| Enregistrées | 100 | |
| Confirmées | 70 | 100 × 70 % |
| Expédiées | 66 | 70 × 95 % (arrondi) |
| Livrées | 53 | 66 × 80 % (arrondi) → t_global = 53 % |
| Refusées / non livrées après expédition | 13 | |

| Poste | Montant (FCFA) |
|---|---|
| Chiffre d'affaires encaissé : 53 × 12 500 | 662 500 |
| − Produit + transport/import : 53 × 2 500 | − 132 500 |
| − Commission : 53 × 500 | − 26 500 |
| − Frais de paiement : 53 × 125 | − 6 625 |
| − Emballage + livraison : 66 × 2 200 | − 145 200 |
| − Retours : 13 × 500 | − 6 500 |
| − Confirmation : 100 × 100 | − 10 000 |
| **= Marge avant publicité (MAP)** | **335 175** |
| MAP par commande livrée | **6 324** ← seuil de rentabilité |
| − Publicité : 100 × 1 500 | − 150 000 |
| = Marge après publicité | 185 175 |
| par commande livrée | 3 494 |

| Indicateur | Valeur |
|---|---|
| 1. Coût par commande enregistrée | 1 500 FCFA (2,5 $) |
| 2. Coût par commande confirmée | 150 000 / 70 = 2 143 FCFA |
| 3. Coût par commande expédiée | 150 000 / 66 = 2 273 FCFA |
| 4. **Coût par commande livrée** | 150 000 / 53 = **2 830 FCFA** |
| 5. Marge avant publicité / livrée | 6 324 FCFA |
| 6. Bénéfice net / livrée (frais fixes de 300 000 FCFA/mois sur 600 livrées → 500/livrée, avant impôts) | 3 494 − 500 ≈ **2 994 FCFA** |
| ROAS « Meta » (sur 100 × 12 500 enregistrés) | 8,3 → **trompeur** |
| ROAS réel encaissé (662 500 / 150 000) | 4,4 |
| **Seuil de CPA Meta** (MAP / N_e = 335 175 / 100) | **3 352 FCFA (~5,6 $)**, au-delà duquel tu perds de l'argent avec ces taux |

**Leçons :**
- Si le taux de livraison global passe de 53 % à 40 %, le seuil de CPA Meta tombe à ~2 400 FCFA.
  **Le taux de livraison est ton premier levier de rentabilité, avant le CPA.**
- L'offre pack (3 sachets, prix plus élevé) change complètement l'équation : la livraison et la
  confirmation se paient une seule fois. Suis le **panier moyen livré**, pas seulement le prix
  unitaire.

---

## 10. Méthode de comparaison des pays

### 10.1 Indicateur unique : **marge après publicité par commande enregistrée** par pays

```
Pour chaque pays p, sur une cohorte clôturée :
  MAP_p  = formule 5 avec les coûts et taux propres au pays (L, R, délais différents)
  S_p    = dépense Meta du pays (ventilation « Pays » d'Ads Manager)
  Résultat_p = (MAP_p − S_p) / N_e,p        ← comparable entre pays
  Seuil CPA_p = MAP_p / N_e,p              ← CPA Meta maximal propre au pays
```

Un pays avec un CPA Meta deux fois plus bas peut être **moins** rentable si sa livraison est faible
ou chère. Ne compare jamais les pays sur le CPA seul.

À suivre aussi par pays : taux de confirmation, taux de livraison, part de commandes « hors
capitale » (car = +1 000 / +1 500 FCFA et plus de refus), **délai médian commande → livraison**
(qui immobilise la trésorerie), motifs de refus (`refusal_reason`).

### 10.2 Regrouper ou séparer ?

| Situation | Décision |
|---|---|
| Écart de seuil CPA entre pays < 25 % et taux de livraison proches (± 10 pts) | **Regrouper** dans le même ensemble |
| Un pays a un seuil CPA nettement plus bas (> 25 % d'écart) et ≥ 50 commandes de données | **Séparer** ce pays dans son propre ensemble, avec son propre budget, **seulement si** ce budget peut atteindre ~30–50 achats/semaine. Sinon, garde-le groupé et coupe-le si son résultat est négatif. |
| Un pays a un résultat négatif sur ≥ 2 cohortes clôturées | Le **retirer** de la campagne, corriger la logistique, puis le retester en C3 |
| Nouveau pays (Mali, Bénin, CI) | **Jamais** dans C1 directement : d'abord C3, puis intégration si résultat ≥ BF/NE |

### 10.3 Ouverture d'un nouveau pays (campagne C3, à partir du palier 100 $)

Prérequis : le pays est ajouté dans `COUNTRIES` et `COUNTRY_DELIVERY` (indicatif, zones, frais), avec
des livreurs partenaires, une closeuse qui parle les langues locales et des prix affichés en tenant
compte des frais.

```
CAMPAGNE 3 — [PAYS]_VENTES_GEOTEST_ABO
  Ensemble 3.1 — [PAYS]_BROAD · 10–20 $/j · Purchase · les 3–4 meilleurs concepts de C1
  (publications existantes)
  Durée : jusqu'à ~30 commandes livrées ou 3 × seuil dépensé sans résultat
```

On teste un seul nouveau pays à la fois. Le budget **n'est jamais réparti à parts égales** : il suit
le résultat de chaque pays.

---

## 11. Vérification du pixel et du suivi des livraisons

### 11.1 Ce que ton site envoie aujourd'hui [FAIT, lecture du code]

| Événement | Où | Pixel navigateur | API Conversions | Statut |
|---|---|---|---|---|
| PageView | `__root.tsx` | ✅ | ❌ | OK |
| ViewContent | — | ❌ | ❌ | **Manquant** : à ajouter sur la page produit, avec `content_name`, `value` et `currency` |
| AddToCart | Choix d'offre (`ProductForm.tsx`) | ✅ | ✅ | OK, mais il se déclenche à chaque clic sur une offre (plusieurs fois possible) |
| InitiateCheckout | `ProductForm.tsx:201` | ✅ | ✅ | OK |
| Purchase | Soumission du formulaire | ✅ | ✅ | OK = **commande enregistrée** |
| Lead | Soumission du formulaire **et** clic de confirmation WhatsApp | ✅ | ✅ | **Ambigu** : deux sens pour un même événement. Renomme la confirmation WhatsApp en événement personnalisé (`WhatsAppConfirm`) ou en `Contact`. |

Défauts côté API Conversions (`src/lib/fbCapi.functions.ts`) :
- `country` reçoit le **nom** du pays. Meta attend le **code ISO à 2 lettres en minuscules**
  (`bf`, `ne`), haché. [FAIT, spécification des paramètres client de Meta]
- Sur la page de remerciement, le pays n'est pas transmis : il vaut `bf` par défaut, même pour le Niger.
- `client_ip_address` n'est pas envoyé. L'ajouter (depuis les en-têtes de la requête serveur)
  améliore la qualité de correspondance.
- Ajouter `external_id` (numéro de commande ou identifiant client haché) et `order_id` dans
  `custom_data` faciliterait le rapprochement avec ta base.
- Le téléphone est bien envoyé avec l'indicatif et haché en SHA-256. ✅

### 11.2 Vérifications dans le Gestionnaire d'événements

1. **Tester les événements** : ouvre ton site via l'outil, passe une vraie commande de test, puis
   vérifie que chaque événement apparaît **deux fois** (Navigateur + Serveur) avec le **même ID
   d'événement**, et qu'il est marqué « Dédupliqué ».
2. **Vue d'ensemble → chaque événement** : la ligne « Déduplication » doit montrer un taux élevé
   pour Purchase. Si Serveur ≈ 2 × Navigateur, la déduplication échoue.
3. **Qualité de correspondance des événements** (Event Match Quality) pour Purchase : vise
   « Bonne » ou mieux. Les corrections de la section 11.1 l'améliorent.
4. **Diagnostics** : aucun avertissement de paramètre invalide (devise, valeur, pays).
5. **Fraîcheur** : les événements serveur doivent arriver en quelques secondes. Le token
   `FB_CAPI_TOKEN_MAIN` doit exister en production, sinon l'API Conversions est **silencieusement
   ignorée** (`skipped: true` dans le code).

### 11.3 Cohérence achats Meta / commandes réelles (chaque jour)

```
Écart = Purchase (Gestionnaire d'événements, toutes sources, jour J)
        vs  COUNT(orders) créées le jour J (hors commandes manuelles des closeuses)
```

- Un écart de ±10 % est acceptable : bloqueurs, cookies refusés, doublons.
- Plus d'achats Meta que de commandes : double déclenchement, ou rechargement de la page de remerciement.
- Moins d'achats Meta : API Conversions désactivée, ou erreur JavaScript.

⚠️ Les achats **attribués** dans Ads Manager seront toujours inférieurs au total, car tout le monde
ne vient pas d'une publicité (attribution par défaut : clic 7 jours, engagement 1 jour et vue 1 jour).
[FAIT] Meta a modifié ses fenêtres d'attribution en 2025–2026 : fenêtres de vue de 7 et 28 jours
retirées de l'API Insights, catégorie « engagement » distincte des clics sur lien. Compare donc des
périodes **avec le même réglage**.

### 11.4 Suivi confirmé / expédié / livré / refusé

**Dans ton système (source de vérité) :** `orders.status` avec horodatage de chaque changement, plus
`refusal_reason`, `utm_*`, pays et ville. C'est **là** que se calculent tous les KPI de ce document.

**Renvoyer la livraison à Meta (amélioration, pas prérequis au lancement) :**
- [FAIT] L'ancienne *Offline Conversions API* a été retirée en mai 2025. Les événements hors ligne
  passent désormais par l'**API Conversions** standard, avec un `action_source` adapté. Les
  événements trop anciens sont refusés : vérifie la fenêtre maximale dans la documentation
  actuelle. Elle est généralement indiquée à 7 jours.
- Mise en œuvre possible : un déclencheur Supabase sur `status → delivered` (tu en as déjà sur ce
  passage de statut) envoie un événement personnalisé `OrderDelivered`. Il porte le même téléphone
  haché, `fbp`/`fbc` mémorisés à la commande, la valeur encaissée et `order_id`.
- **Usages réalistes :** mesurer les livraisons par campagne dans Ads Manager, créer des audiences
  personnalisées « clients livrés » (pour les exclure ou les relancer) et des audiences similaires
  de qualité.
- **Optimiser directement sur `OrderDelivered`** est une **expérience** : le volume est plus faible et
  le signal arrive avec plusieurs jours de retard. Je ne peux pas te garantir que Meta l'exploite
  bien pour l'apprentissage dans ton contexte. À tester en C2 seulement, une fois que tu dépasses
  ~50 livraisons/semaine.
- Les commandes livrées **au-delà** de la fenêtre acceptée ne peuvent pas être renvoyées. Ton
  tableau de bord interne reste donc indispensable.

### 11.5 Confidentialité et consentement

- Le Burkina Faso (loi n° 001-2021/AN sur la protection des données personnelles, autorité :
  CIL), le Niger, le Mali, le Bénin (Code du numérique, APDP) et la Côte d'Ivoire (loi 2013-450,
  ARTCI) ont des lois de protection des données. Elles imposent globalement d'**informer** la
  personne, d'avoir une base légale, de sécuriser les données et parfois de **déclarer** le
  traitement. **[À vérifier avec un juriste local : je ne connais pas tes obligations de
  déclaration exactes.]**
- Minimum recommandé : une page « Politique de confidentialité » qui mentionne l'usage du pixel Meta
  et de l'API Conversions, un bandeau d'information sur les cookies, et l'envoi des seules données
  utiles (téléphone, ville, pays), hachées. C'est déjà le cas pour l'API Conversions.
- Pour un produit lié à la santé, n'envoie **jamais** à Meta de donnée révélant un état de santé
  (nom de pathologie dans `content_name`, URL contenant « diabète », etc.). [FAIT] Meta restreint
  les données sensibles de santé reçues via le pixel et peut bloquer des événements ou limiter
  l'optimisation pour les sites classés dans ces catégories. Dans le code actuel, `content_name`
  contient le nom du produit, « Anti-Diabète » compris : à neutraliser (ex. `POUDRE-01`).
- **Ce que Meta prend en charge :** les événements standard (PageView, ViewContent, AddToCart,
  InitiateCheckout, Purchase, Lead, Contact…), les événements personnalisés, les conversions
  personnalisées, l'API Conversions (web et hors ligne) et les audiences personnalisées.
  **Ce qui reste chez toi :** les statuts de commande, les motifs de refus, les coûts, la marge, le
  délai de livraison et la performance par livreur ou par closeuse.

---

## 12. Plan d'exécution des 7 premiers jours

| Jour | Actions |
|---|---|
| **J-2 / J-1** | Corriger le suivi (section 11.1) · commande de test, puis contrôle de la déduplication · paramètres d'URL · classement des créatives (6.1) · choix des 6 + 2 concepts · audience d'exclusion · capacité de confirmation et stock vérifiés · **mise en conformité des textes (section 0)** |
| **J1** | Lancer C1 (35 $) et C2 (15 $) le matin. Contrôle à midi : diffusion OK, pas de refus de pub, commandes en base avec `utm_ad` rempli. |
| **J2** | Rapprochement Purchase Meta / commandes en base. Confirmation de toutes les commandes de J1 dans la journée. **Aucune modification** des campagnes. |
| **J3** | Premier tableau de bord. Coupe uniquement les publicités de C2 qui ont dépensé ≥ 2 × coût cible livré sans aucune commande. |
| **J4** | Premiers taux de confirmation par publicité et par pays (encore peu fiables). Prépare les 2 concepts de test suivants. |
| **J5** | Premières livraisons : premier taux de livraison provisoire. Vérifie le placement (`utm_content`) des commandes non confirmées. |
| **J6** | Si un ensemble de C2 est clairement mauvais (CTR et commandes faibles), remplace-le par un nouveau concept. Ne touche pas à C1 s'il est en apprentissage. |
| **J7** | Bilan de la semaine : coût par commande enregistrée / confirmée / livrée (provisoire), par pays et par concept. Décisions : quels concepts de test passent en C1, quels nouveaux concepts entrent en test. **Pas de hausse de budget avant J14.** |

---

## 13. Tableau de bord quotidien

Une ligne par jour **de commande**, avec les cohortes mises à jour chaque jour jusqu'à leur clôture.
On peut le générer en SQL depuis `orders` et la dépense Ads Manager exportée.

| Colonne | Source |
|---|---|
| Date de commande | — |
| Dépense ($ et FCFA), par campagne et par pays | Ads Manager |
| Impressions, CPM, CTR lien, fréquence | Ads Manager |
| ViewContent → AddToCart → InitiateCheckout → Purchase (Meta) | Gestionnaire d'événements |
| Commandes enregistrées (base) · écart avec Purchase Meta | `orders` |
| Confirmées · taux de confirmation | `orders.status` |
| Expédiées · livrées · refusées · en cours | `orders.status` |
| Taux de livraison **clôturé** et **provisoire** | calcul |
| Coût par commande enregistrée / confirmée / livrée | calcul |
| Panier moyen livré | `orders` |
| Marge avant pub · marge après pub · par commande livrée | modèle (section 9) |
| Top 3 et flop 3 des publicités (par coût livré, avec `utm_ad`) | `orders` + Ads Manager |
| Taux de confirmation par placement (`utm_content`) | `orders` |
| Motifs de refus (top 3) | `orders.refusal_reason` |
| Décision du jour (couper / maintenir / augmenter) + raison | toi |

Requête de départ (à adapter au schéma exact) :

```sql
SELECT
  date_trunc('day', created_at)              AS jour,
  utm_ad,
  country,
  COUNT(*)                                   AS enregistrees,
  COUNT(*) FILTER (WHERE status IN ('confirmed','shipped','delivered')) AS confirmees,
  COUNT(*) FILTER (WHERE status IN ('shipped','delivered'))             AS expediees,
  COUNT(*) FILTER (WHERE status = 'delivered')                          AS livrees,
  COUNT(*) FILTER (WHERE status IN ('refused','cancelled'))             AS perdues,
  SUM(price) FILTER (WHERE status = 'delivered')                        AS ca_encaisse
FROM orders
WHERE utm_source = 'facebook'
GROUP BY 1, 2, 3
ORDER BY 1 DESC, livrees DESC;
```

⚠️ Une commande `refused` après expédition et une commande `cancelled` avant expédition n'ont pas
le même coût. Si ton flux ne distingue pas les deux, ajoute un horodatage `shipped_at` pour le
savoir.

---

## 14. Informations manquantes qui peuvent changer la stratégie

Je te demande en priorité les **cinq premières** :

1. **Quel produit exactement ?** Si c'est l'« Anti-Diabète » ou le « Sirop KOUKA », le positionnement
   doit être revu avant tout (section 0).
2. **Tes coûts réels :** A, T, E, L (payée même si refus ?), R, K, F, M, frais fixes, régime fiscal.
3. **Tes taux historiques** par pays : confirmation, livraison, délai médian. Si tu as déjà fait de
   la pub, l'historique de `orders` suffit.
4. **Historique du compte publicitaire :** nombre d'achats pixel sur 30 jours, campagnes actives,
   restrictions passées. Un compte neuf ou déjà sanctionné change le rythme.
5. **Délai et calendrier d'ouverture** de Mali, Bénin et Côte d'Ivoire (livreurs, closeuses, frais).
6. Capacité de confirmation (personnes, horaires) et de stock.
7. Le prix est-il le même dans tous les pays ? Les frais de livraison sont-ils affichés avant la commande ?
8. Taux de change réel facturé par ta carte, et moyen de paiement du compte publicitaire (les
   échecs de paiement coupent la diffusion).
9. Saisonnalité ou événements (Ramadan, Tabaski, fin de mois, rentrée) qui modifient le pouvoir d'achat.
10. Part des commandes qui viennent de WhatsApp ou des closeuses (`ManualLeadModal`) plutôt que du site :
    ces ventes ne sont pas vues par le pixel.

---

## Checklist de configuration Ads Manager

**Avant de créer les campagnes**
- [ ] Section 0 traitée : produit, page et textes sans allégation médicale
- [ ] `ViewContent` ajouté · `Lead` de confirmation renommé · pays ISO dans l'API Conversions · `content_name` neutre
- [ ] Commande de test : Purchase visible Navigateur + Serveur, dédupliqué
- [ ] `FB_CAPI_TOKEN_MAIN` présent en production
- [ ] Domaine vérifié dans le Gestionnaire d'entreprises
- [ ] Audience personnalisée « Site web → Purchase → 30 jours » créée
- [ ] Moyen de paiement du compte valide, limite de dépense du compte ≥ budget mensuel

**Campagne 1 — `BFNE_VENTES_SCALE_CBO_<date>`**
- [ ] Objectif **Ventes** · configuration Advantage+ (budget de campagne) activée
- [ ] Budget quotidien **35 $** · stratégie « Volume maximal », sans plafond de coût
- [ ] Ensemble `BFNE_BROAD_ADV+` : emplacement de conversion **Site web** · pixel `2277004996431360` · événement **Purchase**
- [ ] Attribution : défaut (clic 7 j / engagement 1 j / vue 1 j), la même pour toutes les campagnes
- [ ] Lieux : **Burkina Faso, Niger** (villes livrables si besoin) · âge min. 18 · audience Advantage+ · exclusion Purchase 30 j
- [ ] Placements Advantage+
- [ ] 5–6 publicités, **1 par concept** · paramètres d'URL UTM collés sur chacune
- [ ] Noms des publicités au format `CONCEPT_FORMAT_vN`

**Campagne 2 — `BFNE_VENTES_TEST_ABO_<date>`**
- [ ] Objectif **Ventes** · budget de campagne Advantage+ **désactivé** (ABO)
- [ ] 2 ensembles `TEST_<CONCEPT>` à **7,50 $** chacun · même ciblage, événement et placements que C1
- [ ] 3 publicités par ensemble (même concept, accroches et formats différents) · UTM sur chacune

**Pilotage**
- [ ] Tableau de bord (section 13) en place · rapprochement Meta / base quotidien
- [ ] Seuil de coût par commande livrée recalculé avec tes vrais coûts (section 9)
- [ ] Pas de modification de C1 pendant ses 3–5 premiers jours · pas de hausse de budget avant J14
- [ ] Chaque semaine : 2 nouveaux concepts en test · gagnants transférés en C1 via la publication existante

---

### Sources consultées (documentation et analyses, octobre 2026)

- Meta — phase d'apprentissage, ~50 événements en 7 jours : <https://developers.meta.com/horizon/resources/launch-ad-campaign/>
- Meta — API Conversions et événements hors ligne : <https://developers.facebook.com/docs/marketing-api/offline-conversions>
- Retrait de l'Offline Conversions API (mai 2025) : <https://www.jonloomer.com/qvt/offline-conversions-api-deprecation-delayed/>
- Changements d'attribution 2025–2026 : <https://www.jonloomer.com/meta-ads-attribution-2026/>, <https://ppc.land/meta-restricts-attribution-windows-and-data-retention-in-ads-insights-api/>
- Advantage+ vs configuration manuelle (analyse tierce) : <https://stackmatix.com/blog/when-to-use-meta-advantage-plus-campaigns>

Des articles tiers mentionnent des seuils d'apprentissage abaissés en 2026 (25 ou 10 événements). Je
ne les ai **pas** retrouvés dans la documentation officielle de Meta : ce document conserve le repère
officiel d'environ 50 événements en 7 jours.
