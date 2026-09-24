import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Tag,
  CreditCard,
  Calendar,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { formatDateInput } from '../utils/formatters';
import { CategoryIcon } from '../components/common/CategoryIcon';
import toast from 'react-hot-toast';

export const AddExpense = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const currency = user?.currency || 'INR';

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  const addPresetAmount = (increment) => {
    const current = Number(amount) || 0;
    setAmount(String(current + increment));
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

      const res = await api.post('/transactions', payload);
      if (res.data.success) {
        toast.success(
          type === 'income'
            ? 'Income recorded successfully!'
            : 'Expense logged successfully!'
        );
        setLastAdded(res.data.data);
        // Reset form for next entry
        setAmount('');
        setDescription('');
        setNotes('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record transaction';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
          Log Transaction
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Add an expense or income entry into your financial registry.
        </p>
      </div>

      {/* Main Glass Card Form */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expense vs Income Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-dark-100 dark:bg-dark-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-danger-600 to-danger-500 text-white shadow-lg shadow-danger-500/25'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900'
              }`}
            >
              <TrendingDown size={18} />
              <span>Expense</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                type === 'income'
                  ? 'bg-gradient-to-r from-success-600 to-success-500 text-white shadow-lg shadow-success-500/25'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900'
              }`}
            >
              <TrendingUp size={18} />
              <span>Income</span>
            </button>
          </div>

          {/* Amount Field & Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-dark-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-10 text-2xl sm:text-3xl font-black h-16"
                required
                autoFocus
              />
            </div>

            {/* Quick amount increment pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[100, 500, 1000, 2000, 5000].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => addPresetAmount(inc)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-primary-500/10 hover:text-primary-500 hover:border-primary-500/30 border border-transparent transition-all"
                >
                  +₹{inc.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
              Description / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy food delivery, Gym membership, Client freelance payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field text-sm"
              required
            />
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
              {categories.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10 text-primary-500 shadow-sm'
                        : 'border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-800/40 text-dark-700 dark:text-dark-300 hover:border-dark-300'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} size={14} />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method & Date in 2 Cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-field cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.name} value={pm.name} className="dark:bg-dark-900">
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-2">
              Notes / Memo (Optional)
            </label>
            <textarea
              placeholder="Tag items, invoice number, or memo notes..."
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-ghost px-5 py-3 text-xs font-bold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-3 px-8 text-xs font-bold shadow-lg shadow-primary-500/25"
              disabled={loading}
            >
              {loading ? (
                'Recording...'
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>{type === 'income' ? 'Save Income' : 'Record Expense'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Banner if recently added */}
      <AnimatePresence>
        {lastAdded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-success-500/10 border border-success-500/20 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3 text-success-600 dark:text-success-400 font-bold">
              <CheckCircle2 size={18} />
              <span>
                Logged "{lastAdded.description}" for ₹{lastAdded.amount.toLocaleString('en-IN')}!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/transactions')}
                className="font-bold text-primary-500 hover:underline flex items-center gap-1"
              >
                <span>View in Ledger</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
