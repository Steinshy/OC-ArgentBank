/**
 * WARNING: Development-only mock data for user registration.
 * These are simulated registration responses for local testing only.
 * Ensure VITE_USE_MOCK is never set to "true" in production builds.
 */
import { SignUpRequest, SignUpResponse, Account } from '@/types';
import { MOCK_USERS } from './users';

const MOCK_TOKENS: Map<string, string> = new Map();
const USER_ACCOUNTS: Map<string, Account[]> = new Map();

const generateMockToken = (email: string): string => {
  const token = `mock_token_${btoa(email)}_${Date.now()}`;
  MOCK_TOKENS.set(token, email);
  return token;
};

const generateNewUserAccounts = (userId: string): Account[] => {
  return [
    {
      id: `user-${userId}-account-1`,
      title: `Argent Bank Checking (x${Math.floor(Math.random() * 10000)})`,
      amount: 3250.45,
      description: 'Available Balance',
      transactions: [
        {
          id: `user-${userId}-txn-1`,
          date: '2024-06-20',
          description: 'Amazon Purchase',
          amount: -45.5,
          balance: 3250.45,
          type: 'debit',
          category: 'Shopping',
          notes: '',
        },
        {
          id: `user-${userId}-txn-2`,
          date: '2024-06-19',
          description: 'Salary Deposit',
          amount: 4200.0,
          balance: 3295.95,
          type: 'credit',
          category: 'Salary',
          notes: '',
        },
        {
          id: `user-${userId}-txn-3`,
          date: '2024-06-18',
          description: 'Gas Station',
          amount: -52.3,
          balance: -904.05,
          type: 'debit',
          category: 'Transportation',
          notes: '',
        },
      ],
    },
    {
      id: `user-${userId}-account-2`,
      title: `Argent Bank Savings (x${Math.floor(Math.random() * 10000)})`,
      amount: 15450.8,
      description: 'Available Balance',
      transactions: [
        {
          id: `user-${userId}-txn-4`,
          date: '2024-06-15',
          description: 'Savings Transfer',
          amount: 500.0,
          balance: 15450.8,
          type: 'credit',
          category: 'Transfer',
          notes: '',
        },
        {
          id: `user-${userId}-txn-5`,
          date: '2024-05-20',
          description: 'Interest Payment',
          amount: 25.3,
          balance: 14950.8,
          type: 'credit',
          category: 'Other',
          notes: '',
        },
      ],
    },
    {
      id: `user-${userId}-account-3`,
      title: `Argent Bank Credit Card (x${Math.floor(Math.random() * 10000)})`,
      amount: 420.75,
      description: 'Current Balance',
      transactions: [
        {
          id: `user-${userId}-txn-6`,
          date: '2024-06-20',
          description: 'Restaurant',
          amount: -87.5,
          balance: 420.75,
          type: 'debit',
          category: 'Food',
          notes: '',
        },
        {
          id: `user-${userId}-txn-7`,
          date: '2024-06-18',
          description: 'Payment',
          amount: 500.0,
          balance: 508.25,
          type: 'credit',
          category: 'Transfer',
          notes: '',
        },
      ],
    },
  ];
};

export const registerMockUser = (request: SignUpRequest): SignUpResponse => {
  const { email, password, firstName, lastName } = request;

  // Check if email already exists
  const userExists = MOCK_USERS.some((user) => user.email === email);
  if (userExists) {
    return {
      status: 400,
      message: 'Registration failed',
      body: { token: '' },
    };
  }

  // Create new mock user
  const newUserId = String(MOCK_USERS.length + 1);
  const newUser = {
    id: newUserId,
    email,
    password,
    firstName,
    lastName,
  };

  MOCK_USERS.push(newUser);

  // Generate new fresh accounts for the registered user
  const userAccounts = generateNewUserAccounts(newUserId);

  USER_ACCOUNTS.set(newUserId, userAccounts);

  // Generate mock token
  const token = generateMockToken(email);

  return {
    status: 201,
    message: 'User successfully created',
    body: { token },
  };
};

export const getMockUserAccounts = (userId: string): Account[] => {
  return USER_ACCOUNTS.get(userId) || [];
};
