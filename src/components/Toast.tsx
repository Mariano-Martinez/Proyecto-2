 'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

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
      <ExclamationCircleIcon className="h-5 w-5 text-rose-500" />
    ) : (
      <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
    );

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {icon}
          <span className="text-sm font-semibold text-slate-900">{toast.message}</span>
          <button
            onClick={onClose}
            className="ui-transition ui-icon-press ui-focus-ring rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar notificación"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
