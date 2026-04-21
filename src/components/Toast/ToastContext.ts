import { createContext, useContext } from 'react';

import type { ToastAction } from '@/types';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastContextValue {
  show: (title: string, message: string, type?: ToastType, action?: ToastAction) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
