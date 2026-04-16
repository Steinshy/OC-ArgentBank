import { ValidationResult } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\p{L}\s'-]+$/u;

/** Registration / profile: explicit requirements for UX and API alignment. */
export const validateEmail = (value: string): ValidationResult => {
  const v = value.trim();
  if (!v) return { isValid: false, error: 'Email is required' };
  if (!EMAIL_REGEX.test(v)) return { isValid: false, error: 'Please enter a valid email address' };
  if (v.length > 255) return { isValid: false, error: 'Email must not exceed 255 characters' };
  return { isValid: true, error: null };
};

/** Sign-in: presence only; the API validates credentials. */
export const validateSignInPassword = (value: string): ValidationResult => {
  if (!value) return { isValid: false, error: 'Password is required' };
  return { isValid: true, error: null };
};

/** Registration: explicit requirements for UX and API alignment. */
export const validatePassword = (value: string): ValidationResult => {
  if (!value) return { isValid: false, error: 'Password is required' };
  if (value.length < 8) return { isValid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(value)) return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[0-9]/.test(value)) return { isValid: false, error: 'Password must contain at least one number' };
  return { isValid: true, error: null };
};

export const validateName = (value: string, fieldLabel: string): ValidationResult => {
  const v = value.trim();
  if (!v) return { isValid: false, error: `${fieldLabel} is required` };
  if (v.length < 2) return { isValid: false, error: `${fieldLabel} must be at least 2 characters` };
  if (v.length > 50) return { isValid: false, error: `${fieldLabel} must not exceed 50 characters` };
  if (!NAME_REGEX.test(v)) return { isValid: false, error: `${fieldLabel} can only contain letters, hyphens, and spaces` };
  return { isValid: true, error: null };
};
