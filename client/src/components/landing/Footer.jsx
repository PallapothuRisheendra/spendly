import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-dark-100 dark:border-dark-800 bg-white/50 dark:bg-dark-950/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-400 flex items-center justify-center text-white font-bold">
                <Sparkles size={20} />
              </div>
              <span className="text-2xl font-black text-dark-900 dark:text-white">
                Spend<span className="text-primary-500">ly</span>
              </span>
            </Link>
            <p className="text-sm text-dark-500 dark:text-dark-400 max-w-sm">
              The intelligent, modern expense tracker engineered to give you complete visibility and control over your personal finances.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-500 dark:text-dark-400">
              <li>
                <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary-500 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#stats" className="hover:text-primary-500 transition-colors">Statistics</a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard App</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Security */}
          <div>
            <h4 className="text-sm font-bold text-dark-900 dark:text-white mb-4 uppercase tracking-wider">
              Security
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-500 dark:text-dark-400">
              <li>
                <span className="text-dark-400">JWT Authentication</span>
              </li>
              <li>
                <span className="text-dark-400">Bcrypt Password Hashing</span>
              </li>
              <li>
                <span className="text-dark-400">User Data Isolation</span>
              </li>
              <li>
                <span className="text-dark-400">End-to-End REST APIs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-dark-100 dark:border-dark-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-400">
          <p>© {new Date().getFullYear()} Spendly Technologies. Built with pride for modern CSE portfolio.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart size={14} className="text-danger-500 fill-danger-500" /> for smart financial freedom.
          </p>
        </div>
      </div>
    </footer>
  );
};
