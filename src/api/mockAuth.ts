import { MOCK_USERS, MockUser } from '@/mocks';
import { LoginRequest, LoginResponse, UserProfileResponse } from '@/types';

const MOCK_DELAY = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateMockToken = (userId: string): string => {
  const payload = btoa(JSON.stringify({ id: userId, iat: Date.now() }));
  return `mock.${payload}.signature`;
};

const getUserFromToken = (token: string): MockUser | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const { id } = JSON.parse(atob(payload));
    return MOCK_USERS.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
};

export const mockAuthApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await delay(MOCK_DELAY);

    const user = MOCK_USERS.find((u) => u.email === credentials.email && u.password === credentials.password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return {
      status: 200,
      message: 'User successfully logged in',
      body: {
        token: generateMockToken(user.id),
      },
    };
  },

  getProfile: async (token: string): Promise<UserProfileResponse> => {
    await delay(MOCK_DELAY);

    const user = getUserFromToken(token);

    if (!user) {
      const error = new Error('Unauthorized - Invalid or expired token');
      (error as Error & { status: number }).status = 403;
      throw error;
    }

    return {
      status: 200,
      message: 'Successfully got user profile data',
      body: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  },

  updateProfile: async (token: string, data: { firstName: string; lastName: string }): Promise<UserProfileResponse> => {
    await delay(MOCK_DELAY);

    const user = getUserFromToken(token);

    if (!user) {
      const error = new Error('Unauthorized - Invalid or expired token');
      (error as Error & { status: number }).status = 403;
      throw error;
    }

    user.firstName = data.firstName;
    user.lastName = data.lastName;

    return {
      status: 200,
      message: 'Successfully updated user profile data',
      body: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  },
};
