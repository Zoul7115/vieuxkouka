# Déploiement sur Netlify

## Nature du projet

Ce projet n'est **pas** un SPA Vite classique : c'est une application
**TanStack Start (React 19 + Vite 7) en SSR**, compilée par Nitro.
Le build produit :

- `dist/client` → fichiers statiques (assets, images, audio, service workers)
- `dist/server` (ou `.netlify/`) → serveur SSR + routes API (`/api/public/*`)

Le routage (`/admin`, `/closeuse`, `/boutique`, `/anti-diabete`, …) est donc
géré côté serveur : pas de 404 au rechargement, à condition que le preset
Nitro `netlify` soit utilisé (voir `netlify.toml`).

## Build

```bash
npm install
npm run build     # vite build
```

- Node **20** (fixé par `.nvmrc` et `NODE_VERSION` dans `netlify.toml`)
- Aucun script de build spécifique, `npm run build` suffit
- `NITRO_PRESET=netlify` indique à Nitro de produire une fonction Netlify

## Variables d'environnement à recopier dans Netlify

### Obligatoires (front + SSR)

| Nom | Usage |
| --- | --- |
| `VITE_SUPABASE_URL` | URL du backend (client) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique anon (client) |
| `VITE_SUPABASE_PROJECT_ID` | Identifiant projet backend |
| `SUPABASE_URL` | Même URL, côté serveur (SSR / routes API) |
| `SUPABASE_PUBLISHABLE_KEY` | Même clé anon, côté serveur |

### Serveur uniquement (ne jamais préfixer `VITE_`)

| Nom | Usage |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Opérations admin serveur (`client.server.ts`, hook rapport hebdo) |

### Côté backend/fonctions (déjà stockées dans le backend, pas dans Netlify)

`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `FB_CAPI_TOKEN_5`
sont utilisées par les fonctions backend (push web, Facebook CAPI) et
restent configurées côté backend, pas sur Netlify.

## Vérifications faites

- Aucune clé/secret écrit en dur dans `src/` : tout passe par
  `import.meta.env.VITE_*` (client) ou `process.env.*` (serveur).
- Aucune dépendance runtime propre à Lovable (pas de `@lovable/ui`).
  Les composants UI sont shadcn/ui + Radix locaux dans `src/components/ui`.
  Seul `@lovable.dev/vite-tanstack-config` (devDependency, paquet npm public)
  sert au build : il regroupe les plugins Vite standards
  (tanstackStart, react, tailwind, tsconfig-paths, nitro).
- `src/integrations/supabase/previewAuthStorage.ts` contient une logique
  spécifique aux previews Lovable, mais elle est inerte hors de ces domaines
  (fallback `localStorage` standard).
