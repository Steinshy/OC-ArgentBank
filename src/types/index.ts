import type { ComponentType } from 'react';

// Validation Types

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

// Form Types

export interface FieldErrors {
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
}

// UI Component Types

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
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

export interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// API Contract Types

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

// API Response Types

export interface ApiErrorResponse {
  status?: number;
  message?: string;
  error?: string;
  body?: {
    message?: string;
  };
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  status: number;
  message: string;
  body: {
    token: string;
  };
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignUpResponse {
  status: number;
  message: string;
  body: { token: string };
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface MockUser extends UserProfile {
  password: string;
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
  notes?: string;
}

export interface Account {
  id: string;
  title: string;
  amount: number;
  description: string;
  transactions?: Transaction[];
}

/* Redux State Types */

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ApiError {
  status: number;
  message: string;
}
