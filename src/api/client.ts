import { API_BASE_URL, API_CONFIG, USE_MOCK } from '@/constants';
import { handleHttpError } from '@/utils/errorHandler';

export const apiCall = async <T>(endpoint: string, options: RequestInit & { token?: string } = {}): Promise<T> => {
  if (USE_MOCK) {
    const { mockApiCall } = await import('./mockApi');
    return mockApiCall<T>(endpoint, options);
  }

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

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};
