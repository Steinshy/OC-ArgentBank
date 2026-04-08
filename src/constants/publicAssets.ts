/**
 * URL for files copied from `public/` (e.g. `assets/img/logo.png`).
 * Uses the same base as `base` / `appPublicBasePath` in `vite.config.ts`.
 */
export const getPublicAssetUrl = (pathFromPublicRoot: string): string => {
  const base = __APP_PUBLIC_BASE_PATH__;
  const normalized = pathFromPublicRoot.replace(/^\//, '');
  return `${base.endsWith('/') ? base : `${base}/`}${normalized}`;
};
