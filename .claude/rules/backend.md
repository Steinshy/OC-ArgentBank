---
paths:
  - 'Backend/**/*'
  - 'compose.yaml'
---

# Backend

- Express 5 + Mongoose, CommonJS; layout: `server.js`, `routes/`, `controllers/`, `services/`, `middleware/`, `database/`, `scripts/`.
- Env: copy `Backend/.env.example` to `Backend/.env` (`DATABASE_URL`, `JWT_SECRET`, `PORT=3001`, `CORS_ORIGIN`); use a strong `JWT_SECRET` outside local dev.
- Scripts (`pnpm --filter argent-bank-api <script>`): `dev:server` (nodemon), `server`, `populate-db` (seeds Tony and Steve through the signup API).
- MongoDB for dev comes from `compose.yaml` (Mongo 6, loopback only, no auth); `pnpm dev:all` starts it.
- Swagger UI at `/api-docs` outside production; spec in `Backend/swagger.yaml`.
- The backend is never deployed: releases use the frontend mock. When changing endpoints, response shapes or error messages, update `src/api/mockApi.ts` to match.
- API details: `Backend/README.md`.
