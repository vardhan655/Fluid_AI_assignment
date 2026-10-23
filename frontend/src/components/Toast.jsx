import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

/**
 * Toast notification component.
 *
 * @param {{ toasts: Array<{ id: number, type: string, message: string }>, removeToast: (id: number) => void }} props
 */
export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const ICON = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const BG = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_COLOR = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
};

function ToastItem({ toast, onDismiss }) {
  const Icon = ICON[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm cursor-pointer ${BG[toast.type]}`}
      onClick={() => onDismiss(toast.id)}
    >
      <Icon size={18} className={`flex-shrink-0 ${ICON_COLOR[toast.type]}`} />
      <p className="text-sm font-medium leading-snug">{toast.message}</p>
    </motion.div>
  );
}
