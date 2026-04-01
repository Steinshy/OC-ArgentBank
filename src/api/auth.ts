/**
 * Authentication API client module
 * Provides methods for login, profile retrieval, and profile updates
 * Automatically uses mock data when VITE_USE_MOCK is enabled or API is unavailable
 * @module api/auth
 */

import { apiCall } from './client';
import { mockAuthApi } from './mockAuth';

import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, UserProfileResponse } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const DATA_TYPE = USE_MOCK ? 'mock' : 'api';

/**
 * Authentication API client object
 * Handles all authentication-related HTTP requests with automatic error handling
 * Falls back to mock API when USE_MOCK is enabled
 */
export const authApi = {
  /**
   * Authenticates user with email and password credentials
   * Returns auth token and user profile on success
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.login(credentials)
      : await apiCall<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
    console.log('Login response:', { ...response, data_type: DATA_TYPE });
    return response;
  },

  /**
   * Fetches the authenticated user's profile information
   * Requires valid authentication token
   */
  getProfile: async (token: string): Promise<UserProfileResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.getProfile(token)
      : await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, {
          method: 'POST',
          token,
        });
    console.log('Profile response:', { ...response, data_type: DATA_TYPE });
    return response;
  },

  /**
   * Updates the authenticated user's profile name
   * Requires valid authentication token
   */
  updateProfile: async (token: string, data: { firstName: string; lastName: string }): Promise<UserProfileResponse> => {
    const response = USE_MOCK
      ? await mockAuthApi.updateProfile(token, data)
      : await apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        });
    console.log('Update profile response:', { ...response, data_type: DATA_TYPE });
    return response;
  },
};
