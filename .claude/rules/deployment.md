---
paths:
  - 'Dockerfile'
  - '.dockerignore'
  - '.github/**/*'
  - '.env.example'
  - 'vite.config.ts'
---

# Deployment

- Both release targets build with `VITE_USE_MOCK=true`; no backend is deployed.
- GitHub Pages: `.github/workflows/deploy.yml` on push to `main`; sets `VITE_BASE_PATH=/<repo>/` and copies `index.html` to `404.html` for deep links.
- Coolify (app `ArgentBank`): builds the `Dockerfile` (Node 24 build stage, nginx with inline config); the Dockerfile is Coolify-only and not built in CI.
- CI (`.github/workflows/ci.yml`): frozen install, `pnpm check`, build, non-blocking `pnpm audit --prod`.
- pnpm 11 rejects unreviewed install scripts: add new ones to `allowBuilds` in `pnpm-workspace.yaml` (`true` to run, `false` to skip).
- Keep `engines`, `devEngines`, CI `node-version` and the Docker `node:` tag on the same Node major.
