
# Plan — Bilan Hebdomadaire + Coach IA "Vieux KOUKA Business"

## Ce que tu demandes (et pourquoi c'est faisable)

Toutes les données nécessaires sont déjà dans la base : `orders` (CA, livrées, annulées, par produit, par livreur), `daily_expenses` (pub, stock, salaires, autres), `visits` (trafic, sources), `stock_transactions` (sorties réelles). Il suffit de **les croiser, calculer des ratios, et faire passer le tout à une IA (Lovable AI / Gemini)** qui te recrache un plan d'action chaque dimanche.

## Version améliorée proposée

Au lieu d'un simple "bilan", on construit un vrai **Coach IA Business** avec 4 blocs :

### 1. 📊 Bilan chiffré de la semaine (auto)
Calculé côté client à partir de `orders` + `daily_expenses` filtrés sur lundi → dimanche :
- CA livré, CA en attente, nb commandes, taux de livraison, panier moyen
- Répartition par produit (Poudre vs Sirop) : volumes, CA, marge estimée
- Répartition par livreur : performance, taux de livraison
- Dépenses par catégorie (pub, stock, salaire, autres)
- **Profit net** = CA livré − dépenses
- **ROAS pub** = CA livré ÷ dépenses pub
- **CAC** (coût d'acquisition) = dépenses pub ÷ commandes livrées
- Comparatif vs semaine précédente (▲ +18% / ▼ −5%)

### 2. 🤖 Analyse IA (Gemini via Lovable AI Gateway)
Edge function `weekly-coach` qui reçoit le bilan brut + un dump compact des pages produits (titres, prix, offres actuelles) et renvoie un rapport structuré :

- **Diagnostic** : ce qui marche, ce qui bloque
- **Audit pages de vente** : suggestions concrètes (titres, offres, FAQ, urgences) basées sur les données réelles (taux conversion par page, sources qui convertissent le mieux)
- **Plan d'action 7 jours** : 3 à 5 actions prioritaires
- **Alertes** : produit qui chute, livreur en sous-perf, dépense anormale

### 3. 💰 Recommandations financières (le cœur de ta demande)
L'IA reçoit en plus une **règle de répartition** que tu valides une fois et applique chaque semaine au profit net :

Exemple par défaut (tu pourras ajuster) :
- **40% → Réinvestissement PUB** semaine suivante (avec budget journalier suggéré)
- **30% → Stock** (avec produit prioritaire calculé : celui qui a le meilleur ROAS × stock restant le plus bas)
- **20% → Épargne / Trésorerie de sécurité**
- **10% → Toi (rémunération)**

Sortie concrète :
> 💵 Profit semaine : 247 500 FCFA
> 📣 Pub semaine prochaine : **99 000 FCFA** (≈ 14 000/jour, focus Sirop KOUKA — meilleur ROAS 4.2)
> 📦 Stock à racheter : **74 000 FCFA** → priorité **Poudre KOUKA** (12 unités)
> 🏦 Épargne : **49 500 FCFA**
> 👤 Pour toi : **24 800 FCFA**

### 4. 🗓️ Génération auto chaque dimanche 20h
- Cron `pg_cron` → endpoint `/api/public/hooks/weekly-report`
- L'endpoint : calcule le bilan, appelle Gemini, **sauvegarde** dans une nouvelle table `weekly_reports` (date_semaine, kpi JSON, rapport_ia text, recos_finance JSON)
- Notification push admin : "📊 Ton bilan de la semaine est prêt"
- Onglet "Bilan" affiche le dernier rapport + historique des semaines précédentes

## Détails techniques

**Nouvelle table** `weekly_reports` :
```
id uuid, week_start date, week_end date,
kpi jsonb, ia_report text, finance_reco jsonb,
generated_at timestamptz, read_at timestamptz null
```

**Nouveau composant** `src/components/admin/BilanTab.tsx` :
- Sélecteur de semaine (par défaut: dernière)
- Cards KPI + comparatif vs n-1
- Bloc rapport IA (markdown rendu via `react-markdown`)
- Cards reco finance avec gros chiffres
- Bouton "🔄 Régénérer maintenant" (utile si tu veux le bilan en milieu de semaine)
- Bouton "⚙️ Régler ma répartition" (modal pour ajuster les % pub/stock/épargne/toi)

**Nouvelle edge function** `supabase/functions/weekly-coach/index.ts` :
- Input : `{ week_start, week_end, kpi, products, finance_rules }`
- Appelle `https://ai.gateway.lovable.dev/v1/chat/completions` avec `google/gemini-2.5-pro` (raisonnement riche pour conseils business) + tool calling pour structurer la sortie
- Output : `{ report_markdown, finance_reco: { pub, stock, epargne, toi, produit_prio, raison }, alerts: [] }`

**Cron `pg_cron`** : tous les dimanches à 20h00 Africa/Abidjan (= 20h UTC).

**Intégration admin** : nouvel onglet `'bilan'` avec emoji `🧠` dans `src/routes/admin.tsx`.

**Règles finance** : stockées dans `localStorage` côté admin (simple) OU dans une mini table `settings` (plus propre, je propose `settings` avec une seule ligne `key='finance_rules'`).

## Bonus (si tu valides)

- **Mode "Coach quotidien"** : un mini résumé chaque matin 8h ("Hier tu as fait X, ton focus aujourd'hui")
- **Score business hebdo** /100 (santé globale : ROAS + taux livraison + croissance + cash)
- **Export PDF** du bilan pour archivage / partage avec un associé éventuel

## Fichiers touchés

- **Créés** : `src/components/admin/BilanTab.tsx`, `supabase/functions/weekly-coach/index.ts`, migration SQL (`weekly_reports` + `settings`), route `src/routes/api/public/hooks/weekly-report.ts`
- **Édités** : `src/routes/admin.tsx` (nouvel onglet), `supabase/config.toml` (config edge function)

## Ce dont j'ai besoin de toi avant de coder

1. **Tes règles finance** par défaut — j'ai proposé 40/30/20/10, tu confirmes ou tu changes ?
2. **Marge produit** : je n'ai pas le coût de revient unitaire (Poudre / Sirop). Sans ça, je calcule le profit comme `CA livré − dépenses du mois`. Si tu me donnes les coûts, je peux calculer une **marge brute par produit** (beaucoup plus précis pour le scoring IA).
3. **Bonus coach quotidien** : on l'ajoute maintenant ou on garde pour V2 ?

Dis-moi et je passe en mode build dès que tu approuves 🚀
