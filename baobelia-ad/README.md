# BAOBÉLIA — Publicité verticale 15 s (Remotion)

Publicité animée de 15 secondes pour Facebook Reels, Instagram Reels et TikTok.

| Réglage | Valeur |
| --- | --- |
| Format | 1080 × 1920 (9:16) |
| Cadence | 30 images/s |
| Durée | 15 s (450 images) |
| Export | MP4, H.264, yuv420p, sans piste audio |

Ce projet est indépendant du site web situé à la racine du dépôt : il a son propre `package.json` et ne modifie aucun fichier existant.

## Livrables

- `livrables/baobelia-pub-15s.mp4` : la vidéo finale.
- `livrables/baobelia-preview.png` : l'image de prévisualisation (plan final, image 420).
- `livrables/baobelia-planche-contact.jpg` : la planche des images clés des 4 scènes.

## Relancer le projet

Prérequis : Node.js 18 ou plus récent (testé avec Node 22).

```bash
cd baobelia-ad
npm install
npm run studio        # aperçu interactif dans le navigateur (Remotion Studio)
npm run render        # export → out/baobelia-pub-15s.mp4
npm run still         # image de prévisualisation → out/preview.png
npm run typecheck     # vérification TypeScript
node scripts/keyframes.mjs   # images clés de contrôle → out/keyframes/
```

Au premier rendu, Remotion télécharge automatiquement Chrome Headless Shell.
Si le réseau l'interdit, indiquez un Chromium déjà installé :

```bash
BROWSER_EXECUTABLE=/chemin/vers/chrome-headless-shell npm run render
```

## Storyboard

| Scène | Temps | Images | Texte |
| --- | --- | --- | --- |
| 1 · L'accroche | 0 → 3 s | 0–89 | « Votre peau mérite un rituel d’exception. » |
| 2 · La découverte | 3 → 7 s | 90–209 | « Découvrez BAOBÉLIA. » |
| 3 · L'univers de la gamme | 7 → 11 s | 210–329 | « Un rituel pensé pour votre peau. » |
| 4 · Le final commercial | 11 → 15 s | 330–449 | « Découvrez notre univers. » |

Chaque changement de scène se fait par un fondu enchaîné de 14 images (0,47 s), centré sur la frontière du storyboard. Entre les scènes 1 et 2, un éclat de lumière ivoire marque le passage de l'ombre à la lumière.

## Organisation du code

```
src/
├── config/                 ← tous les réglages modifiables
│   ├── video.ts            dimensions, fps, durées des scènes, zones de sécurité
│   ├── theme.ts            palette et typographies
│   ├── texts.ts            textes exacts de la publicité
│   └── assets.ts           polices, musique, photos produits (chemins)
├── scenes/                 les 4 séquences
│   ├── Scene1Hook.tsx      goutte de sérum, ondes, apparition du nom
│   ├── Scene2Discovery.tsx flacon sur socle minéral, travelling avant
│   ├── Scene3Range.tsx     gamme sur colonnes, texture de crème, travelling latéral
│   └── Scene4Finale.tsx    composition centrale, logo, appel à l'action
├── components/
│   ├── AnimatedText.tsx    texte révélé mot par mot
│   ├── BrandLogo.tsx       logo typographique BAOBÉLIA (texte réel, modifiable)
│   ├── CallToAction.tsx    bouton d'appel à l'action
│   ├── Transitions.tsx     placement des scènes, fondus, éclat lumineux
│   ├── Camera.tsx          caméra virtuelle (parallaxe)
│   ├── Atmosphere.tsx      fonds, ombres de feuilles de baobab, rayons, bokeh, grain
│   ├── MusicTrack.tsx      piste musicale facultative
│   └── cosmetics/          flacons, pot, tube, socle, goutte, trace de crème
├── fonts.ts                chargement des polices locales
├── BaobeliaAd.tsx          assemblage de la timeline
└── Root.tsx / index.ts     déclaration Remotion
public/
├── fonts/                  Cormorant Garamond + Montserrat (woff2, licence OFL)
├── produits/               emplacement des futures photos produits
└── audio/                  emplacement de la future musique
```

Aucune ressource distante n'est utilisée au rendu : les polices, les visuels et les éventuels fichiers audio sont tous locaux.

## Ressources à remplacer quand les vrais produits seront disponibles

1. **Les produits** sont des illustrations vectorielles génériques : un flacon compte-gouttes, un flacon pompe, un pot et un tube. Ce **ne sont pas** les produits définitifs de BAOBÉLIA. Pour les remplacer :
   - déposez des photos détourées (PNG transparent, produit vertical, cadrage serré au ras du produit) dans `public/produits/` ;
   - renseignez leurs chemins dans `src/config/assets.ts` → `PRODUCT_IMAGES`, par exemple `serum: "produits/serum.png"`.

   Les photos prennent alors automatiquement la place des illustrations dans toutes les scènes, avec les ombres et les animations conservées. Les reflets lumineux animés ne s'appliquent qu'aux illustrations vectorielles.
2. **Le logo** est une composition typographique (Cormorant Garamond). Si un logo officiel est validé, remplacez le contenu de `src/components/BrandLogo.tsx` (et le nom imprimé sur les étiquettes via `BRAND_NAME` dans `src/config/texts.ts`).
3. **La musique** : aucune piste fournie, la vidéo est exportée sans son. Déposez un fichier sous licence dans `public/audio/` (ex. `musique.mp3`), puis renseignez `MUSIC.file = "audio/musique.mp3"` dans `src/config/assets.ts`. Le fondu d'entrée et de sortie est automatique.
4. **Les textes**, **les couleurs** et **les durées** se modifient respectivement dans `config/texts.ts`, `config/theme.ts` et `config/video.ts`.

## Zones de sécurité mobiles

Les textes, le logo et l'appel à l'action restent entre y = 280 et y = 700 environ, et entre x ≈ 170 et x ≈ 910. Ils sont donc hors des zones couvertes par l'interface de Reels et de TikTok : le nom du compte et la légende en bas (420 px), les icônes à droite (150 px) et la barre du haut (250 px). Les produits peuvent descendre dans la zone basse sans gêner la lecture.

## Contenu volontairement absent

Conformément au brief, la vidéo ne contient aucun avis client, aucun avant/après, aucune certification, aucun ingrédient ni aucune composition, aucun prix et aucune promesse thérapeutique. Les étiquettes des flacons ne portent que le nom de la marque.
