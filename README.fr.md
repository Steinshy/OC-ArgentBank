<h1 align="center">Argent Bank — Tableau de bord bancaire</h1>

<p align="center"><strong>Langues :</strong> <a href="README.md">English</a> | <a href="README.fr.md">Français</a></p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19+-61DAFB?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js" alt="Node.js" /></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-8+-646CFF?style=flat-square&logo=vite" alt="Vite" /></a>
  <a href="https://redux-toolkit.js.org"><img src="https://img.shields.io/badge/Redux_Toolkit-2+-764ABC?style=flat-square&logo=redux" alt="Redux Toolkit" /></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://github.com/steinshy/ArgentBank"><img src="https://img.shields.io/badge/Statut-Actif-brightgreen?style=flat-square" alt="Statut" /></a>
</p>

## 📋 Présentation

Argent Bank est une application web complète de tableau de bord bancaire : connexion, profil et consultation des transactions. Le frontend repose sur **React 19**, **TypeScript**, **Vite** et **Redux Toolkit** (slice d’authentification + couche de type RTK Query). Le backend est **Express** + **MongoDB** avec authentification JWT et documentation Swagger.

### Périmètre actuel

- ✅ Authentification JWT (connexion, inscription) et routes protégées
- ✅ Lecture et mise à jour du profil utilisateur
- ✅ Interface liste et détail des transactions avec édition catégorie/notes
- ✅ Mode mock sans API réelle (`VITE_USE_MOCK=true`)
- ⏳ Routes REST comptes/transactions : le frontend appelle des chemins sous `/api/v1/user/...` ; vérifier que `Backend/routes` correspond à votre déploiement (voir `Backend/swagger.yaml`)

## 🚀 Démarrage

### Prérequis

- Node.js 18+ et npm
- MongoDB (local ou distant) pour le backend
- API backend sur le port **3001** (ou adapter `VITE_API_BASE_URL`)

### Installation

```bash
git clone https://github.com/steinshy/ArgentBank.git
cd ArgentBank
npm install

cp .env.example .env.local
# VITE_API_BASE_URL=http://localhost:3001
# VITE_USE_MOCK=false

cd Backend
npm install
cp .env.example .env
# DATABASE_URL, JWT_SECRET / SECRET_KEY, PORT=3001

npm run populate-db
cd ..
```

### Lancer le projet

```bash
# Frontend seul (http://localhost:5173)
npm run dev

# Backend seul (depuis Backend/)
npm run dev:server

# Frontend + backend (arrête d’autres processus Vite/nodemon au préalable)
npm run dev:all
```

### Build et qualité

```bash
npm run build
npm run preview
npm run type-check
npm run lint
npm run lint:fix
npm run lint:styles
npm run format:check
```

## 📁 Structure du projet

```
src/
├── api/                 # Client fetch + slice RTK Query (argentBankApi)
├── components/          # Layout, ProtectedRoute, Toast, Loader, ErrorBoundary, …
├── constants/           # Routes, points de terminaison API, constantes UI
├── features/            # Slices Redux et thunks (ex. Auth)
├── helpers/             # Validateurs
├── hooks/               # useAuth, …
├── mocks/               # Données mock en mémoire (auth, comptes, utilisateurs)
├── pages/               # Home, SignIn, Register, Profile, Settings, Transactions, …
├── store/               # Configuration du store Redux
├── types/               # Contrats TypeScript partagés (API + UI)
└── utils/               # Stockage, erreurs, accessibilité

Backend/
├── server.js            # Point d’entrée Express
├── routes/              # Routes HTTP (ex. /api/v1/user)
├── controllers/         # Contrôleurs
├── services/            # Logique métier (auth, utilisateur)
├── middleware/          # Validation JWT
├── database/            # Connexion et modèles Mongoose
├── swagger.yaml         # Spec OpenAPI (Swagger UI en dev)
└── scripts/             # populateDatabase, …
```

## 🎯 Fonctionnalités clés

### Authentification et navigation

- Connexion et inscription avec persistance du JWT (stockage local)
- Routes protégées pour le profil, les réglages et les transactions
- Mise en page et navigation centralisées

### Espace utilisateur

- Profil : chargement et mise à jour du prénom/nom
- Page réglages (placeholder)
- Transactions : liste par compte, détail, édition catégorie/notes (mock ou API selon l’environnement)

### Modes de données

- **Mode API** (`VITE_USE_MOCK=false`) : appels HTTP vers `VITE_API_BASE_URL`
- **Mode mock** (`VITE_USE_MOCK=true`) : données en mémoire pour démos et déploiements type GitHub Pages

