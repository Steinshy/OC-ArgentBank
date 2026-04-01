/**
 * Error handler utility module for standardizing error messages across the app
 * Provides functions to extract error messages from various error formats and
 * map HTTP status codes to user-friendly messages
 * @module utils/errorHandler
 */

import { ApiErrorResponse } from '@/types';

/**
 * Extracts a user-friendly error message from various error formats
 * Handles Error objects, API error responses, strings, and unknown error types
 * @param {unknown} error - The error object from a catch block (can be Error, object, string, etc.)
 * @param {string} [defaultMessage='An error occurred'] - Fallback message if extraction fails
 * @returns {string} Human-readable error message
 *
 * @example
 * try {
 *   // some operation
 * } catch (error) {
 *   const message = extractErrorMessage(error, 'Operation failed');
 *   console.log(message);
 * }
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
  // Handle Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Handle API error response with body.message
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorResponse;

    if (apiError.body?.message) {
      return apiError.body.message;
    }

    if (apiError.message) {
      return apiError.message;
    }

    if (apiError.error) {
      return apiError.error;
    }
  }

  // Handle string error
  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
}

/**
 * Processes HTTP error responses and extracts error message from response body
 * Attempts to parse response JSON and extract error details, falls back to statusText
 * @param {Response} response - The HTTP response object from a failed fetch request
 * @returns {Promise<string>} Promise resolving to error message string
 * @throws Will not throw, returns statusText if JSON parsing fails
 *
 * @example
 * const response = await fetch('/api/login', { method: 'POST' });
 * if (!response.ok) {
 *   const errorMsg = await handleHttpError(response);
 *   console.error(errorMsg); // "Invalid email or password"
 * }
 */
export async function handleHttpError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return extractErrorMessage(data, `Error: ${response.statusText}`);
  } catch {
    return `Error: ${response.statusText}`;
  }
}

/**
 * Centralized error messages for common application scenarios
 * Provides consistent, user-friendly error text throughout the app
 * @type {Object}
 * @readonly
 * @property {string} INVALID_CREDENTIALS - User login credentials were invalid
 * @property {string} NETWORK_ERROR - Network connectivity issue occurred
 * @property {string} SESSION_EXPIRED - User session has timed out
 * @property {string} UNAUTHORIZED - User lacks permission for the action
 * @property {string} SERVER_ERROR - Server-side error occurred
 * @property {string} VALIDATION_ERROR - User input validation failed
 * @property {string} LOGIN_FAILED - Login operation failed
 * @property {string} PROFILE_UPDATE_FAILED - Profile update operation failed
 * @property {string} PROFILE_FETCH_FAILED - Failed to fetch user profile
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again',
  LOGIN_FAILED: 'Login failed. Please try again.',
  PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
  PROFILE_FETCH_FAILED: 'Failed to load profile. Please try again.',
} as const;

/**
 * Maps HTTP status codes to user-friendly error messages
 * Provides appropriate error text based on the HTTP status code received
 * @param {number} status - HTTP status code (e.g., 404, 500, 0 for network errors)
 * @returns {string} User-friendly error message corresponding to the status code
 *
 * @example
 * const msg = getErrorMessageByStatus(401);
 * console.log(msg); // "You are not authorized to perform this action"
 *
 * @example
 * const msg = getErrorMessageByStatus(0); // Network error
 * console.log(msg); // "Network error. Please check your connection."
 */
export function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return 'Resource not found';
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    case 0:
      return ERROR_MESSAGES.NETWORK_ERROR;
    default:
      return 'An error occurred. Please try again.';
  }
}
