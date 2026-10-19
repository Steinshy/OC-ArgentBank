---
paths:
  - 'src/**/*'
---

# Frontend

## Conventions

- Components: functional, with a `Props` interface; file layout `ComponentName/ComponentName.tsx`.
- Styles: `ComponentName/styles/ComponentName.css` next to the component.
- Hooks: `useFeatureName.ts`; shared types in `src/types/`.
- Constants: SCREAMING_SNAKE_CASE (e.g. `API_ENDPOINTS.AUTH_LOGIN`).
- API responses: one typed interface per endpoint (e.g. `AuthTokenResponse`, `UserProfileResponse`) in `src/types/index.ts`.
- Imports: `import-x/order` groups builtin, external, `@/`, then relative, alphabetized; run `pnpm fix` instead of ordering by hand.

## Data layer

- Auth (login, register, logout): `createAsyncThunk` in `src/features/Auth/authThunks.ts`.
- Profile: RTK Query in `src/api/argentBankApi.ts`; every request goes through `apiCall` in `src/api/client.ts`.
- Accounts and transactions: static data in `src/pages/Users/Transactions/staticAccounts.ts`; the backend has no such routes yet.
- Mock mode: `apiCall` delegates to `src/api/mockApi.ts` when `VITE_USE_MOCK=true`; keep its endpoints, response shapes and error messages in sync with `Backend/`.
- Env vars are declared in `src/types/env.d.ts` and documented in `.env.example`.
