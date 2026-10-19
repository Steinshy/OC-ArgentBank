# Argent Bank

React 19 + TypeScript + Vite SPA with Redux Toolkit; Express 5 + MongoDB backend in `Backend/` (pnpm workspace).

Path-scoped rules live in `.claude/rules/` (frontend, backend, deployment). `ARCHITECTURE.md` owns structure and decisions.

## Commands

- `pnpm dev`: frontend on :5173; `VITE_USE_MOCK=true pnpm dev` runs it without the backend.
- `pnpm dev:all`: MongoDB (podman compose) + API on :3001 + seeded users + frontend; `podman compose down` stops MongoDB.
- `pnpm check`: tsc + ESLint + Stylelint + Prettier --check; run before committing.
- `pnpm fix`: ESLint --fix + Prettier --write.
- `pnpm build` + `pnpm preview`: production build and local preview.

## Run modes

- Local dev: real backend at `VITE_API_BASE_URL` (defaults to `http://localhost:3001`).
- Releases (GitHub Pages, Coolify): `VITE_USE_MOCK=true`, no backend; `src/api/mockApi.ts` answers in-browser.
- Seeded users: `tony@stark.com` / `password123`, `steve@rogers.com` / `password456` (backend seed and mock).

## Rules

- No `any`; minimal comments, self-documenting code.
- Use the `@/` import alias; Prettier enforces a 200-char line width.
- Never commit real secrets; `Backend/.env` and `.env.local` are git-ignored.
