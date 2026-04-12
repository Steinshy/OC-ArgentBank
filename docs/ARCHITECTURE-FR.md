# Architecture

<p align="center"><strong>Langues :</strong> <a href="ARCHITECTURE.md">English</a> | <a href="ARCHITECTURE-FR.md">Français</a></p>

Ce document décrit la structure du projet Argent Bank et consigne les principales décisions d’architecture (ADR, _Architecture Decision Records_).

## Vue d’ensemble du système

Le produit est une **application monopage** (Vite + React 19 + TypeScript) qui dialogue avec une **API REST** (Express + MongoDB + Mongoose). Le navigateur conserve un **JWT** après la connexion ; les écrans protégés exigent un jeton valide et un profil utilisateur chargé.

```text
Navigateur (React)
  ├─ Store Redux : slice auth (token, indicateurs de session)
  ├─ Slice API RTK Query : profil + transactions (état serveur mis en cache)
  └─ fetch via api/client.ts ──► Express /api/v1/user/* ──► MongoDB
```

**Authentification vs état serveur**

- **Connexion / inscription / déconnexion** passent par `createAsyncThunk` dans `authThunks.ts` et mettent à jour `authSlice`. Les jetons sont persistés via `utils/storage.ts` (localStorage).
- **Profil et transactions** utilisent une instance RTK Query `createApi` (`argentBankApi.ts`) avec `fakeBaseQuery` : chaque endpoint exécute un `queryFn` qui appelle soit `apiCall`, soit des mocks en mémoire lorsque `VITE_USE_MOCK=true`.
- **`setupListeners(store.dispatch)`** dans `main.tsx` active le rechargement RTK Query au retour au focus / à la reconnexion.

**Routes protégées**

`ProtectedRoute` exige `isAuthenticated`, attend `useGetProfileQuery`, affiche un indicateur de chargement pendant la requête et déclenche `logoutUser` si la récupération du profil échoue (jeton invalide ou expiré).

---

## Arborescence du dépôt (état actuel)

```text
src/
├── api/              # apiCall (fetch) + argentBankApi (RTK Query)
├── components/       # Layout, ProtectedRoute, Toast, Loader, ErrorBoundary, …
├── constants/        # api.ts, routes.ts, ui.ts (+ réexport index.ts)
├── features/Auth/    # authSlice.ts, authThunks.ts (seul slice « feature » aujourd’hui)
├── helpers/          # p. ex. validateur
├── hooks/            # useAuth (compose slice + hooks profil)
├── mocks/            # mockAuthApi, comptes/utilisateurs fictifs pour USE_MOCK
├── pages/            # Écrans de route (Home, SignIn, Register, Profile, …)
├── store/            # configureStore, hooks typés
├── types/            # Types TS partagés + env.d.ts
└── utils/            # storage, errorHandler, aria, …

Backend/
├── server.js         # App Express, CORS, JSON, routes /api/v1/user, Swagger (hors prod)
├── routes/           # userRoutes → signup, login, profil (POST lecture, PUT mise à jour)
├── controllers/      # Adaptateurs HTTP
├── services/         # Auth, JWT, persistance utilisateur
├── middleware/       # Validation JWT
├── database/         # connexion + modèles Mongoose
└── swagger.yaml      # OpenAPI (peut décrire des endpoints au-delà des routes actuelles)
```

---

## ADR-001 : Redux Toolkit pour l’état d’authentification

**Statut :** Accepté  
**Date :** mars 2026

### Contexte

L’application doit accéder de façon globale et synchrone à l’état de session (token, chargement, erreurs) depuis la mise en page et les formulaires d’auth.

### Décision

Utiliser **Redux Toolkit** uniquement pour le domaine **auth** (`authSlice` + `authThunks`). Utiliser `useAppDispatch` / `useAppSelector` typés depuis `store/store.ts`.

### Justification

- Mises à jour prévisibles pour connexion, inscription et déconnexion
- `createAsyncThunk` convient aux flux requête/réponse avec pending/fulfilled/rejected
- DevTools et TypeScript s’intègrent proprement

