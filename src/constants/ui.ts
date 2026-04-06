import type { ComponentType } from 'react';
import { Lock, Zap, BarChart3 } from 'lucide-react';

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const APP = {
  NAME: 'Argent Bank',
  COPYRIGHT_START_YEAR: 2020,
} as const;

export const FEATURES: Feature[] = [
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'Military encryption protects your data 24/7',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Money moves at lightning speed',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Understand your spending patterns',
  },
];

export const BUTTONS = {
  SIGN_IN: 'Sign In',
  REGISTER: 'Register',
  SIGN_OUT: 'Sign Out',
  VIEW_PROFILE: 'View Profile',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  BACK_TO_ACCOUNTS: '← Back to Accounts',
} as const;

export const MESSAGES = {
  LOADING_PROFILE: 'Loading profile...',
  LOADING_TRANSACTIONS: 'Loading transactions...',
  SIGNING_IN: 'Signing in...',
  ACCOUNT_NOT_FOUND: 'Account not found.',
  NO_TRANSACTIONS: 'No transactions found for this account.',
  PROFILE_UPDATED: 'Profile updated successfully.',
} as const;

export const NAVIGATION = {
  VIEW_TRANSACTIONS: 'View transactions',
  HOME_LOGO_ALT: 'Argent Bank Logo',
} as const;

export const FORMS = {
  EDIT_CATEGORY_TITLE: 'Edit category',
  ADD_NOTE_PLACEHOLDER: 'Add a note...',
  EDIT_NOTES_TITLE: 'Edit notes',
} as const;

export const TRANSACTION_CATEGORIES = ['Food', 'Shopping', 'Transportation', 'Salary', 'Transfer', 'Entertainment', 'Health', 'Other'] as const;

export const TRANSACTION_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit',
} as const;

export const getCopyrightText = (): string => {
  const currentYear = new Date().getFullYear();
  const yearRange = APP.COPYRIGHT_START_YEAR === currentYear ? `${currentYear}` : `${APP.COPYRIGHT_START_YEAR}-${currentYear}`;
  return `Copyright ${yearRange} ${APP.NAME}`;
};

export const HOME_PAGE = {
  TITLE: 'Welcome to Argent Bank',
  SUBTITLE: 'Experience premium banking services with Argent Bank.',
} as const;
