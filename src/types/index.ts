/**
 * API Response Types
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  body: {
    token: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserProfileResponse {
  status: number;
  message: string;
  body: UserProfile;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'debit' | 'credit';
  category: string;
}

export interface Account {
  id: string;
  title: string;
  amount: number;
  description: string;
  transactions?: Transaction[];
}

/**
 * Redux State Types
 */

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ApiError {
  status: number;
  message: string;
}
