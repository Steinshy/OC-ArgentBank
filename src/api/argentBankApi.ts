import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiCall } from './client';
import { RootState } from '@/store/store';
import { UserProfile, UserProfileResponse, Transaction } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { API_ENDPOINTS } from '@/constants';

const getAuthToken = (getState: () => unknown): string => (getState() as RootState).auth.token ?? '';

export const argentBankApi = createApi({
  reducerPath: 'argentBankApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['User', 'Account', 'Transaction'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      queryFn: async (_arg, { getState }) => {
        try {
          const token = getAuthToken(getState);

          const response = await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, { method: 'POST', token });
          return { data: response.body };
        } catch (error) {
          const errorMessage = extractErrorMessage(error, ERROR_MESSAGES.PROFILE_LOAD_FAILED);
          return { error: errorMessage };
        }
      },
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    updateProfile: builder.mutation<UserProfile, { firstName: string; lastName: string }>({
      queryFn: async (args, { getState }) => {
        try {
          const token = getAuthToken(getState);

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
          const token = getAuthToken(getState);

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
          const token = getAuthToken(getState);

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
