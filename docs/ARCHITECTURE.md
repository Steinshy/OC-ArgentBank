# Architecture

<p align="center"><strong>Languages:</strong> <a href="ARCHITECTURE.md">English</a> | <a href="ARCHITECTURE-FR.md">Français</a></p>

This document describes how the Argent Bank project is structured and records the main architectural decisions (ADRs).

## System overview

The product is a **single-page application** (Vite + React 19 + TypeScript) talking to a **REST API** (Express + MongoDB + Mongoose). The browser stores a **JWT** after login; protected screens require a valid token and a loadable user profile.

```text
Browser (React)
  ├─ Redux store: auth slice (token, session flags)
  ├─ RTK Query API slice: profile + transactions (cached server state)
  └─ fetch via api/client.ts ──► Express /api/v1/user/* ──► MongoDB
```

**Auth vs server state**

- **Login / register / logout** use `createAsyncThunk` in `authThunks.ts` and update `authSlice`. Tokens are persisted with `utils/storage.ts` (localStorage).
- **Profile and transactions** use an RTK Query `createApi` instance (`argentBankApi.ts`) with `fakeBaseQuery`: each endpoint runs `queryFn` that either calls `apiCall` or in-memory mocks when `VITE_USE_MOCK=true`.
- **`setupListeners(store.dispatch)`** in `main.tsx` enables refetch-on-focus/reconnect behavior for RTK Query.

**Protected routes**

`ProtectedRoute` requires `isAuthenticated`, waits for `useGetProfileQuery`, shows a spinner while loading, and dispatches `logoutUser` if the profile request fails (invalid/expired token).

---

## Repository layout (current)

```text
src/
├── api/              # apiCall (fetch) + argentBankApi (RTK Query)
├── components/       # Layout, ProtectedRoute, Toast, Loader, ErrorBoundary, …
├── constants/        # api.ts, routes.ts, ui.ts (+ re-export index.ts)
├── features/Auth/    # authSlice.ts, authThunks.ts (only feature slice today)
├── helpers/          # e.g. validator
├── hooks/            # useAuth (composes slice + profile hooks)
├── mocks/            # mockAuthApi, mock accounts/users for USE_MOCK
├── pages/            # Route-level screens (Home, SignIn, Register, Profile, …)
├── store/            # configureStore, typed hooks
├── types/            # Shared TS types + env.d.ts
└── utils/            # storage, errorHandler, aria, …

Backend/
├── server.js         # Express app, CORS, JSON, /api/v1/user routes, Swagger (non-prod)
├── routes/           # userRoutes → signup, login, profile (POST get, PUT update)
├── controllers/      # HTTP adapters
├── services/         # Auth, JWT, user persistence
├── middleware/       # JWT validation
├── database/         # connection + Mongoose models
└── swagger.yaml      # OpenAPI (may describe endpoints beyond current routes)
```

---

## ADR-001: Redux Toolkit for authentication state

**Status:** Accepted  
**Date:** March 2026

### Context

The app needs global, synchronous access to session state (token, loading, errors) across the layout and auth forms.

### Decision

Use **Redux Toolkit** for the **auth** domain only (`authSlice` + `authThunks`). Use typed `useAppDispatch` / `useAppSelector` from `store/store.ts`.

### Rationale

- Predictable updates for sign-in, sign-up, and logout
- `createAsyncThunk` fits request/response flows with pending/fulfilled/rejected
- DevTools and TypeScript integrate cleanly

### Consequences

- Not all server state lives in plain slices: profile and transactions use RTK Query (see ADR-011).
- Developers must know both thunk-based auth and query-based resources.

---

## ADR-002: Feature-based folders (incremental)

**Status:** Accepted  
**Date:** March 2026 (updated April 2026)

### Context

The codebase should stay navigable as features grow.

### Decision

Use **feature folders under `src/features/`** for Redux slices tied to a domain. Shared UI stays in `components/`, routes in `pages/`, HTTP primitives in `api/`.

**Current state:** `features/Auth/` and `features/Transactions/` exist. Each feature encapsulates its domain logic, with transaction UI and hooks co-located under `features/Transactions/`.

### Rationale

- Clear place for domain-specific slices and thunks
- Co-locations keep related logic together as features evolve

### Consequences

- New domains should follow the same pattern: create a feature folder under `src/features/` when the domain complexity justifies it.

---

