import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar, PlusCircle } from 'lucide-react';
import { formatDateInput } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const GoalModal = ({ isOpen, onClose, goal, mode = 'create', onSuccess }) => {
  const isDepositMode = mode === 'deposit';
  const isEditMode = mode === 'edit' && Boolean(goal && goal._id);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setName(goal.name || '');
      setTargetAmount(goal.targetAmount ? String(goal.targetAmount) : '');
      setCurrentAmount(goal.currentAmount !== undefined ? String(goal.currentAmount) : '0');
      setDeadline(goal.deadline ? formatDateInput(goal.deadline) : '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
    }
    setDepositAmount('');
  }, [goal, isOpen, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (isDepositMode) {
        if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
          toast.error('Please enter a valid deposit amount');
          setLoading(false);
          return;
        }

        const newCurrent = Number(goal.currentAmount || 0) + Number(depositAmount);
        await api.put(`/goals/${goal._id}`, { currentAmount: newCurrent });
        toast.success(`Added ₹${depositAmount} to ${goal.name}!`);
      } else if (isEditMode) {
        if (!name.trim()) return toast.error('Please enter a goal name');
        if (!targetAmount || Number(targetAmount) <= 0) return toast.error('Please enter a valid target amount');

        await api.put(`/goals/${goal._id}`, {
          name: name.trim(),
          targetAmount: Number(targetAmount),
          currentAmount: Number(currentAmount) || 0,
          deadline: deadline || null,
        });
        toast.success('Goal updated successfully!');
      } else {
        if (!name.trim()) return toast.error('Please enter a goal name');
        if (!targetAmount || Number(targetAmount) <= 0) return toast.error('Please enter a valid target amount');

        await api.post('/goals', {
          name: name.trim(),
          targetAmount: Number(targetAmount),
          currentAmount: Number(currentAmount) || 0,
          deadline: deadline || null,
        });
        toast.success('Financial goal created!');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save goal';
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
              <div className="w-9 h-9 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
                <Target size={18} />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                {isDepositMode
                  ? `Add Money to "${goal?.name}"`
                  : isEditMode
                  ? 'Edit Savings Goal'
                  : 'New Financial Goal'}
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
            {isDepositMode ? (
              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-dark-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 5000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="input-field pl-9 text-lg font-bold"
                    autoFocus
                    required
                  />
                </div>
                <p className="text-xs text-dark-400 mt-2">
                  Currently saved: <span className="font-bold text-dark-800 dark:text-dark-200">₹{goal?.currentAmount?.toLocaleString('en-IN') || 0}</span> / ₹{goal?.targetAmount?.toLocaleString('en-IN')}
                </p>
              </div>
            ) : (
              <>
                {/* Goal Title */}
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MacBook Pro, Emergency Fund, Bali Vacation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* Target & Current */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                      Target (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="80000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                      Initial Saved (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider mb-1.5">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="input-field cursor-pointer"
                  />
                </div>
              </>
            )}

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
                {loading
                  ? 'Saving...'
                  : isDepositMode
                  ? '+ Deposit Funds'
                  : isEditMode
                  ? 'Update Goal'
                  : 'Create Goal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