## 📚 Documentation

- **[Notes d’architecture →](./docs/ARCHITECTURE.md)** — ADR et choix structurels
- **Swagger UI** (hors production) : `http://localhost:3001/api-docs`
- **Détails backend** → [Backend/README.md](./Backend/README.md)
- **Exemples d’API** → [Backend/API_TESTING.md](./Backend/API_TESTING.md), [Backend/HTTPIE_DESKTOP.md](./Backend/HTTPIE_DESKTOP.md)

## 🔌 Intégration API

### Auth et profil (implémenté dans `Backend/routes/userRoutes.js`)

```typescript
POST /api/v1/user/signup
→ Corps : email, password, firstName, lastName

POST /api/v1/user/login
→ Corps : email, password → JWT dans le corps de la réponse

POST /api/v1/user/profile   (Authorization: Bearer <token>)
→ Retourne le profil dans le corps de la réponse

PUT /api/v1/user/profile
→ Corps : firstName, lastName
```

### Comptes et transactions (contrat frontend)

Le SPA appelle notamment `GET /api/v1/user/accounts/:accountId/transactions` et `PATCH` sur une ressource transaction lorsque le mock est désactivé. C’est décrit dans `Backend/swagger.yaml` ; branchez ou étendez `Backend/routes` selon votre implémentation.

### Mock vs API réelle

**Mock**

```bash
# .env.local
VITE_USE_MOCK=true
```

**API réelle**

```bash
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3001
```

## 🛠️ Lignes directrices de développement

### Flux de données

1. Les thunks d’auth mettent à jour le slice Redux (token, id utilisateur).
2. Les endpoints `argentBankApi` utilisent `apiCall` (wrapper fetch) ou les mocks selon `USE_MOCK`.
3. Les pages consomment les hooks RTK Query et/ou `useAuth`.

### Ajouter des fonctionnalités

- Pages dans `src/pages/`, routes dans `src/App.tsx` via `ROUTES` dans `src/constants/`.
- Nouveaux flux asynchrones : privilégier `createAsyncThunk` pour l’auth ; étendre `src/api/argentBankApi.ts` pour l’état serveur mis en cache.
- Types par endpoint dans `src/types/index.ts`.

### Normes de code

- TypeScript strict, pas de `any`
- Composants fonctionnels ; UI partagée dans `src/components/`
- Styles : `Component/styles/Component.css` à côté du composant

## 🔄 Modèles de données

```typescript
// Profil (corps API)
UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
}

// Transactions (éléments de liste)
Transaction {
  id: string
  date: string
  description: string
  amount: number
  balance: number
  type: TransactionType
  category: string
  notes?: string
}
```

## 🌍 Navigateurs supportés

- Navigateurs récents (modules ES)
- Tableau de bord orienté desktop ; mise en page responsive là où elle est prévue

## 📝 Dépendances (vue d’ensemble)

| Domaine | Paquets                                         |
| ------- | ----------------------------------------------- |
| UI      | React 19, React Router 7, Lucide React          |
| État    | Redux Toolkit, React Redux                      |
| HTTP    | Fetch via `src/api/client.ts`                   |
| Build   | Vite 8, TypeScript, ESLint, Prettier, Stylelint |
| Backend | Express 5, Mongoose, JWT, bcrypt, Swagger UI    |

## 📚 Scripts disponibles

| Commande               | Rôle                                                      |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Serveur de dev Vite                                       |
| `npm run dev:all`      | Frontend + backend (arrête d’autres Vite/nodemon d’abord) |
| `npm run build`        | Build production dans `dist/`                             |
| `npm run preview`      | Prévisualiser le build                                    |
| `npm run type-check`   | `tsc --noEmit`                                            |
| `npm run lint`         | ESLint sur `src/`                                         |
| `npm run lint:fix`     | ESLint avec correctifs                                    |
| `npm run lint:styles`  | Stylelint sur CSS/SCSS                                    |
| `npm run format`       | Prettier en écriture                                      |
| `npm run format:check` | Vérification Prettier                                     |

## 🚀 Déploiement

```bash
npm run build
```

Servir le dossier `dist/` derrière n’importe quel hébergeur statique ; définir `VITE_API_BASE_URL` et `VITE_BASE_PATH` au moment du build selon l’environnement.

## 🧪 Tests manuels

| Email              | Mot de passe  |
| ------------------ | ------------- |
| `tony@stark.com`   | `password123` |
| `steve@rogers.com` | `password456` |

Création des utilisateurs avec `npm run populate-db` dans `Backend/`.

---

**Réalisé avec React, TypeScript, Redux Toolkit et Express**
