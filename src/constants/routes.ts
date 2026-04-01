/**
 * Application route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  TRANSACTIONS: '/accounts/:accountId/transactions',
  NOT_FOUND: '*',
} as const;

/**
 * Helper to build transactions route with account ID
 */
export const buildTransactionsRoute = (accountId: string): string => {
  return `/accounts/${accountId}/transactions`;
};
