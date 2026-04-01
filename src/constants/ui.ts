/**
 * UI text, labels, and constants
 */

// App branding
export const APP = {
  NAME: 'Argent Bank',
  COPYRIGHT_START_YEAR: 2020,
} as const;

// Button labels
export const BUTTONS = {
  SIGN_IN: 'Sign In',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  BACK_TO_ACCOUNTS: '← Back to Accounts',
} as const;

// Loading and status messages
export const MESSAGES = {
  LOADING_PROFILE: 'Loading profile...',
  LOADING_TRANSACTIONS: 'Loading transactions...',
  SAVING: 'Saving...',
  ACCOUNT_NOT_FOUND: 'Account not found.',
  NO_TRANSACTIONS: 'No transactions found for this account.',
} as const;

// Links and navigation text
export const NAVIGATION = {
  VIEW_TRANSACTIONS: 'View transactions',
  HOME_LOGO_ALT: 'Argent Bank Logo',
} as const;

// Form labels and placeholders
export const FORMS = {
  EDIT_CATEGORY_TITLE: 'Edit category',
  ADD_NOTE_PLACEHOLDER: 'Add a note...',
  EDIT_NOTES_TITLE: 'Edit notes',
} as const;

// Transaction categories
export const TRANSACTION_CATEGORIES = ['Food', 'Shopping', 'Transportation', 'Salary', 'Transfer', 'Entertainment', 'Health', 'Other'] as const;

// Transaction types
export const TRANSACTION_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit',
} as const;

/**
 * Get copyright text with dynamic current year
 */
export const getCopyrightText = (): string => {
  const currentYear = new Date().getFullYear();
  const yearRange = APP.COPYRIGHT_START_YEAR === currentYear ? `${currentYear}` : `${APP.COPYRIGHT_START_YEAR}-${currentYear}`;
  return `Copyright ${yearRange} ${APP.NAME}`;
};

// Home page content
export const HOME_PAGE = {
  TITLE: 'Welcome to Argent Bank',
  SUBTITLE: 'Experience premium banking services with Argent Bank.',
} as const;
