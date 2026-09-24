import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password);
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
        <h2 className="text-2xl font-black text-dark-900 dark:text-white">Create Account</h2>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Join Spendly and take control of your financial future
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
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

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
            Password (min 6 characters)
          </label>
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-1">
              {(() => {
                let score = 0;
                if (password.length >= 6) score++;
                if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
                if (/[0-9]/.test(password)) score++;
                if (/[^A-Za-z0-9]/.test(password)) score++;

                const labels = ['Weak', 'Fair', 'Good', 'Strong'];
                const colors = ['bg-danger-500', 'bg-amber-500', 'bg-primary-500', 'bg-success-500'];

                return (
                  <div>
                    <div className="flex gap-1.5 h-1">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`flex-1 rounded-full transition-all ${
                            idx < score ? colors[score - 1] : 'bg-dark-200 dark:bg-dark-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-semibold text-dark-400 mt-1">
                      Strength: <span className="font-bold text-dark-800 dark:text-white">{labels[score - 1] || 'Weak'}</span>
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-primary-500/25 mt-4"
        >
          {submitting ? (
            <span className="flex items-center gap-2">Creating Account...</span>
          ) : (
            <>
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-dark-500 dark:text-dark-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary-500 hover:underline">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
};
