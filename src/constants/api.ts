// Vite injects `import.meta.env` at build time; in test / non-Vite runtimes it may be undefined.
const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

export const API_BASE_URL = viteEnv.VITE_API_BASE_URL || 'http://localhost:3001';

export const USE_MOCK = viteEnv.VITE_USE_MOCK === 'true';

export const API_CONFIG = {
  TIMEOUT: 5000,
} as const;

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/api/v1/user/login',
  AUTH_SIGNUP: '/api/v1/user/signup',
  USER_PROFILE: '/api/v1/user/profile',
  USER_ACCOUNTS: '/api/v1/user/accounts',
  ACCOUNT_TRANSACTIONS: (accountId: string) => `/api/v1/user/accounts/${accountId}/transactions`,
  TRANSACTION_DETAIL: (accountId: string, transactionId: string) => `/api/v1/user/accounts/${accountId}/transactions/${transactionId}`,
} as const;
