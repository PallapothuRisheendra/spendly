import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Password reset instructions sent to your email!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card bg-white/80 dark:bg-dark-900/80 p-8 rounded-3xl border border-dark-200 dark:border-dark-700/70 shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-dark-900 dark:text-white">Reset Password</h2>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Enter your registered email address and we'll send you recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-success-500/10 border border-success-500/20 text-center space-y-4">
          <p className="text-sm font-semibold text-success-600 dark:text-success-400">
            Check your inbox! We've sent a recovery link to <strong>{email}</strong>.
          </p>
          <Link to="/login" className="btn-secondary inline-flex items-center gap-2 text-xs">
            <ArrowLeft size={16} />
            <span>Return to Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-primary-500/25"
          >
            <Send size={16} />
            <span>Send Reset Instructions</span>
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-500 dark:text-dark-400 hover:text-primary-500"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
};
