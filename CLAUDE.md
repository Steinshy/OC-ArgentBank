# Argent Bank

React 19 + TypeScript + Vite SPA with Redux Toolkit. Backend is Express.js + MongoDB.

## Conventions

Type safety (no `any`).

**Style:** Minimal comments, self-documenting

**Output Requirements**

- API response: typed interfaces per endpoint (e.g. `SignInResponse`, `UserProfileResponse`) — see `src/types/index.ts`
- Component: Functional with Props interface (e.g., `interface Props { id: string; }`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.AUTH_LOGIN`)

**Naming Conventions**: Use the format `ComponentName/ComponentName.tsx`, `useFeatureName.ts`, and types in `src/types/`.

## Data layer

- **Auth (login / register / logout):** `createAsyncThunk` — `src/features/Auth/authThunks.ts`
- **Profile / Accounts / Transactions API:** RTK Query `createApi` — `src/api/argentBankApi.ts` (typed endpoints, calls `apiCall` for all requests)

## Architecture

```
src/
├── api/
├── components/
├── constants/
├── features/
├── helpers/       # validators, server message helpers
├── hooks/
├── pages/
├── store/
├── types/
└── utils/

Backend/
├── server.js, controllers/, routes/, middleware/, services/, database/, scripts/
```

## Environment

- Frontend: copy `.env.example` → `.env.local`. `VITE_API_BASE_URL=http://localhost:3001` (required).
- Backend: copy `Backend/.env.example` → `Backend/.env` (`DATABASE_URL`, `JWT_SECRET`, `PORT=3001`). Do not commit real secrets; use a strong `JWT_SECRET` in production.
- Deploy: point `VITE_API_BASE_URL` at the live API; tune backend CORS/env per host.

## Quick Reference

**Frontend (repo root)**

- `pnpm run dev`: Frontend (localhost:5173)
- `pnpm run dev:all`: Frontend + backend

> ⚠️ `dev:all` kills any running Vite/nodemon processes on your machine before starting.

- `pnpm run type-check`: Type-check without emit (run before PR)
- `pnpm run lint`: Lint without fixing
- `pnpm run lint:fix`: Fix lint errors
- `pnpm run lint:styles`: Lint CSS/SCSS
- `pnpm run format`: Apply Prettier (writes)
- `pnpm run format:check`: Check formatting without writing
- `pnpm run build` + `pnpm run preview`: Production build + local preview

**Backend (`Backend/`)**

- `pnpm run dev:server`: API with nodemon
- `pnpm run populate-db`: Seed database

See `Backend/README.md` for API details.

## Notes

- Use `@/` for import alias.
- Maintain 200 char line limits using Prettier.
- Styles should follow `Component/styles/Component.css` convention.
