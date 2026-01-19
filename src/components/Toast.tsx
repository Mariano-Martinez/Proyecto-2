 'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type ToastType = 'success' | 'info' | 'error';

export type ToastMessage = {
  message: string;
  type?: ToastType;
};

export const useToast = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => setToast(null);

  return { toast, showToast, clearToast };
};

export const Toast = ({ toast, onClose }: { toast: ToastMessage | null; onClose: () => void }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 2400);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icon =
    toast.type === 'error' ? (
      <ExclamationCircleIcon className="h-5 w-5 text-[hsl(var(--danger))]" />
    ) : (
      <CheckCircleIcon className="h-5 w-5 text-[hsl(var(--success))]" />
    );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 rounded-2xl border border-subtle bg-[hsl(var(--surface-0)/0.96)] px-4 py-3 shadow-depth-lg backdrop-blur animate-toast">
        {icon}
        <span className="text-sm font-semibold text-default">{toast.message}</span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-muted transition hover:bg-surface-1 hover:text-default"
          aria-label="Cerrar notificación"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