### Conséquences

- Tout l’état serveur ne vit pas dans des slices « simples » : profil et transactions passent par RTK Query (voir ADR-011).
- Les développeuses et développeurs doivent maîtriser à la fois l’auth par thunks et les ressources par requêtes.

---

## ADR-002 : Dossiers par fonctionnalité (approche progressive)

**Statut :** Accepté  
**Date :** mars 2026 (mis à jour avril 2026)

### Contexte

Le code doit rester navigable à mesure que les fonctionnalités grossissent.

### Décision

Placer les slices Redux liés à un domaine dans des **dossiers feature sous `src/features/`**. L’UI partagée reste dans `components/`, les écrans routés dans `pages/`, les primitives HTTP dans `api/`.

**État actuel :** `features/Auth/` et `features/Transactions/` existent. Chaque feature encapsule sa logique métier, avec l’UI et les hooks des transactions co-localisés sous `features/Transactions/`.

### Justification

- Emplacement clair pour les slices et thunks spécifiques au domaine
- La co-localisation conserve la logique connexe ensemble à mesure que les features évoluent

### Conséquences

- Les nouveaux domaines doivent suivre le même motif : créer un dossier feature sous `src/features/` lorsque la complexité du domaine le justifie.

---

## ADR-003 : Constantes centralisées

**Statut :** Accepté  
**Date :** mars 2026 (mis à jour avril 2026)

### Contexte

Les chemins de route, les chemins d’API et les textes visibles ne doivent pas être dupliqués en chaînes brutes.

### Décision

Centraliser la configuration dans `src/constants/` :

| Fichier     | Rôle |
| ----------- | ---- |
| `api.ts`    | `API_BASE_URL`, `API_ENDPOINTS`, `USE_MOCK`, `API_CONFIG` |
| `routes.ts` | `ROUTES`, `buildTransactionsRoute` |
| `ui.ts`     | Libellés, messages, textes de navigation, catégories/types de transaction, cartes d’accueil |

Réexporter depuis `constants/index.ts` pour `import { … } from '@/constants'`.

### Justification

- Source unique de vérité ; refactorisations plus sûres
- L’usage des variables d’environnement `VITE_*` est regroupé à côté des sujets API

### Conséquences

- De nouveaux domaines peuvent justifier de nouveaux fichiers (p. ex. `validation.ts`) plutôt que d’alourdir indéfiniment `ui.ts`.

---

## ADR-004 : Couche de stockage légère

**Statut :** Accepté  
**Date :** avril 2026

### Contexte

Le JWT doit survivre aux rechargements sans disperser les accès à `localStorage`.

### Décision

Utiliser `src/utils/storage.ts` avec `getAuthToken`, `setAuthToken`, `removeAuthToken`. La clé est pour l’instant la chaîne littérale `'authToken'`.

### Justification

- Un seul endroit pour modifier la persistance ou ajouter des garde-fous plus tard
- Les thunks et les reducers du slice restent centrés sur les transitions d’état

### Conséquences

- La clé de stockage **n’est pas** encore réexportée depuis `constants/` ; envisager l’alignement avec l’ADR-003 si plusieurs modules ont besoin de cette chaîne.

---

## ADR-005 : Client API basé sur fetch (sans Axios)

**Statut :** Accepté  
**Date :** mars 2026

### Contexte

Le SPA doit appeler des endpoints REST JSON avec en-tête `Authorization` optionnel et timeouts.

### Décision

Implémenter `apiCall` dans `src/api/client.ts` avec **`fetch` natif** : en-têtes JSON par défaut, injection du bearer, `AbortController` + `API_CONFIG.TIMEOUT`, réponses non OK traitées via `handleHttpError`.

### Justification

- Pas de dépendance HTTP supplémentaire ; bundle plus léger
- Les génériques sur `apiCall<T>` documentent la forme des réponses attendues aux points d’appel

### Conséquences

- Pas d’intercepteurs façon Axios ; chaque appelant gère les erreurs métier (thunks / `queryFn` via `extractErrorMessage`).

---

## ADR-006 : Error boundary à la racine

