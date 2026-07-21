import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiCall } from './client';
import { RootState } from '@/store/store';
import { UserProfile, UserProfileResponse } from '@/types';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { API_ENDPOINTS } from '@/constants';

const getAuthToken = (getState: () => unknown): string => (getState() as RootState).auth.token ?? '';

// Accounts/transactions are served from static data (see pages/Users/Transactions/staticAccounts.ts)
// until Backend/routes implements those endpoints (tracked in docs/ARCHITECTURE.md).
export const argentBankApi = createApi({
  reducerPath: 'argentBankApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['User'],
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
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = argentBankApi;
