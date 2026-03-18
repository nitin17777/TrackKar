import { useState, useCallback } from 'react';

let toastId = 0;

/**
 * useToast — lightweight toast notification hook.
 * Returns { toasts, toast } where toast({ message, type }) fires a notification.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = 'success', duration = 2800 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return { toasts, toast };
}
