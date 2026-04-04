import { ApiErrorResponse } from '@/types';

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    ('message' in obj && typeof obj.message === 'string') ||
    ('error' in obj && typeof obj.error === 'string') ||
    ('body' in obj && typeof obj.body === 'object' && obj.body !== null && 'message' in (obj.body as Record<string, unknown>))
  );
};

export const extractErrorMessage = (error: unknown, defaultMessage: string = 'An error occurred'): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (isApiErrorResponse(error)) {
    if (error.body?.message) {
      return error.body.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.error) {
      return error.error;
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
};

export const handleHttpError = async (response: Response): Promise<string> => {
  try {
    const data: unknown = await response.json();
    return extractErrorMessage(data, `${response.statusText}`);
  } catch {
    return `${response.statusText}`;
  }
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again',
  SIGN_IN_FAILED: 'Sign in failed. Please try again.',
  PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
  PROFILE_FETCH_FAILED: 'Failed to load profile. Please try again.',
} as const;

export const getErrorMessageByStatus = (status: number): string => {
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
};
