import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

import type { ToastItem } from './useToast';
import './styles/Toast.css';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
}

export const ToastContainer = ({ toasts, onDismiss, onPause, onResume }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container" aria-live="polite" role="status">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        const isUrgent = toast.type === 'error' || toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}${toast.dismissing ? ' toast-dismissing' : ''}${toast.paused ? ' toast-paused' : ''}`}
            role={isUrgent ? 'alert' : undefined}
            aria-live={isUrgent ? 'assertive' : undefined}
            onMouseEnter={() => onPause(toast.id)}
            onMouseLeave={() => onResume(toast.id)}
          >
            <div className="toast-icon" aria-hidden="true">
              <Icon size={18} strokeWidth={2.25} />
            </div>

            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
              {toast.action && (
                <button
                  type="button"
                  className="toast-action-btn"
                  onClick={() => {
                    toast.action!.onClick();
                    onDismiss(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button type="button" className="toast-close-btn" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
              <X size={14} strokeWidth={2.5} />
            </button>

            <div className="toast-progress-bar" style={{ '--toast-duration': `${toast.duration}ms` } as React.CSSProperties} />
          </div>
        );
      })}
    </div>,
    document.body
  );
};