## ADR-003: Centralized constants

**Status:** Accepted  
**Date:** March 2026 (updated April 2026)

### Context

Route paths, API paths, and user-visible copy should not be duplicated as raw strings.

### Decision

Centralize configuration in `src/constants/`:

| File        | Role |
| ----------- | ---- |
| `api.ts`    | `API_BASE_URL`, `API_ENDPOINTS`, `USE_MOCK`, `API_CONFIG` |
| `routes.ts` | `ROUTES`, `buildTransactionsRoute` |
| `ui.ts`     | Labels, messages, nav copy, transaction categories/types, home feature cards |

Re-export from `constants/index.ts` for `import { … } from '@/constants'`.

### Rationale

- Single source of truth; safer refactors
- `VITE_*` env usage is concentrated next to API concerns

### Consequences

- New domains may justify new files (e.g. `validation.ts`) rather than growing `ui.ts` indefinitely.

---

## ADR-004: Thin storage helper

**Status:** Accepted  
**Date:** April 2026

### Context

The JWT must persist across reloads without scattering `localStorage` access.

### Decision

Use `src/utils/storage.ts` with `getAuthToken`, `setAuthToken`, `removeAuthToken`. The key is currently the literal `'authToken'`.

### Rationale

- One place to change persistence or add guards later
- Thunks and slice reducers can stay focused on state transitions

### Consequences

- The storage key is **not** yet re-exported from `constants/`; consider aligning with ADR-003 if multiple modules need the key string.

---

## ADR-005: Fetch-based API client (no Axios)

**Status:** Accepted  
**Date:** March 2026

### Context

The SPA must call JSON REST endpoints with optional `Authorization` and timeouts.

### Decision

Implement `apiCall` in `src/api/client.ts` using **native `fetch`**: default JSON headers, bearer token injection, `AbortController` + `API_CONFIG.TIMEOUT`, non-OK responses handled via `handleHttpError`.

### Rationale

- No extra HTTP dependency; small bundle
- Generics on `apiCall<T>` document expected response shapes at call sites

### Consequences

- No Axios-style interceptors; each caller handles domain errors (thunks / `queryFn` use `extractErrorMessage`).

---

## ADR-006: Error boundary at the root

**Status:** Accepted  
**Date:** April 2026

### Context

Uncaught render errors should not blank the entire app without feedback.

### Decision

Wrap the tree in `components/ErrorBoundary/ErrorBoundary.tsx` **outside** `Provider` and `BrowserRouter` in `App.tsx` so the boundary can still render a fallback if inner providers fail.

### Rationale

- Class-based boundary API is still required for this concern in React
- Optional custom `fallback` render prop for flexibility

### Consequences

- Does not catch errors inside event handlers or async code unless they propagate to render.

---

## ADR-007: Global and co-located CSS

**Status:** Accepted  
**Date:** March 2026 (updated April 2026)

### Context

Styling should stay maintainable without adopting a CSS-in-JS stack.

### Decision

- **Global** tokens and base rules live in `src/index.css` under `:root` (colors, radii, focus ring, breakpoints documented in comments).
- **Component** styles live beside components: `ComponentName/styles/ComponentName.css`.
- **Stylelint** enforces consistency (`npm run lint:styles`).

### Rationale

- Matches OpenClassrooms-style deliverables and simple deployment
- Design tokens via CSS variables are easy to theme

### Consequences

- Class names are global; rely on BEM-style or prefixed naming per component where needed.

---

## ADR-008: Path alias `@/`

**Status:** Accepted  
**Date:** March 2026

### Context

Deep relative imports are brittle when files move.

### Decision

Map `@/*` → `src/*` in **both** `tsconfig` and `vite.config.ts` (`resolve.alias`).

### Rationale

- Consistent imports across pages, api, and tests

### Consequences

- Tooling outside Vite (e.g. some test runners) must resolve the same alias.

---

## ADR-009: `useAuth` as the primary auth hook

**Status:** Accepted  
**Date:** April 2026 (updated April 2026)

### Context

Screens need token state, user display name, sign-in, logout, and profile updates without repeating selectors.

### Decision

Implement **`useAuth`** in `hooks/useAuth.ts`: reads `auth` slice, subscribes to `useGetProfileQuery` (skipped when logged out), exposes `updateProfile` from `useUpdateProfileMutation`, and wraps `signInUser` / `logoutUser` dispatch.

