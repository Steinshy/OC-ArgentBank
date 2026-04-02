import { useCallback, useState } from 'react';

export interface ToastItem {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error';
  dismissing: boolean;
}

const TOAST_DURATION = 3000;
const DISMISS_DURATION = 300;

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DISMISS_DURATION);
  }, []);

  const show = useCallback(
    (title: string, message: string, type: 'success' | 'error' = 'success') => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, title, message, type, dismissing: false }]);
      setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss]
  );

  return { toasts, show };
};
