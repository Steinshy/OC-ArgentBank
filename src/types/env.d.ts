/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

declare const __APP_PUBLIC_BASE_PATH__: string;

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
