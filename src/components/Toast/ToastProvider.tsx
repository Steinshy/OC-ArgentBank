import type { ReactNode } from 'react';

import { ToastContainer } from './Toast';
import { ToastContext } from './ToastContext';
import { useToast as useToastHook } from './useToast';

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toasts, show, dismiss, pause, resume } = useToastHook();

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} onPause={pause} onResume={resume} />
    </ToastContext.Provider>
  );
};
