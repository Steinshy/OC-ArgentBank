/**
 * Authentication API client module
 * Provides methods for login, profile retrieval, and profile updates
 * @module api/auth
 */

import { apiCall } from './client';

import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, UserProfileResponse } from '@/types';

/**
 * Authentication API client object
 * Handles all authentication-related HTTP requests with automatic error handling
 */
export const authApi = {
  /**
   * Authenticates user with email and password credentials
   * Returns auth token and user profile on success
   * @async
   * @param {LoginRequest} credentials - User login credentials
   * @param {string} credentials.email - User email address
   * @param {string} credentials.password - User password
   * @returns {Promise<LoginResponse>} Login response with token and user data
   * @throws {Error} Throws error with message if authentication fails
   *
   * @example
   * const response = await authApi.login({ email: 'user@example.com', password: 'pass123' });
   * console.log(response.token); // "eyJhbGc..."
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiCall<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Fetches the authenticated user's profile information
   * Requires valid authentication token
   * @async
   * @param {string} token - Valid JWT authentication token
   * @returns {Promise<UserProfileResponse>} User profile data with accounts
   * @throws {Error} Throws error if token is invalid or user not found
   *
   * @example
   * const profile = await authApi.getProfile(authToken);
   * console.log(profile.user.firstName); // "John"
   */
  getProfile: async (token: string): Promise<UserProfileResponse> => {
    return apiCall<UserProfileResponse>(API_ENDPOINTS.USER_PROFILE, {
      method: 'GET',
      token,
    });
  },

  /**
   * Updates the authenticated user's profile name
   * Requires valid authentication token
   * @async
   * @param {string} token - Valid JWT authentication token
   * @param {Object} data - Profile update data
   * @param {string} data.firstName - New first name
   * @param {string} data.lastName - New last name
   * @returns {Promise<any>} Updated profile response
   * @throws {Error} Throws error if update fails or token is invalid
   *
   * @example
   * await authApi.updateProfile(authToken, {
   *   firstName: 'Jane',
   *   lastName: 'Doe'
   * });
   */
  updateProfile: async (token: string, data: { firstName: string; lastName: string }) => {
    return apiCall(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  },
};