**Statut :** Accepté  
**Date :** avril 2026

### Contexte

Les erreurs de rendu non capturées ne doivent pas laisser toute l’application vide sans retour utilisateur.

### Décision

Envelopper l’arbre avec `components/ErrorBoundary/ErrorBoundary.tsx` **à l’extérieur** de `Provider` et `BrowserRouter` dans `App.tsx`, afin que la boundary puisse toujours afficher un repli si les fournisseurs internes échouent.

### Justification

- L’API de boundary en classe reste requise pour ce cas d’usage dans React
- Prop de rendu `fallback` optionnelle pour plus de souplesse

### Conséquences

- Ne capture pas les erreurs dans les gestionnaires d’événements ou le code asynchrone, sauf si elles remontent jusqu’au rendu.

---

## ADR-007 : CSS global et co-localisé

**Statut :** Accepté  
**Date :** mars 2026 (mis à jour avril 2026)

### Contexte

Le style doit rester maintenable sans adopter une pile CSS-in-JS.

### Décision

- Les **jetons globaux** et règles de base vivent dans `src/index.css` sous `:root` (couleurs, rayons, anneau de focus, breakpoints documentés en commentaires).
- Les styles **composant** sont co-localisés : `ComponentName/styles/ComponentName.css`.
- **Stylelint** impose la cohérence (`npm run lint:styles`).

### Justification

- Correspond aux livrables de type OpenClassrooms et à un déploiement simple
- Les variables CSS facilitent le thème

### Conséquences

- Les noms de classes sont globaux ; s’appuyer sur du type BEM ou des préfixes par composant si nécessaire.

---

## ADR-008 : Alias de chemin `@/`

**Statut :** Accepté  
**Date :** mars 2026

### Contexte

Les imports relatifs profonds sont fragiles quand les fichiers bougent.

### Décision

Mapper `@/*` → `src/*` dans **`tsconfig`** et **`vite.config.ts`** (`resolve.alias`).

### Justification

- Imports homogènes entre pages, api et tests

### Conséquences

- Les outils hors Vite (p. ex. certains lanceurs de tests) doivent résoudre le même alias.

---

## ADR-009 : `useAuth` comme hook d’auth principal

**Statut :** Accepté  
**Date :** avril 2026 (mis à jour avril 2026)

### Contexte

Les écrans ont besoin du token, du nom affiché, de la connexion, de la déconnexion et des mises à jour de profil sans répéter les sélecteurs.

### Décision

Implémenter **`useAuth`** dans `hooks/useAuth.ts` : lit le slice `auth`, s’abonne à `useGetProfileQuery` (ignoré hors session), expose `updateProfile` via `useUpdateProfileMutation`, et encapsule le dispatch de `signInUser` / `logoutUser`.

### Justification

- Point d’entrée unique pour « qui est connecté » + données de profil
- Encapsule la composition RTK Query + slice

### Conséquences

- Il n’existe **pas** de hook séparé `useTransactions` ; les pages transactions utilisent directement les hooks RTK Query (`useGetTransactionsQuery`, etc.).

---

## ADR-010 : Variables d’environnement Vite

**Statut :** Accepté  
**Date :** mars 2026

### Contexte

L’URL de base de l’API, le chemin de base optionnel pour GitHub Pages et le mode mock doivent varier selon l’environnement.

### Décision

Utiliser les variables d’environnement Vite avec le **préfixe `VITE_`** pour le code client. Documenter les clés attendues dans `.env.example`. Déclarer les types dans `src/types/env.d.ts` (`VITE_API_BASE_URL`, `VITE_BASE_PATH`, `VITE_USE_MOCK`).

### Justification

- Flux Vite standard ; valeurs injectées au moment du build

### Conséquences

- Modifier l’environnement impose une reconstruction des bundles de production.

---

## ADR-011 : Slice API RTK Query pour profil et transactions

**Statut :** Accepté  
**Date :** avril 2026

### Contexte

Les données de profil et de transaction profitent du cache, de l’invalidation par tags et d’une sémantique commune de chargement / erreur. Les seuls thunks d’auth dupliqueraient cette logique.