### Rationale

- Single entry point for “who is logged in” + profile data
- Encapsulates RTK Query + slice composition

### Consequences

- There is **no** separate `useTransactions` hook; transaction pages use RTK Query hooks (`useGetTransactionsQuery`, etc.) directly.

---

## ADR-010: Vite environment variables

**Status:** Accepted  
**Date:** March 2026

### Context

API base URL, optional GitHub Pages base path, and mock mode must vary by environment.

### Decision

Use Vite env with **`VITE_` prefix** for client code. Document expected keys in `.env.example`. Declare typings in `src/types/env.d.ts` (`VITE_API_BASE_URL`, `VITE_BASE_PATH`, `VITE_USE_MOCK`).

### Rationale

- Standard Vite workflow; values are inlined at build time

### Consequences

- Changing env requires a rebuild for production bundles.

---

## ADR-011: RTK Query API slice for profile and transactions

**Status:** Accepted  
**Date:** April 2026

### Context

Profile and transaction data benefit from caching, tag invalidation, and shared loading/error semantics. Auth thunks alone would duplicate that logic.

### Decision

Define **`argentBankApi`** with `createApi`, `reducerPath: 'argentBankApi'`, `fakeBaseQuery`, and endpoints implemented via **`queryFn`**:

- `getProfile` / `updateProfile` — POST/PUT profile; mock branch uses `mockAuthApi`
- `getTransactions` / `patchTransaction` — GET/PATCH transaction resources; mock branch mutates `MOCK_ACCOUNTS`

Register `argentBankApi.reducer` and `argentBankApi.middleware` in `store.ts`. Call **`argentBankApi.util.resetApiState()`** on logout to clear cached user data.

### Rationale

- Aligns with Redux Toolkit ecosystem patterns
- Keeps auth token in the slice while server entities stay cacheable

### Consequences

- Developers must understand `skip` options (e.g. profile fetch only when authenticated).
- `App.tsx` prefetches profile when authenticated to hydrate layout/nav.

---

## ADR-012: Optional mock backend (`VITE_USE_MOCK`)

**Status:** Accepted  
**Date:** April 2026

### Context

Demos and static hosting should work without MongoDB or Express.

### Decision

When `import.meta.env.VITE_USE_MOCK === 'true'`, **auth thunks** and **`argentBankApi` queryFns** read/write **`src/mocks`** instead of calling `apiCall`.

### Rationale

- Same UI and Redux paths in dev and demo builds
- Clear switch at the API boundary

### Consequences

- Mock data can drift from `swagger.yaml`; treat mocks as a **contract test** for the UI, not the source of truth for production API behavior.

---

## ADR-013: Backend layering (Express)

**Status:** Accepted  
**Date:** April 2026

### Context

The API must stay testable and easy to extend for coursework and maintenance.

### Decision

Follow **route → controller → service → model** in `Backend/`:

- **Routes** declare paths and attach middleware (e.g. JWT validation).
- **Controllers** parse requests and return HTTP responses.
- **Services** hold bcrypt/JWT and business rules.
- **Mongoose models** define persistence.

Expose **Swagger UI** at `/api-docs` when `NODE_ENV !== 'production'`, driven by `swagger.yaml`.

### Rationale

- Matches common Express practice and OpenClassrooms project expectations
- Clear place to add future account/transaction routes if the spec grows beyond current `userRoutes.js`

### Consequences

- `swagger.yaml` may describe endpoints that are not all wired in `routes/` yet; keep docs and code in sync when shipping features.

---

## Build tooling notes

- **Vite 8** with `@vitejs/plugin-react`, **oxc** minify, optional **rollup-plugin-visualizer** in production builds (`dist/stats.html`).
- **vite-plugin-checker** runs TypeScript checking in dev.
- **ESLint** + **Prettier** + **Stylelint** — see root `package.json` scripts.

---

## Future considerations

1. **Testing** — Unit tests for thunks/reducers and integration tests for `ProtectedRoute` + API slice; optional Playwright for critical paths.
2. **API parity** — Implement or trim `swagger.yaml` entries so accounts/transactions match production routes.
3. **i18n** — If required, extract `constants/ui.ts` strings behind a library (e.g. react-i18next).
4. **Route-level code splitting** — `React.lazy` for heavy pages if bundle size grows.
5. **Centralize `authToken` key** — Move literal to `constants/` if more modules need it.
