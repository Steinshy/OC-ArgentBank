import { apiCall } from './client';

import { API_ENDPOINTS } from '@/constants';
import { Transaction } from '@/types';

export const transactionsApi = {
  getTransactions: async (token: string, accountId: string): Promise<Transaction[]> => {
    return apiCall<Transaction[]>(API_ENDPOINTS.ACCOUNT_TRANSACTIONS(accountId), {
      method: 'GET',
      token,
    });
  },

  updateTransaction: async (token: string, accountId: string, transactionId: string, data: { category?: string; notes?: string }) => {
    return apiCall(API_ENDPOINTS.TRANSACTION_DETAIL(accountId, transactionId), {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  },
};
