import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Keyboard } from 'lucide-react';

export const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Shift + A', description: 'Open Quick Add Expense modal' },
    { key: 'Shift + T', description: 'Go to Transactions page' },
    { key: 'Shift + D', description: 'Go to Dashboard' },
    { key: 'Shift + B', description: 'Go to Budgets' },
    { key: 'Shift + G', description: 'Go to Goals' },
    { key: 'Shift + S', description: 'Go to Settings' },
    { key: '?', description: 'Open this Keyboard Shortcuts cheat sheet' },
    { key: 'Esc', description: 'Close any active modal' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-2xl z-10 my-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <Keyboard size={18} />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 space-y-2.5">
            {shortcuts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-50 dark:bg-dark-800/50 border border-dark-100 dark:border-dark-700/50 text-xs"
              >
                <span className="text-dark-700 dark:text-dark-300 font-medium">
                  {item.description}
                </span>
                <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-700 border border-dark-200 dark:border-dark-600 text-dark-900 dark:text-white font-mono font-bold shadow-xs">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
