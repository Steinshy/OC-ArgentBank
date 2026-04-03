import { apiCall } from './client';
import { mockAuthApi } from './mockAuth';

import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, UserProfileResponse } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.login(credentials)
      : await apiCall<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, {
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
