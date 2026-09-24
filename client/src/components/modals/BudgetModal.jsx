import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PieChart, Tag, Calendar } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { getCurrentMonth } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const BudgetModal = ({ isOpen, onClose, budget, onSuccess }) => {
  const isEdit = Boolean(budget && budget._id);

  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category || 'Food');
      setAmount(budget.amount ? String(budget.amount) : '');
      setMonth(budget.month || getCurrentMonth());
    } else {
      setCategory('Food');
      setAmount('');
      setMonth(getCurrentMonth());
    }
  }, [budget, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid budget limit');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        category,
        amount: Number(amount),
        month,
      };

      if (isEdit) {
        await api.put(`/budgets/${budget._id}`, payload);
        toast.success('Budget limit updated successfully!');
      } else {
        await api.post('/budgets', payload);
        toast.success('Budget created successfully!');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-2xl z-10 my-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <PieChart size={18} />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                {isEdit ? 'Edit Budget' : 'Set Category Budget'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isEdit}
                  className="input-field appearance-none cursor-pointer disabled:opacity-60"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name} className="dark:bg-dark-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Tag size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
              </div>
            </div>

            {/* Monthly Budget Limit */}
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Monthly Spending Limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-dark-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-9 text-lg font-bold"
                  required
                />
              </div>
            </div>

            {/* Month selector */}
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                disabled={isEdit}
                className="input-field cursor-pointer disabled:opacity-60"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-100 dark:border-dark-800">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost px-4 py-2.5 text-xs font-semibold"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 text-xs font-bold"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Budget' : 'Set Budget'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
