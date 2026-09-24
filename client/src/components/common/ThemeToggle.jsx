import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border border-dark-200 dark:border-dark-700/60 bg-white/70 dark:bg-dark-800/70 text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors shadow-sm backdrop-blur-md ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-violet-600" />}
    </motion.button>
  );
};
