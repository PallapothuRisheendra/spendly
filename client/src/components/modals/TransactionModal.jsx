import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { formatDateInput } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const TransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const isEdit = Boolean(transaction && transaction._id);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type || 'expense');
      setAmount(transaction.amount ? String(transaction.amount) : '');
      setDescription(transaction.description || '');
      setCategory(transaction.category || (transaction.type === 'income' ? 'Salary' : 'Food'));
      setPaymentMethod(transaction.paymentMethod || 'UPI');
      setDate(transaction.date ? formatDateInput(transaction.date) : formatDateInput(new Date()));
      setNotes(transaction.notes || '');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('Food');
      setPaymentMethod('UPI');
      setDate(formatDateInput(new Date()));
      setNotes('');
    }
  }, [transaction, isOpen]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type,
        amount: Number(amount),
        description: description.trim(),
        category,
        paymentMethod,
        date,
        notes: notes.trim(),
      };

      if (isEdit) {
        await api.put(`/transactions/${transaction._id}`, payload);
        toast.success('Transaction updated successfully!');
      } else {
        await api.post('/transactions', payload);
        toast.success('Transaction added successfully!');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save transaction';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-lg bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-2xl z-10 my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                {isEdit ? 'Edit Transaction' : 'New Transaction'}
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
            {/* Type selector toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-dark-100 dark:bg-dark-800/60 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  type === 'expense'
                    ? 'bg-danger-500 text-white shadow-md'
                    : 'text-dark-600 dark:text-dark-400 hover:text-dark-900'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  type === 'income'
                    ? 'bg-success-500 text-white shadow-md'
                    : 'text-dark-600 dark:text-dark-400 hover:text-dark-900'
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
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
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-9 text-lg font-bold"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Description / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Grocery store, Netflix, Freelance payout"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Category & Payment Method in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    {categories.map((cat) => (
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
                  Payment Method
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm.name} value={pm.name} className="dark:bg-dark-900">
                        {pm.name}
                      </option>
                    ))}
                  </select>
                  <CreditCard size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Add additional remarks or receipts info..."
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field resize-none"
              />
            </div>

            {/* Submit buttons */}
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
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : '+ Add Transaction'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
