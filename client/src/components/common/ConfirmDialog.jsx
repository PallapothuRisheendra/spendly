import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const handleCancel = onCancel || onClose;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md glass-card bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 p-6 rounded-2xl shadow-2xl overflow-hidden relative"
          >
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-dark-400 hover:text-dark-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isDanger
                    ? 'bg-danger-500/10 text-danger-500'
                    : 'bg-warning-500/10 text-warning-500'
                }`}
              >
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-dark-900 dark:text-white">{title}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">{message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleCancel} className="btn-secondary">
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={isDanger ? 'btn-danger' : 'btn-primary'}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
