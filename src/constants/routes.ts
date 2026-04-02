export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TRANSACTIONS: '/accounts/:accountId/transactions',
  NOT_FOUND: '*',
} as const;

export const buildTransactionsRoute = (accountId: string): string => {
  return `/accounts/${accountId}/transactions`;
};
