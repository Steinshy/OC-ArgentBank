import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { authApi } from './auth';
import { transactionsApi } from './transactions';
import { mockAuthApi } from './mockAuth';
import { updateMockTransaction, MOCK_ACCOUNTS } from '@/mocks/accounts';
import { UserProfile, Transaction } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import type { RootState } from '@/store/store';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const argentBankApi = createApi({
  reducerPath: 'argentBankApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['User', 'Transaction'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      queryFn: async (_arg, { getState }) => {
        try {
          const token = (getState() as RootState).auth.token ?? '';

          if (USE_MOCK) {
            const response = await mockAuthApi.getProfile(token);
            return { data: response.body };
          }

          const response = await authApi.getProfile(token);
          return { data: response.body };
        } catch (error) {
          const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.PROFILE_FETCH_FAILED);
          return { error: errorMessage };
        }
      },
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    updateProfile: builder.mutation<UserProfile, { firstName: string; lastName: string }>({
      queryFn: async (args, { getState }) => {
        try {
          const token = (getState() as RootState).auth.token ?? '';

          if (USE_MOCK) {
            const response = await mockAuthApi.updateProfile(token, args);
            return { data: response.body };
          }

          const response = await authApi.updateProfile(token, args);
          return { data: response.body };
        } catch (error) {
          const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
          return { error: errorMessage };
        }
      },
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    getTransactions: builder.query<Transaction[], string>({
      queryFn: async (accountId, { getState }) => {
        try {
          const token = (getState() as RootState).auth.token ?? '';

          if (USE_MOCK) {
            const account = MOCK_ACCOUNTS.find((a) => a.id === accountId);
            if (!account) {
              return {
                error: `Account ${accountId} not found`,
              };
            }
            const transactions = structuredClone(account.transactions ?? []);
            return { data: transactions };
          }

          const response = await transactionsApi.getTransactions(token, accountId);
          return { data: response };
        } catch (error) {
          const errorMessage = extractErrorMessage(error, 'Failed to load transactions. Please try again.');
          return { error: errorMessage };
        }
      },
      providesTags: (result, _error, accountId) =>
        result
          ? [
              { type: 'Transaction' as const, id: accountId },
              { type: 'Transaction' as const, id: 'LIST' },
            ]
          : [{ type: 'Transaction' as const, id: 'LIST' }],
    }),

    patchTransaction: builder.mutation<void, { accountId: string; transactionId: string; data: { category?: string; notes?: string } }>({
      queryFn: async ({ accountId, transactionId, data }, { getState }) => {
        try {
          const token = (getState() as RootState).auth.token ?? '';

          if (USE_MOCK) {
            updateMockTransaction(accountId, transactionId, data);
            return { data: undefined };
          }

          await transactionsApi.updateTransaction(token, accountId, transactionId, data);
          return { data: undefined };
        } catch (error) {
          const errorMessage = extractErrorMessage(error, 'Failed to update transaction');
          return { error: errorMessage };
        }
      },
      invalidatesTags: (_result, _error, { accountId }) => [{ type: 'Transaction', id: accountId }],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useGetTransactionsQuery, usePatchTransactionMutation } = argentBankApi;
