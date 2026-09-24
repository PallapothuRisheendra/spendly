import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-50 dark:bg-dark-950 overflow-hidden transition-colors">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/20 dark:bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/20 dark:bg-accent-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top bar with logo and theme toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-400 flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <span className="text-2xl font-black text-dark-900 dark:text-white">
            Spend<span className="text-primary-500">ly</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Outlet />
      </div>
    </div>
  );
};
