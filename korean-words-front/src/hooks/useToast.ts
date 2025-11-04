import { useState, useCallback } from 'react';
import type { ToastType } from '../components/ui/Toast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);

  const success = useCallback((message: string) => {
    return show('success', message);
  }, [show]);

  const error = useCallback((message: string) => {
    return show('error', message);
  }, [show]);

  const info = useCallback((message: string) => {
    return show('info', message);
  }, [show]);

  const close = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    success,
    error,
    info,
    close,
  };
}
