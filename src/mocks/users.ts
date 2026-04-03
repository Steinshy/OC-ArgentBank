/**
 * WARNING: Development-only mock data.
 * These credentials are for local testing only and must NEVER be used in production.
 * Ensure VITE_USE_MOCK is never set to "true" in production builds.
 */
import { MockUser } from '@/types';

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'tony@stark.com',
    password: 'password123',
    firstName: 'Tony',
    lastName: 'Stark',
  },
  {
    id: '2',
    email: 'steve@rogers.com',
    password: 'password456',
    firstName: 'Steve',
    lastName: 'Rogers',
  },
];
