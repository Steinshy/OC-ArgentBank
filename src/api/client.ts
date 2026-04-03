import { API_BASE_URL, API_CONFIG } from '@/constants';
import { handleHttpError } from '@/utils/errorHandler';

export const apiCall = async <T>(endpoint: string, options: RequestInit & { token?: string } = {}): Promise<T> => {
  const { token, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorMessage = await handleHttpError(response);
      throw new Error(errorMessage);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};
