import { LoginRequest, LoginResponse, UserProfileResponse } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';

async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
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
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiCall<LoginResponse>('/api/v1/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (token: string): Promise<UserProfileResponse> => {
    return apiCall<UserProfileResponse>('/api/v1/user/profile', {
      method: 'GET',
      token,
    });
  },

  updateProfile: async (token: string, data: { firstName: string; lastName: string }) => {
    return apiCall('/api/v1/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  },
};
