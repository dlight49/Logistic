import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, LucideIcon } from 'lucide-react';
import { cn } from '../utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons: Record<ToastType, LucideIcon> = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const colors: Record<ToastType, string> = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      layout
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl",
        colors[toast.type]
      )}
    >
      <div className={cn(
        "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/10",
        toast.type === 'success' ? "bg-emerald-500" :
        toast.type === 'error' ? "bg-rose-500" : "bg-blue-500"
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1 pt-0.5">
        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{toast.type}</p>
        <p className="text-sm font-bold leading-tight">{toast.message}</p>
      </div>

      <button
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </motion.div>
  );
}
