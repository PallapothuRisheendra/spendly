import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Repeat, Tag, Calendar } from 'lucide-react';
import { EXPENSE_CATEGORIES, FREQUENCIES } from '../../utils/constants';
import { formatDateInput } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const RecurringModal = ({ isOpen, onClose, recurring, onSuccess }) => {
  const isEdit = Boolean(recurring && recurring._id);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [frequency, setFrequency] = useState('Monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState(formatDateInput(new Date()));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recurring) {
      setName(recurring.name || '');
      setAmount(recurring.amount ? String(recurring.amount) : '');
      setCategory(recurring.category || 'Bills');
      setFrequency(recurring.frequency || 'Monthly');
      setNextPaymentDate(recurring.nextPaymentDate ? formatDateInput(recurring.nextPaymentDate) : formatDateInput(new Date()));
    } else {
      setName('');
      setAmount('');
      setCategory('Bills');
      setFrequency('Monthly');
      setNextPaymentDate(formatDateInput(new Date()));
    }
  }, [recurring, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error('Please enter subscription name');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Please enter a valid amount');

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        amount: Number(amount),
        category,
        frequency,
        nextPaymentDate,
      };

      if (isEdit) {
        await api.put(`/recurring/${recurring._id}`, payload);
        toast.success('Subscription updated successfully!');
      } else {
        await api.post('/recurring', payload);
        toast.success('Recurring expense scheduled!');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save recurring expense';
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
                <Repeat size={18} />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                {isEdit ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
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
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Service / Expense Name
              </label>
              <input
                type="text"
                placeholder="e.g. Netflix, Spotify, Gym, Fiber Internet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-dark-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="649"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-9 text-lg font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
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

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                  Frequency
                </label>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq} value={freq} className="dark:bg-dark-900">
                        {freq}
                      </option>
                    ))}
                  </select>
                  <Repeat size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Next Billing Date
              </label>
              <input
                type="date"
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                className="input-field cursor-pointer"
                required
              />
            </div>

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
                {loading ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Recurring'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
