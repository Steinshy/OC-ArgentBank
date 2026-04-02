import { API_BASE_URL } from '@/constants';
import { handleHttpError } from '@/utils/errorHandler';

export const apiCall = async <T>(endpoint: string, options: RequestInit & { token?: string } = {}): Promise<T> => {
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
};
