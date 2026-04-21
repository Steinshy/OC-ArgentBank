import { useCallback, useRef, useState } from 'react';
import { ToastAction, ToastItem } from '@/types';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const DISMISS_ANIMATION_DURATION = 250;
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
};
const MAX_TOASTS = 3;

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRefs = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const remainingRefs = useRef(new Map<number, number>());
  const startRefs = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const timeoutId = timerRefs.current.get(id);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timerRefs.current.delete(id);
    remainingRefs.current.delete(id);
    startRefs.current.delete(id);
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DISMISS_ANIMATION_DURATION);
  }, []);

  const scheduleTimer = useCallback(
    (id: number, delay: number) => {
      const timeoutId = setTimeout(() => dismiss(id), delay);
      timerRefs.current.set(id, timeoutId);
      startRefs.current.set(id, Date.now());
      remainingRefs.current.set(id, delay);
    },
    [dismiss]
  );

  const pause = useCallback((id: number) => {
    const timeoutId = timerRefs.current.get(id);
    if (timeoutId === undefined) return;
    clearTimeout(timeoutId);
    timerRefs.current.delete(id);
    const start = startRefs.current.get(id) ?? Date.now();
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, (remainingRefs.current.get(id) ?? 0) - elapsed);
    remainingRefs.current.set(id, remaining);
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, paused: true } : t)));
  }, []);

  const resume = useCallback(
    (id: number) => {
      const remaining = remainingRefs.current.get(id);
      if (remaining === undefined) return;
      scheduleTimer(id, remaining);
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, paused: false } : t)));
    },
    [scheduleTimer]
  );

  const show = useCallback(
    (title: string, message: string, type: ToastType = 'success', action?: ToastAction) => {
      const id = ++toastId;
      const duration = DEFAULT_DURATIONS[type];

      setToasts((prev) => {
        if (prev.length >= MAX_TOASTS) {
          const oldest = prev[0];
          if (oldest) {
            const oldTimeoutId = timerRefs.current.get(oldest.id);
            if (oldTimeoutId !== undefined) clearTimeout(oldTimeoutId);
            timerRefs.current.delete(oldest.id);
            remainingRefs.current.delete(oldest.id);
            startRefs.current.delete(oldest.id);
          }
          return [...prev.slice(1), { id, title, message, type, dismissing: false, paused: false, duration, action }];
        }
        return [...prev, { id, title, message, type, dismissing: false, paused: false, duration, action }];
      });

      scheduleTimer(id, duration);
    },
    [scheduleTimer]
  );

  return { toasts, show, dismiss, pause, resume };
};
