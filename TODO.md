# Argent Bank — Project TODO

**Project status:** Phase 1 (UI + auth) largely complete · Phase 2 (transactions) specified in Swagger; **backend routes and live data integration still incomplete**  
**Last updated:** April 3, 2026

---

## Snapshot (from repo scan)

| Area | State |
|------|--------|
| Auth (login, JWT, protected routes, profile GET/PUT) | Implemented end-to-end when `VITE_USE_MOCK=false` |
| Layout / Login styling | Matches design tokens (`main-nav`, `sign-in-content`, Font Awesome, logo) |
| Profile page | Welcome + account cards from **`src/mocks/accounts.ts`** (not API) |
| Name edit | **`Settings`** page (`/settings`) — not inline on Profile |
| Transactions UI | **`Transactions`** page; data from **mocks** via `transactionsThunks` |
| `transactionsApi` + `API_ENDPOINTS` | Present; **thunks do not call the API yet** |
| Backend HTTP | **`userRoutes.js`:** signup, login, POST/PUT profile only — **no `/user/accounts` or transaction routes** |
| Swagger | **`Backend/swagger.yaml`:** accounts list, transactions list, transaction detail **GET**, transaction **PATCH** (Swagger **2.0**, not OpenAPI 3) |
| Error boundary | `src/components/ErrorBoundary/ErrorBoundary.tsx` |
| `useAuth` | `src/hooks/useAuth.ts` |
| API constants | `src/constants/api.ts` (`API_ENDPOINTS`) — not a separate `apiEndpoints.ts` |
| Env templates | Root `.env.example` and `Backend/.env.example` exist — local `.env` / `.env.local` remain **developer-created** (gitignored) |
| Automated tests | **None** in repo (no Playwright/Jest/Vitest test trees found) |

---

## Done (no action needed unless regressions)

- [x] React 19 + TypeScript + Vite + Redux Toolkit
- [x] Routes: Home, Login, Profile, Settings, Transactions (`/accounts/:accountId/transactions`), NotFound
- [x] `ProtectedRoute`, `Layout` (nav + footer; auth-aware links)
- [x] `authThunks` / `authApi` wired to backend (or mock via `VITE_USE_MOCK`)
- [x] Backend: MongoDB user model, login, signup, get/update profile, JWT middleware
- [x] Swagger documents auth + transaction-related paths (spec only for accounts/transactions)

---

## Backlog — high value

### Wire accounts & transactions to the API

- [ ] **Backend:** Implement routes/controllers/services for:
  - `GET /api/v1/user/accounts`
  - `GET /api/v1/user/accounts/:accountId/transactions`
  - `GET` + `PATCH` `/api/v1/user/accounts/:accountId/transactions/:transactionId`  
  (Align behavior and response shapes with `Backend/swagger.yaml` and `src/api/client.ts`.)
- [ ] **Backend:** Add persistence (e.g. MongoDB models or embedded docs) if transactions should survive restarts — currently **no** `accountModel.js` / `transactionModel.js` in repo.
- [ ] **Frontend:** Add `API_ENDPOINTS` / client method for **accounts list** if not present; replace **`MOCK_ACCOUNTS`** on Profile with API data (loading/error states).
- [ ] **Frontend:** Change `transactionsThunks` to use `transactionsApi` + token when `VITE_USE_MOCK=false`, with mock fallback or clear error if backend missing.

### Documentation accuracy

- [ ] **README:** Main endpoints list implies accounts/transactions are live — clarify **auth only** until backend implements those routes (or implement routes).

### Optional / polish

- [ ] Split `Layout` into `Header` / `Footer` components only if reuse or testing needs it (current single `Layout.tsx` is fine).
- [ ] Remove or gate `console.log` in `src/api/auth.ts` for production builds.
- [ ] **OpenAPI 3:** Migrate `swagger.yaml` if submission requires OpenAPI 3.0 (file is currently Swagger 2.0).

---

## Backlog — verification

- [ ] Manual QA: login, profile, settings update, logout, protected routes, transactions drill-down (mock data).
- [ ] After API wiring: retest with real backend; update HTTPie/Postman collection if needed.
- [ ] Add automated tests (e2e and/or unit) if required by grading or CI.

---

## Local setup (unchanged)

```bash
# Frontend (root)
cp .env.example .env.local   # set VITE_API_BASE_URL, VITE_USE_MOCK as needed
npm install && npm run dev

# Backend
cd Backend && cp .env.example .env && npm install
npm run populate-db    # seed users
npm run dev:server
```

---

## Key paths

| Purpose | Path |
|---------|------|
| Routes / app shell | `src/App.tsx` |
| API endpoints (frontend) | `src/constants/api.ts` |
| Auth thunks | `src/features/Auth/authThunks.ts` |
| Transaction thunks (currently mock) | `src/features/Transactions/transactionsThunks.ts` |
| Mock accounts + nested transactions | `src/mocks/accounts.ts` |
| Backend user routes | `Backend/routes/userRoutes.js` |
| Swagger | `Backend/swagger.yaml` |

---

## Removed / obsolete vs old TODO

The following were tracked earlier but are **superseded or already present** in tree: separate `Header.tsx`/`Footer.tsx` as hard requirements, `src/pages/Home/Home.html`, `sign-in.html` / `user.html`, `ErrorBoundary` “not implemented”, `apiEndpoints.ts` filename, and most Phase 1 backend “verify” tasks (implemented). Phase 2 checklist should focus on **implementing** what Swagger describes and **replacing mocks**, not re-specifying the same YAML from scratch.
