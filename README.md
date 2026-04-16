<h1 align="center">Argent Bank — Financial Dashboard</h1>

<p align="center"><strong>Languages:</strong> <a href="README.md">English</a> | <a href="README.fr.md">Français</a></p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19+-61DAFB?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js" alt="Node.js" /></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-8+-646CFF?style=flat-square&logo=vite" alt="Vite" /></a>
  <a href="https://redux-toolkit.js.org"><img src="https://img.shields.io/badge/Redux_Toolkit-2+-764ABC?style=flat-square&logo=redux" alt="Redux Toolkit" /></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://github.com/steinshy/ArgentBank"><img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status" /></a>
</p>

<p align="center">
  <img src="public\assets\mockup\mockup.png" alt="Argent-Bank responsive mockup" width="1024" />
</p>

## 📋 Overview

Argent Bank is a full-stack banking dashboard SPA: users sign in, manage their profile, and browse account transactions. The frontend is **React 19 + TypeScript + Vite** with **Redux Toolkit** (auth slice + RTK Query-style API layer). The backend is **Express** + **MongoDB** with JWT auth and Swagger docs.

### Current Scope

- ✅ JWT authentication (login, register) with protected routes
- ✅ User profile read/update
- ✅ Transaction list and detail UI with category/notes editing
- ⏳ Account/transaction REST routes: frontend targets paths under `/api/v1/user/...`; ensure `Backend/routes` matches your deployment (see `Backend/swagger.yaml`)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or remote) when running the backend
- Backend running on port **3001** (or set `VITE_API_BASE_URL` accordingly)

### Installation

```bash
git clone https://github.com/steinshy/ArgentBank.git
cd ArgentBank
npm install

cp .env.example .env.local
# VITE_API_BASE_URL=http://localhost:3001

cd Backend
npm install
cp .env.example .env
# DATABASE_URL, JWT_SECRET / SECRET_KEY, PORT=3001

npm run populate-db
cd ..
```

### Run

```bash
# Frontend only (http://localhost:5173)
npm run dev

# Backend only (from Backend/)
npm run dev:server

# Frontend + backend (stops other Vite/nodemon processes first)
npm run dev:all
```

### Build & quality

```bash
npm run build
npm run preview
npm run type-check
npm run lint
npm run lint:fix
npm run lint:styles
npm run format:check
```

## 📁 Project Structure

```
src/
├── api/                 # fetch client + RTK Query API slice (argentBankApi)
├── components/          # Layout, ProtectedRoute, Toast, Loader, ErrorBoundary, …
├── constants/           # Routes, API endpoints, UI constants
├── features/            # Redux slices & thunks (Auth, Transactions)
├── helpers/             # Validators
├── hooks/               # useAuth, …
├── pages/               # Home, SignIn, Register, Profile, Settings, Transactions, …
├── store/               # Redux store configuration
├── types/               # Shared TypeScript contracts (API + UI)
└── utils/               # Storage, errors, a11y helpers

Backend/
├── server.js            # Express entry
├── routes/              # HTTP routes (e.g. /api/v1/user)
├── controllers/         # Request handlers
├── services/            # Auth & user logic
├── middleware/          # JWT validation
├── database/            # Connection + Mongoose models
├── swagger.yaml         # OpenAPI spec (Swagger UI in dev)
└── scripts/             # populateDatabase, …
```

## 🎯 Key Features

### Authentication & routing

- Sign in and register with JWT persistence (local storage)
- Protected routes for profile, settings, and transactions
- Central layout and navigation

### User area

- Profile: load and update first/last name
- Settings placeholder page
- Transactions: list by account, detail view, edit category/notes

## 📚 Documentation

- **[Architecture notes →](./docs/ARCHITECTURE.md)** — ADRs and structural decisions
- **Swagger UI** (non-production): `http://localhost:3001/api-docs`
- **Backend deep dive** → [Backend/README.md](./Backend/README.md)
- **API examples** → [Backend/API_TESTING.md](./Backend/API_TESTING.md), [Backend/HTTPIE_DESKTOP.md](./Backend/HTTPIE_DESKTOP.md)

## 🔌 API Integration

### Auth & profile (implemented in `Backend/routes/userRoutes.js`)

```typescript
POST /api/v1/user/signup
→ Body: email, password, firstName, lastName

POST /api/v1/user/login
→ Body: email, password → JWT in response body

POST /api/v1/user/profile   (Authorization: Bearer <token>)
→ Returns user profile in response body

PUT /api/v1/user/profile
→ Body: firstName, lastName
```

### Accounts & transactions (frontend contract)

The SPA calls paths such as `GET /api/v1/user/accounts/:accountId/transactions` and `PATCH` on a transaction resource. These are documented in `Backend/swagger.yaml`; wire or extend `Backend/routes` to match your backend implementation.

## 🛠️ Development Guidelines

### Data flow

1. Auth thunks update the Redux auth slice (token, user id).
2. `argentBankApi` endpoints use `apiCall` (fetch wrapper) to call the backend.
3. Pages consume hooks from RTK Query and/or `useAuth`.

### Adding features

- Pages under `src/pages/`, routes in `src/App.tsx` via `ROUTES` in `src/constants/`.
- New async flows: prefer `createAsyncThunk` for auth-style flows; extend `src/api/argentBankApi.ts` for cached server state.
- Types per endpoint in `src/types/index.ts`.

### Code standards

- TypeScript strict, no `any`
- Functional components; shared UI under `src/components/`
- Styles: `Component/styles/Component.css` next to the component

## 🔄 Data Models

```typescript
// Profile (API body)
UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
}

// Transactions (list items)
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

## 🌍 Browser Support

- Modern evergreen browsers (ES modules)
- Desktop-first dashboard; responsive layout where implemented

## 📝 Dependencies (high level)

| Area    | Packages                                        |
| ------- | ----------------------------------------------- |
| UI      | React 19, React Router 7, Lucide React          |
| State   | Redux Toolkit, React Redux                      |
| HTTP    | Fetch via `src/api/client.ts`                   |
| Build   | Vite 8, TypeScript, ESLint, Prettier, Stylelint |
| Backend | Express 5, Mongoose, JWT, bcrypt, Swagger UI    |

## 📚 Available Scripts

| Command                | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Vite dev server                                     |
| `npm run dev:all`      | Frontend + backend (stops other Vite/nodemon first) |
| `npm run build`        | Production build to `dist/`                         |
| `npm run preview`      | Preview production build                            |
| `npm run type-check`   | `tsc --noEmit`                                      |
| `npm run lint`         | ESLint on `src/`                                    |
| `npm run lint:fix`     | ESLint with fix                                     |
| `npm run lint:styles`  | Stylelint on CSS/SCSS                               |
| `npm run format`       | Prettier write                                      |
| `npm run format:check` | Prettier check                                      |

## 🚀 Deployment

```bash
npm run build
```

Serve the `dist/` folder behind any static host; set `VITE_API_BASE_URL` and `VITE_BASE_PATH` at build time for your environment.

## 🧪 Manual testing

| Email              | Password      |
| ------------------ | ------------- |
| `tony@stark.com`   | `password123` |
| `steve@rogers.com` | `password456` |

Create users with `npm run populate-db` in `Backend/`.

---

**Built with React, TypeScript, Redux Toolkit, and Express**
