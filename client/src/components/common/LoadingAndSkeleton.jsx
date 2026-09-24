import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-primary-500 border-t-transparent`}
      />
      {text && <p className="text-sm font-medium text-dark-400 dark:text-dark-400">{text}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-dark-200 dark:bg-dark-800/80 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};
