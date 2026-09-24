import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  DollarSign,
  Bell,
  Lock,
  LogOut,
  Trash2,
  Check,
  Save,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CURRENCIES } from '../utils/constants';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    budgetAlerts: user?.notifications?.budgetAlerts ?? true,
    expenseReminders: user?.notifications?.expenseReminders ?? true,
    goalReminders: user?.notifications?.goalReminders ?? true,
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name cannot be empty');

    setLoadingProfile(true);
    try {
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        currency,
        notifications,
      });

      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Settings updated successfully!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update settings';
      toast.error(msg);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return toast.error('Please provide current and new password');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoadingPassword(true);
    try {
      const res = await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/account');
      toast.success('Account deleted');
      logout();
      window.location.href = '/';
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Manage your personal profile, regional currency, appearance, and security.
        </p>
      </div>

      {/* Section 1: Profile & Currency */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-dark-100 dark:border-dark-800">
          <div className="w-10 h-10 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-dark-900 dark:text-white">
              Profile & Preferences
            </h2>
            <p className="text-xs text-dark-400">Personal details and active currency</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Currency selector */}
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
              Primary Currency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(CURRENCIES).map(([code, cur]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    currency === code
                      ? 'border-primary-500 bg-primary-500/10 text-primary-500 shadow-xs'
                      : 'border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-800/40 text-dark-700 dark:text-dark-300 hover:border-dark-300'
                  }`}
                >
                  <div>
                    <span className="text-base font-black mr-2">{cur.symbol}</span>
                    <span className="text-xs font-bold">{code}</span>
                  </div>
                  {currency === code && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Notification toggles */}
          <div className="pt-4 border-t border-dark-100 dark:border-dark-800/80 space-y-3">
            <h3 className="text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider">
              Notification Preferences
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-800/50 border border-dark-100 dark:border-dark-700/50 cursor-pointer">
                <span className="text-xs font-semibold text-dark-800 dark:text-dark-200">
                  Budget limit threshold alerts (at 70% & 90%)
                </span>
                <input
                  type="checkbox"
                  checked={notifications.budgetAlerts}
                  onChange={(e) =>
                    setNotifications({ ...notifications, budgetAlerts: e.target.checked })
                  }
                  className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-800/50 border border-dark-100 dark:border-dark-700/50 cursor-pointer">
                <span className="text-xs font-semibold text-dark-800 dark:text-dark-200">
                  Subscription & recurring bill due reminders
                </span>
                <input
                  type="checkbox"
                  checked={notifications.expenseReminders}
                  onChange={(e) =>
                    setNotifications({ ...notifications, expenseReminders: e.target.checked })
                  }
                  className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary py-2.5 px-6 text-xs font-bold"
              disabled={loadingProfile}
            >
              <Save size={15} />
              <span>{loadingProfile ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Appearance & Theme */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-dark-900 dark:text-white">
              Interface Theme
            </h2>
            <p className="text-xs text-dark-400">
              Currently in <span className="font-bold">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
          <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Section 3: Security & Password */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-dark-100 dark:border-dark-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-dark-900 dark:text-white">
              Security & Credentials
            </h2>
            <p className="text-xs text-dark-400">Update your account authentication password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary py-2.5 px-6 text-xs font-bold"
              disabled={loadingPassword}
            >
              {loadingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Section 4: Danger Zone */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-danger-500/5 border border-danger-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-danger-600 dark:text-danger-400 flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>Danger Zone</span>
          </h3>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
            Permanently delete your Spendly account and erase all logged transactions, budgets, and goals.
          </p>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn-danger py-2.5 px-5 text-xs font-bold shrink-0"
        >
          <Trash2 size={15} />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Delete Account Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Spendly Account"
        message="Are you absolutely sure you want to permanently delete your account? All your transaction history, budgets, and savings goals will be irretrievably wiped from the database."
        confirmText="Yes, Permanently Delete"
        variant="danger"
      />
    </div>
  );
};
