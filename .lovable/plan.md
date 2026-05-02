
# Plan — Audio "Vieux KOUKA" + Onglet SAV J+7

## Partie 1 — Lecteur audio sur chaque page de vente

### Fichiers audio
- Copier `user-uploads://Poudre_KouKa.aac` → `public/audio/poudre-kouka.aac`
- Copier `user-uploads://Sirop_KouKa.aac` → `public/audio/sirop-kouka.aac`

### Composant `src/components/AudioVieuxKouka.tsx`
Un lecteur audio **impossible à manquer**, pas un simple `<audio controls>`. Caractéristiques :
- **Carte premium** verte/or avec bordure dorée pulsante, ombre prononcée
- **Photo/avatar du Vieux** (cercle, animation pulse douce)
- **Titre fort** : « 🎙️ Écoute le Vieux KOUKA te parler » + sous-titre « Message personnel · 1 min »
- **Gros bouton Play rond** (80px, doré, animation pulse-ring quand non lu)
- **Barre de progression** custom (cliquable pour scrub) + temps écoulé / durée
- **Contrôle vitesse** (1x / 1.5x) et bouton +15s
- **Badge "🔴 EN DIRECT du Vieux"** clignotant tant que pas écouté
- **Message après écoute** : « ✅ Tu viens d'écouter le Vieux. Maintenant choisis ton pack 👇 » avec flèche animée vers le formulaire
- Tracking : envoi event vers `visits` (page = `audio_played_<slug>`) + Facebook Pixel `AudioPlayed` lors du premier play
- Auto-pause si l'utilisateur scroll loin / change d'onglet
- Persistance localStorage (l'écoute ne se redéclenche pas en boucle)

Props : `src: string`, `productSlug: 'kouka' | 'sirop-kouka'`, `title?: string`

### Intégration
- `src/routes/index.tsx` (page Poudre KOUKA) : insérer **juste après le hero**, avant les bénéfices, avec `src="/audio/poudre-kouka.aac"`
- `src/routes/product.$slug.tsx` (page Sirop) : même emplacement, `src="/audio/sirop-kouka.aac"`

Placement stratégique = max conversion : visible immédiatement après l'accroche, avant que le visiteur ait le temps de scroller.

---

## Partie 2 — Onglet SAV (Service Après-Vente) admin

### Concept
Liste automatique des **commandes livrées il y a 7 jours ou plus** qui n'ont **pas encore reçu de relance SAV**. Pour chaque ligne : bouton WhatsApp avec message pré-rédigé selon le produit (Poudre vs Sirop).

### DB — migration
Ajouter une colonne à `orders` :
- `sav_followed_up_at timestamptz null` — horodatage du clic "SAV envoyé"
- `sav_notes text null` — notes libres du retour client

### Nouveau composant `src/components/admin/SAVTab.tsx`
- 3 sous-sections (tabs internes) :
  1. **🔔 À relancer** (livrée ≥ 7j et `sav_followed_up_at IS NULL`)
  2. **✅ Relancées** (sav_followed_up_at non null, < 30j)
  3. **📝 Tous les retours** (avec sav_notes renseignées)
- Pour chaque commande : nom, téléphone, ville, produit, date livraison, **j+X depuis livraison**
- **Bouton WhatsApp vert** → ouvre wa.me avec message pré-rédigé
- **Bouton "Marquer comme relancé"** → set `sav_followed_up_at = now()`
- **Champ notes** inline (textarea) → sauvegarde dans `sav_notes`
- Filtres : par produit, par livreur

### Messages SAV pré-rédigés
Dans `src/lib/whatsappMessages.ts`, ajouter :

```ts
export function buildSAVMessage(order: WAOrder): string
```

**Pour Poudre KOUKA** (hémorroïdes/ulcères) :
> Bonjour {prénom} 🌿
> 
> C'est l'équipe du *Vieux KOUKA*. Cela fait *7 jours* depuis ta commande de la *Poudre KOUKA*.
> 
> On voulait juste prendre de tes nouvelles 🙏
> 
> 👉 Comment vas-tu depuis que tu as commencé le traitement ?
> 👉 Les saignements / brûlures / ballonnements ont-ils diminué ?
> 👉 Es-tu satisfait des résultats ?
> 
> Ton retour est très important pour nous — et il aide d'autres personnes qui souffrent comme toi avant.
> 
> Merci pour ta confiance 🌿
> _Le Vieux KOUKA_

**Pour Sirop KOUKA** (vitalité/intimité) :
> Bonjour {prénom} 👋
> 
> C'est l'équipe discrète du *Vieux KOUKA*. Cela fait *7 jours* depuis ta commande du *Sirop KOUKA*.
> 
> On voulait prendre de tes nouvelles, en toute discrétion 🤐
> 
> 👉 Comment te sens-tu depuis le début du traitement ?
> 👉 As-tu remarqué un changement (énergie, tenue, désir) ?
> 👉 Es-tu satisfait des résultats ?
> 
> Ton retour reste *100% confidentiel* et nous aide à améliorer le produit.
> 
> Merci pour ta confiance 🙏
> _Le Vieux KOUKA_

### Intégration admin
- `src/routes/admin.tsx` : ajouter `'sav'` au type `Tab` et dans `TABS` avec emoji `🤝` et label "SAV"
- Render `<SAVTab orders={orders} onChange={() => load(true)} />` quand `tab === 'sav'`

### KPI bonus en haut de l'onglet
- Nb à relancer aujourd'hui
- Nb relancés cette semaine
- Taux de retour (notes renseignées / relancées)

---

## Détails techniques

- Format `.aac` lu nativement par tous navigateurs modernes via `<audio>` ; pas de conversion nécessaire.
- Le calcul "J+7" se fait côté client : on filtre `orders.where(status === 'delivered' && diffDays(now, created_at) >= 7)` (on n'a pas de colonne `delivered_at` ; si besoin précis on pourra l'ajouter plus tard, mais `created_at` + statut livré est suffisant pour démarrer).
- RLS `orders` est déjà permissive (anyone update) → pas de nouvelle policy.
- Aucune nouvelle dépendance npm.

## Fichiers touchés
- **Créés** : `src/components/AudioVieuxKouka.tsx`, `src/components/admin/SAVTab.tsx`, `public/audio/poudre-kouka.aac`, `public/audio/sirop-kouka.aac`, migration SQL
- **Édités** : `src/routes/index.tsx`, `src/routes/product.$slug.tsx`, `src/routes/admin.tsx`, `src/lib/whatsappMessages.ts`
