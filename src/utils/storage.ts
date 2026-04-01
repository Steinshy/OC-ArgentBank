/**
 * Storage utility module providing typed access to browser localStorage
 * Abstracts localStorage operations with consistent error handling and type safety
 * @module utils/storage
 */

import { STORAGE_KEYS } from '@/constants/storage';

/**
 * Typed localStorage access object for managing application data persistence
 * All methods operate on browser localStorage with automatic key management
 */
export const storage = {
  /**
   * Retrieves the stored authentication token from localStorage
   * @returns {string | null} The auth token if present, null otherwise
   * @example
   * const token = storage.getAuthToken(); // "eyJhbGc..."
   */
  getAuthToken: (): string | null => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),

  /**
   * Stores an authentication token in localStorage
   * Overwrites any existing token
   * @param {string} token - The JWT or auth token to store
   * @returns {void}
   * @example
   * storage.setAuthToken('eyJhbGc...');
   */
  setAuthToken: (token: string): void => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),

  /**
   * Removes the stored authentication token from localStorage
   * Safe to call even if no token exists
   * @returns {void}
   * @example
   * storage.removeAuthToken(); // Clears auth token on logout
   */
  removeAuthToken: (): void => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  /**
   * Retrieves the stored remember-me email from localStorage
   * @returns {string | null} The saved email if remember-me was set, null otherwise
   * @example
   * const email = storage.getRememberMe(); // "user@example.com"
   */
  getRememberMe: (): string | null => localStorage.getItem(STORAGE_KEYS.REMEMBER_ME),

  /**
   * Stores a remember-me email in localStorage for auto-fill on login
   * @param {string} email - The user email to remember
   * @returns {void}
   * @example
   * storage.setRememberMe('user@example.com');
   */
  setRememberMe: (email: string): void => localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, email),
};
