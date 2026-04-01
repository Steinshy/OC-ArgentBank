/**
 * API configuration and endpoints
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_CONFIG = {
  TIMEOUT: 5000,
} as const;

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/api/v1/user/login',
  USER_PROFILE: '/api/v1/user/profile',
  ACCOUNT_TRANSACTIONS: (accountId: string) => `/api/v1/accounts/${accountId}/transactions`,
  TRANSACTION_DETAIL: (transactionId: string) => `/api/v1/transactions/${transactionId}`,
} as const;
