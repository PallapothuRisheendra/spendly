import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Edit,
  Trash2,
  Calendar,
  Sparkles,
  Wallet,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCurrentMonth, getMonthName } from '../utils/formatters';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/LoadingAndSkeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { BudgetModal } from '../components/modals/BudgetModal';
import toast from 'react-hot-toast';

export const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deleteBudget, setDeleteBudget] = useState(null);

  const currency = user?.currency || 'INR';

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets?month=${selectedMonth}`);
      if (res.data.success) {
        setBudgets(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching budgets:', err);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const handleDelete = async () => {
    if (!deleteBudget) return;
    try {
      await api.delete(`/budgets/${deleteBudget._id}`);
      toast.success('Budget deleted successfully');
      setDeleteBudget(null);
      fetchBudgets();
    } catch (err) {
      toast.error('Failed to delete budget');
    }
  };

  // Calculations
  const totalBudgeted = budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            Budgets & Limits
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Keep track of category allocations and avoid accidental overspending.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar size={15} className="text-dark-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-semibold text-dark-800 dark:text-dark-200 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              setSelectedBudget(null);
              setIsModalOpen(true);
            }}
            className="btn-primary py-2 px-4 text-xs font-bold"
          >
            <Plus size={16} />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Top Monthly Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
          <p className="text-xs font-bold text-dark-400 uppercase tracking-wider">
            Total Budgeted
          </p>
          <h3 className="text-2xl font-black text-dark-900 dark:text-white mt-1">
            {formatCurrency(totalBudgeted, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">
            Across {budgets.length} spending categories for {getMonthName(selectedMonth)}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
          <p className="text-xs font-bold text-dark-400 uppercase tracking-wider">
            Total Spent
          </p>
          <h3 className={`text-2xl font-black mt-1 ${overallPercentage > 90 ? 'text-danger-500' : 'text-primary-500'}`}>
            {formatCurrency(totalSpent, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">
            {overallPercentage.toFixed(1)}% of total monthly allocation consumed
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
          <p className="text-xs font-bold text-dark-400 uppercase tracking-wider">
            Safe Remaining
          </p>
          <h3 className={`text-2xl font-black mt-1 ${totalRemaining < 0 ? 'text-danger-500' : 'text-success-500'}`}>
            {formatCurrency(totalRemaining, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">
            {totalRemaining < 0 ? 'Monthly budget limit breached' : 'Available unspent budget reserve'}
          </p>
        </div>
      </div>

      {/* Budgets Grid List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-dark-900 dark:text-white">
          Category Budgets ({budgets.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton count={6} className="h-44" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
            <EmptyState
              icon="PieChart"
              title="No budgets created for this month"
              description="Establish monthly spending caps for your top categories (e.g. Food, Shopping, Transport) to keep expenses in check."
              actionText="+ Set First Budget"
              onAction={() => {
                setSelectedBudget(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => {
              const spent = b.spent || 0;
              const limit = b.amount || 1;
              const percent = Math.min(Math.round((spent / limit) * 100), 100);
              const isOver = spent > limit;
              const isWarning = !isOver && percent >= 70;
              const remaining = limit - spent;

              // Color classes
              let progressColor = 'bg-gradient-to-r from-primary-500 to-accent-400';
              let badgeColor = 'bg-primary-500/10 text-primary-500 border-primary-500/20';
              let statusLabel = 'On Track';

              if (isOver) {
                progressColor = 'bg-gradient-to-r from-danger-600 to-danger-500';
                badgeColor = 'bg-danger-500/10 text-danger-500 border-danger-500/20';
                statusLabel = 'Exceeded';
              } else if (isWarning) {
                progressColor = 'bg-gradient-to-r from-amber-500 to-orange-500';
                badgeColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                statusLabel = 'Warning (70%+)';
              }

              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                          <CategoryIcon name={b.category === 'Food' ? 'UtensilsCrossed' : b.category === 'Shopping' ? 'ShoppingBag' : b.category === 'Transport' ? 'Car' : b.category === 'Bills' ? 'Receipt' : 'Folder'} size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-900 dark:text-white text-sm">
                            {b.category}
                          </h3>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor} mt-0.5`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedBudget(b);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-dark-400 hover:text-primary-500 rounded-lg transition-colors"
                          title="Edit Limit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteBudget(b)}
                          className="p-1.5 text-dark-400 hover:text-danger-500 rounded-lg transition-colors"
                          title="Delete Budget"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Spent vs Total Amount */}
                    <div className="flex items-baseline justify-between mt-4">
                      <div>
                        <span className="text-xl font-black text-dark-900 dark:text-white">
                          {formatCurrency(spent, currency)}
                        </span>
                        <span className="text-xs text-dark-400 font-medium">
                          {' '}
                          / {formatCurrency(limit, currency)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-dark-500 dark:text-dark-300">
                        {((spent / limit) * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden mt-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${progressColor}`}
                      />
                    </div>
                  </div>

                  {/* Card Footer info */}
                  <div className="pt-4 mt-4 border-t border-dark-100 dark:border-dark-800/80 flex items-center justify-between text-xs">
                    <span className="text-dark-400 text-[11px]">Remaining:</span>
                    <span
                      className={`font-bold ${
                        remaining < 0 ? 'text-danger-500' : 'text-success-500'
                      }`}
                    >
                      {remaining < 0 ? `Over by ${formatCurrency(Math.abs(remaining), currency)}` : `${formatCurrency(remaining, currency)} left`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Set / Edit Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budget={selectedBudget}
        onSuccess={fetchBudgets}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteBudget)}
        onClose={() => setDeleteBudget(null)}
        onConfirm={handleDelete}
        title="Delete Budget Limit"
        message={`Are you sure you want to remove the monthly limit for "${deleteBudget?.category}"?`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
