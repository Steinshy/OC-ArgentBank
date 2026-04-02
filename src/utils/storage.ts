import { STORAGE_KEYS } from '@/constants/storage';

export const storage = {
  getAuthToken: (): string | null => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),

  setAuthToken: (token: string): void => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),

  removeAuthToken: (): void => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  getRememberMe: (): string | null => localStorage.getItem(STORAGE_KEYS.REMEMBER_ME),

  setRememberMe: (email: string): void => localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, email),
};
