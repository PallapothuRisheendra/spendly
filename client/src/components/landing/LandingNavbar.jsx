import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, PieChart } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-dark-950/70 backdrop-blur-xl border-b border-dark-100 dark:border-dark-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-dark-900 dark:text-white">
                Spend<span className="text-primary-500">ly</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20">
                v2.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              How It Works
            </a>
            <a href="#stats" className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              Benefits
            </a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-semibold text-dark-700 dark:text-dark-200 hover:text-primary-500 dark:hover:text-primary-400 px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary py-2.5 px-5 text-sm"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-dark-200 dark:border-dark-800 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl px-4 py-6 space-y-4"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-dark-700 dark:text-dark-300 py-2"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-dark-700 dark:text-dark-300 py-2"
            >
              How It Works
            </a>
            <a
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-dark-700 dark:text-dark-300 py-2"
            >
              Benefits
            </a>
            <div className="pt-4 border-t border-dark-200 dark:border-dark-800 flex flex-col gap-3">
              <Link to="/login" className="btn-secondary text-center">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-center">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
