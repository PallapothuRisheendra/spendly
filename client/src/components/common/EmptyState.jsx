import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

export const EmptyState = ({
  icon = 'Inbox',
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction,
}) => {
  const IconComponent = LucideIcons[icon] || LucideIcons.FolderOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex flex-col items-center justify-center p-12 text-center my-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 flex items-center justify-center mb-4 shadow-inner">
        <IconComponent size={32} />
      </div>
      <h3 className="text-lg font-bold text-dark-800 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-dark-500 dark:text-dark-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
