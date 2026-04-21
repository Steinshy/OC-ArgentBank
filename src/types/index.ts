// === Foundation Types ===

export type UserAccountId = string;

export type TransactionType = 'debit' | 'credit';

export interface FieldValidationResult {
  isValid: boolean;
  error: string | null;
}

// === Auth Types ===

export interface AuthCredentials {
  email: string;
  password: string;
}

export type SignInRequest = AuthCredentials;

export interface SignUpRequest extends AuthCredentials {
  firstName: string;
  lastName: string;
}

export type AuthTokenResponse = ApiResponse<{ token: string }>;

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// === User & Profile Types ===

export interface UserProfile {
  id: UserAccountId;
  email: string;
  firstName: string;
  lastName: string;
}

export type UserProfileResponse = ApiResponse<UserProfile>;

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

// === Transaction & Account Types ===

export interface Transaction {
  id: UserAccountId;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: TransactionType;
  category: string;
  notes?: string;
}

export interface Account {
  id: UserAccountId;
  title: string;
  amount: number;
  description: string;
  transactions?: Transaction[];
}

// === UI Component Types ===

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  type: ToastType;
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  dismissing: boolean;
  paused: boolean;
  duration: number;
  action?: ToastAction;
}

// === API Response Types ===

export interface ApiResponse<T> {
  status: number;
  message: string;
  body: T;
}

export interface ApiErrorResponse {
  status?: number;
  message?: string;
  error?: string;
  body?: {
    message?: string;
  };
}
