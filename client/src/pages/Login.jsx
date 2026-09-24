import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card bg-white/80 dark:bg-dark-900/80 p-8 rounded-3xl border border-dark-200 dark:border-dark-700/70 shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-dark-900 dark:text-white">Welcome Back</h2>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Sign in to your Spendly financial dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div>
          <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-dark-300 dark:border-dark-700 bg-white dark:bg-dark-800"
          />
          <label htmlFor="remember-me" className="ml-2.5 text-xs font-medium text-dark-600 dark:text-dark-400">
            Remember me on this device
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-primary-500/25 mt-2"
        >
          {submitting ? (
            <span className="flex items-center gap-2">Signing In...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Demo helper */}
      <div className="mt-6 p-3 rounded-2xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-center">
        <p className="text-[11px] font-medium text-primary-600 dark:text-primary-400">
          Tip: Register a new account or sign in with your credentials to see live isolated data.
        </p>
      </div>

      <div className="mt-6 text-center text-xs text-dark-500 dark:text-dark-400">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-primary-500 hover:underline">
          Create Free Account
        </Link>
      </div>
    </motion.div>
  );
};
