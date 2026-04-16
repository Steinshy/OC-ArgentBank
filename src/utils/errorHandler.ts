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
  GENERIC: 'An error occurred',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  SIGNIN_FAILED: 'Sign in failed. Please try again.',
  SIGNUP_FAILED: 'Registration failed. Please try again.',
  PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
  PROFILE_LOAD_FAILED: 'Failed to load profile. Please try again.',
  TRANSACTIONS_LOAD_FAILED: 'Failed to load transactions. Please try again.',
  TRANSACTION_UPDATE_FAILED: 'Failed to update transaction',
} as const;

/** Server response messages — matched to backend error messages */
export const SERVER_ERROR_MESSAGES = {
  SIGN_IN_USER_NOT_FOUND: 'User not found!',
  SIGN_IN_PASSWORD_INVALID: 'Password is invalid',
  SIGN_UP_EMAIL_EXISTS: 'Email already exists',
} as const;

const classifyErrorByFields = (error: string | null, fieldToMessageMap: Record<string, string>): Record<string, string | null> => {
  const result: Record<string, string | null> = {};
  Object.entries(fieldToMessageMap).forEach(([field, message]) => {
    result[field] = error === message ? error : null;
  });
  const matchedMessages = Object.values(fieldToMessageMap);
  result.generalError = error && !matchedMessages.includes(error) ? error : null;
  return result;
};

export const classifySignInError = (error: string | null) =>
  classifyErrorByFields(error, {
    emailError: SERVER_ERROR_MESSAGES.SIGN_IN_USER_NOT_FOUND,
    passwordError: SERVER_ERROR_MESSAGES.SIGN_IN_PASSWORD_INVALID,
  });

export const classifySignUpError = (error: string | null) =>
  classifyErrorByFields(error, {
    emailError: SERVER_ERROR_MESSAGES.SIGN_UP_EMAIL_EXISTS,
  });
