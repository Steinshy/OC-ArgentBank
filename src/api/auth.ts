import { apiCall } from './client';
import { mockAuthApi } from './mockAuth';

import { API_ENDPOINTS } from '@/constants';
import { SignInRequest, SignInResponse, UserProfileResponse } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authApi = {
  signIn: async (credentials: SignInRequest): Promise<SignInResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.signIn(credentials)
      : await apiCall<SignInResponse>(API_ENDPOINTS.AUTH_LOGIN, {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
    return response;
  },

  getProfile: async (token: string): Promise<UserProfileResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.getProfile(token)
      : await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, {
          method: 'POST',
          token,
        });
    return response;
  },

  updateProfile: async (token: string, data: { firstName: string; lastName: string }): Promise<UserProfileResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.updateProfile(token, data)
      : await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        });
    return response;
  },
};
