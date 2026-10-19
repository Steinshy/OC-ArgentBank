import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, SignInRequest, SignUpRequest, UpdateProfileData, UserProfile } from '@/types';

interface MockUser extends UserProfile {
  password: string;
}

const STORAGE_KEY = 'argentbank-mock-users';
const TOKEN_PREFIX = 'mock-token-';
const LATENCY_MS = 300;

const SEED_USERS: MockUser[] = [
  { id: '1', email: 'tony@stark.com', password: 'password123', firstName: 'Tony', lastName: 'Stark' },
  { id: '2', email: 'steve@rogers.com', password: 'password456', firstName: 'Steve', lastName: 'Rogers' },
];

const loadUsers = (): MockUser[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as MockUser[]) : SEED_USERS;
};

const saveUsers = (users: MockUser[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

const toProfile = ({ id, email, firstName, lastName }: MockUser): UserProfile => ({ id, email, firstName, lastName });

const ok = <T>(message: string, body: T): ApiResponse<T> => ({ status: 200, message, body });

const findUserByToken = (users: MockUser[], token?: string): MockUser => {
  if (!token) throw new Error('Token is missing from header');
  const user = users.find((u) => `${TOKEN_PREFIX}${u.id}` === token);
  if (!user) throw new Error('User not found');
  return user;
};

const handle = (endpoint: string, method: string, body: unknown, token?: string): ApiResponse<unknown> => {
  const users = loadUsers();

  if (endpoint === API_ENDPOINTS.AUTH_LOGIN && method === 'POST') {
    const { email, password } = body as SignInRequest;
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    return ok('User successfully logged-in', { token: `${TOKEN_PREFIX}${user.id}` });
  }

  if (endpoint === API_ENDPOINTS.AUTH_SIGNUP && method === 'POST') {
    const data = body as SignUpRequest;
    if (users.some((u) => u.email === data.email)) throw new Error('Email already exists');
    const user: MockUser = { ...data, id: String(Date.now()) };
    saveUsers([...users, user]);
    return ok('User successfully created', toProfile(user));
  }

  if (endpoint === API_ENDPOINTS.USER_PROFILE && method === 'POST') {
    return ok('Successfully got user profile data', toProfile(findUserByToken(users, token)));
  }

  if (endpoint === API_ENDPOINTS.USER_PROFILE && method === 'PUT') {
    const user = { ...findUserByToken(users, token), ...(body as UpdateProfileData) };
    saveUsers(users.map((u) => (u.id === user.id ? user : u)));
    return ok('Successfully updated user profile data', toProfile(user));
  }

  throw new Error(`No mock handler for ${method} ${endpoint}`);
};

export const mockApiCall = async <T>(endpoint: string, options: RequestInit & { token?: string } = {}): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  const body: unknown = typeof options.body === 'string' ? JSON.parse(options.body) : undefined;
  return handle(endpoint, options.method ?? 'GET', body, options.token) as T;
};
