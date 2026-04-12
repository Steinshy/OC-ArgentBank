import { SERVER_ERROR_MESSAGES } from '@/utils/errorHandler';
import { MOCK_USERS } from './users';
import { MockUser, SignInRequest, SignInResponse, SignUpRequest, SignUpResponse, UserProfileResponse } from '@/types';

const MOCK_DELAY = 1000;
const MOCK_SECRET_KEY = 'mock-secret-key-for-encryption';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const encryptPayload = (payload: string): string => {
  let encrypted = '';
  for (let i = 0; i < payload.length; i++) {
    const charCode = payload.charCodeAt(i);
    const keyCharCode = MOCK_SECRET_KEY.charCodeAt(i % MOCK_SECRET_KEY.length);
    encrypted += String.fromCharCode(charCode ^ keyCharCode);
  }
  return btoa(encrypted);
};

const decryptPayload = (encrypted: string): string => {
  try {
    const decoded = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyCharCode = MOCK_SECRET_KEY.charCodeAt(i % MOCK_SECRET_KEY.length);
      decrypted += String.fromCharCode(charCode ^ keyCharCode);
    }
    return decrypted;
  } catch {
    return '';
  }
};

const generateMockToken = (userId: string): string => {
  const payload = JSON.stringify({ id: userId, iat: Date.now() });
  const encrypted = encryptPayload(payload);
  return `mock.${encrypted}.signature`;
};

const getUserFromToken = (token: string): MockUser | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decrypted = decryptPayload(payload);
    const { id } = JSON.parse(decrypted);
    return MOCK_USERS.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
};

export const mockAuthApi = {
  signIn: async (credentials: SignInRequest): Promise<SignInResponse> => {
    await delay(MOCK_DELAY);

    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error(SERVER_ERROR_MESSAGES.SIGN_IN_USER_NOT_FOUND);
    }

    if (user.password !== credentials.password) {
      throw new Error(SERVER_ERROR_MESSAGES.SIGN_IN_PASSWORD_INVALID);
    }

    return {
      status: 200,
      message: 'User successfully signed in',
      body: {
        token: generateMockToken(user.id),
      },
    };
  },

  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    await delay(MOCK_DELAY);
    if (MOCK_USERS.find((u) => u.email === data.email)) {
      throw new Error(SERVER_ERROR_MESSAGES.SIGN_UP_EMAIL_EXISTS);
    }
    const newUser: MockUser = {
      id: String(Date.now()),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    MOCK_USERS.push(newUser);
    return {
      status: 200,
      message: 'User successfully created',
      body: { token: generateMockToken(newUser.id) },
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
