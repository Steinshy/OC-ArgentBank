import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiCall } from './client';
import { mockAuthApi } from '@/mocks';
import { updateMockTransaction, MOCK_ACCOUNTS } from '@/mocks/accounts';
import { UserProfile, UserProfileResponse, Transaction } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { USE_MOCK, API_ENDPOINTS } from '@/constants';

export const argentBankApi = createApi({
  reducerPath: 'argentBankApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['User', 'Transaction'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      queryFn: async (_arg, { getState }) => {
        try {
          const token = (getState() as { auth: { token: string | null } }).auth.token ?? '';

          if (USE_MOCK) {
            const response = await mockAuthApi.getProfile(token);
            return { data: response.body };
          }

          const response = await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, { method: 'POST', token });
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
          const token = (getState() as { auth: { token: string | null } }).auth.token ?? '';

          if (USE_MOCK) {
            const response = await mockAuthApi.updateProfile(token, args);
            return { data: response.body };
          }

          const response = await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, {
            method: 'PUT',
            body: JSON.stringify(args),
            token,
          });
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
          const token = (getState() as { auth: { token: string | null } }).auth.token ?? '';

          if (USE_MOCK) {
            const account = MOCK_ACCOUNTS.find((a) => a.id === accountId);
            if (!account) {
              return { error: `Account ${accountId} not found` };
            }
            const transactions = structuredClone(account.transactions ?? []);
            return { data: transactions };
          }

          const data = await apiCall<Transaction[]>(API_ENDPOINTS.ACCOUNT_TRANSACTIONS(accountId), { method: 'GET', token });
          return { data };
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
          const token = (getState() as { auth: { token: string | null } }).auth.token ?? '';

          if (USE_MOCK) {
            updateMockTransaction(accountId, transactionId, data);
            return { data: undefined };
          }

          await apiCall(API_ENDPOINTS.TRANSACTION_DETAIL(accountId, transactionId), {
            method: 'PATCH',
            body: JSON.stringify(data),
            token,
          });
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
