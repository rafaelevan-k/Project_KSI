import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-brand-primary" size={20} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-brand-primary/5 border-brand-primary/10',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 0 }}
          className={`fixed top-4 z-[100] flex items-center space-x-3 md:space-x-4 px-4 py-3 md:px-6 md:py-4 rounded-2xl border shadow-xl ${bgColors[type]} 
            w-[calc(100%-2rem)] md:w-auto md:min-w-[320px] max-w-[calc(100%-2rem)] md:max-w-md
            inset-x-0 mx-auto md:inset-x-auto md:right-8 md:mx-0`}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="flex-1 text-sm font-semibold text-gray-700">{message}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