### Décision

Définir **`argentBankApi`** avec `createApi`, `reducerPath: 'argentBankApi'`, `fakeBaseQuery`, et des endpoints implémentés via **`queryFn`** :

- `getProfile` / `updateProfile` — POST/PUT profil ; branche mock via `mockAuthApi`
- `getTransactions` / `patchTransaction` — GET/PATCH ressources transaction ; branche mock qui mute `MOCK_ACCOUNTS`

Enregistrer `argentBankApi.reducer` et `argentBankApi.middleware` dans `store.ts`. Appeler **`argentBankApi.util.resetApiState()`** à la déconnexion pour vider le cache utilisateur.

### Justification

- S’aligne sur les usages de l’écosystème Redux Toolkit
- Garde le jeton dans le slice tandis que les entités serveur restent cachables

### Conséquences

- Il faut comprendre les options `skip` (p. ex. chargement du profil seulement si authentifié).
- `App.tsx` précharge le profil lorsque l’utilisateur est connecté pour alimenter layout / navigation.

---

## ADR-012 : Backend fictif optionnel (`VITE_USE_MOCK`)

**Statut :** Accepté  
**Date :** avril 2026

### Contexte

Les démos et l’hébergement statique doivent fonctionner sans MongoDB ni Express.

### Décision

Lorsque `import.meta.env.VITE_USE_MOCK === 'true'`, les **thunks d’auth** et les **`queryFn` de `argentBankApi`** lisent/écrivent **`src/mocks`** au lieu d’appeler `apiCall`.

### Justification

- Même UI et mêmes chemins Redux en dev et en builds de démo
- Bascule explicite à la frontière API

### Conséquences

- Les données fictives peuvent diverger de `swagger.yaml` ; traiter les mocks comme **test de contrat** pour l’UI, pas comme référence de l’API de production.

---

## ADR-013 : Découpage en couches du backend (Express)

**Statut :** Accepté  
**Date :** avril 2026

### Contexte

L’API doit rester testable et extensible pour le cours et la maintenance.

### Décision

Suivre **route → controller → service → model** dans `Backend/` :

- Les **routes** déclarent les chemins et attachent le middleware (p. ex. validation JWT).
- Les **controllers** lisent les requêtes et renvoient les réponses HTTP.
- Les **services** concentrent bcrypt/JWT et la logique métier.
- Les **modèles Mongoose** définissent la persistance.

Exposer **Swagger UI** sur `/api-docs` lorsque `NODE_ENV !== 'production'`, alimenté par `swagger.yaml`.

### Justification

- Cohérent avec les usages Express courants et les attentes du projet OpenClassrooms
- Emplacement clair pour ajouter plus tard des routes comptes/transactions si la spec dépasse `userRoutes.js` actuel

### Conséquences

- `swagger.yaml` peut décrire des endpoints pas encore branchés dans `routes/` ; garder doc et code alignés lors des livraisons.

---

## Notes sur la chaîne de build

- **Vite 8** avec `@vitejs/plugin-react`, minification **oxc**, **rollup-plugin-visualizer** optionnel en build production (`dist/stats.html`).
- **vite-plugin-checker** exécute la vérification TypeScript en développement.
- **ESLint** + **Prettier** + **Stylelint** — voir les scripts dans `package.json` à la racine.

---

## Pistes futures

1. **Tests** — Tests unitaires pour thunks/reducers et tests d’intégration pour `ProtectedRoute` + slice API ; Playwright optionnel pour les parcours critiques.
2. **Parité API** — Implémenter ou retirer des entrées `swagger.yaml` pour que comptes/transactions correspondent aux routes de production.
3. **i18n** — Si besoin, faire transiter les chaînes de `constants/ui.ts` par une bibliothèque (p. ex. react-i18next).
4. **Découpage au niveau des routes** — `React.lazy` pour les pages lourdes si le bundle grossit.
5. **Centraliser la clé `authToken`** — Déplacer le littéral vers `constants/` si plusieurs modules en ont besoin.
