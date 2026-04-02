import { createPortal } from 'react-dom';

import type { ToastItem } from './useToast';
import './styles/Toast.css';

interface ToastContainerProps {
  toasts: ToastItem[];
}

export const ToastContainer = ({ toasts }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container" aria-live="polite" role="status">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type === 'error' ? 'toast-error' : ''} ${toast.dismissing ? 'toast-dismissing' : ''}`} role={toast.type === 'error' ? 'alert' : undefined}>
          <div className="toast-title">{toast.title}</div>
          <div className="toast-message">{toast.message}</div>
        </div>
      ))}
    </div>,
    document.body
  );
};
