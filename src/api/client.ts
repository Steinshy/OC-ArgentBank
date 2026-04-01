/**
 * API client module providing typed HTTP request wrapper
 * Handles authentication headers, error processing, and JSON serialization
 * @module api/client
 */

import { API_BASE_URL } from '@/constants';
import { handleHttpError } from '@/utils/errorHandler';

/**
 * Generic HTTP request function with automatic header and auth setup
 * Wraps the fetch API with consistent error handling and JSON content-type
 * @template T The expected response type
 * @async
 * @param {string} endpoint - API endpoint path (e.g., '/user/login', '/user/profile')
 * @param {RequestInit & {token?: string}} [options={}] - Fetch options and auth token
 * @param {string} [options.method='GET'] - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} [options.body] - Request body as JSON string
 * @param {string} [options.token] - Optional JWT token for Authorization header
 * @param {HeadersInit} [options.headers] - Additional headers to merge with defaults
 * @returns {Promise<T>} Parsed response body as generic type T
 * @throws {Error} Throws error with user-friendly message if request fails
 *
 * @example
 * // GET request with authentication
 * const profile = await apiCall<UserProfile>('/user/profile', {
 *   method: 'GET',
 *   token: authToken
 * });
 *
 * @example
 * // POST request with body
 * const response = await apiCall<LoginResponse>('/user/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'user@example.com', password: 'pass' })
 * });
 */
export async function apiCall<T>(endpoint: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorMessage = await handleHttpError(response);
    throw new Error(errorMessage);
  }

  return response.json();
}
