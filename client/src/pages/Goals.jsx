import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  DollarSign,
  Edit,
  Trash2,
  Sparkles,
  PlusCircle,
  Clock,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/LoadingAndSkeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { GoalModal } from '../components/modals/GoalModal';
import toast from 'react-hot-toast';

export const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [deleteGoal, setDeleteGoal] = useState(null);

  const currency = user?.currency || 'INR';

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/goals');
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      toast.error('Failed to load financial goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async () => {
    if (!deleteGoal) return;
    try {
      await api.delete(`/goals/${deleteGoal._id}`);
      toast.success('Goal deleted successfully');
      setDeleteGoal(null);
      fetchGoals();
    } catch (err) {
      toast.error('Failed to delete goal');
    }
  };

  const totalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);
  const overallPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completedGoals = goals.filter((g) => (g.currentAmount || 0) >= (g.targetAmount || 1)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            Financial Goals
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Set milestone targets, deposit savings, and track your road to financial freedom.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedGoal(null);
            setModalMode('create');
            setIsModalOpen(true);
          }}
          className="btn-primary py-2 px-4 text-xs font-bold"
        >
          <Plus size={16} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Top Goals Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
            Total Target Volume
          </p>
          <h3 className="text-2xl font-black text-dark-900 dark:text-white mt-1">
            {formatCurrency(totalTarget, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Combined across {goals.length} target items</p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-success-500">
            Total Accumulated Saved
          </p>
          <h3 className="text-2xl font-black text-success-500 mt-1">
            {formatCurrency(totalSaved, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">
            {overallPercentage.toFixed(1)}% of grand milestone secured
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Goals Completed
          </p>
          <h3 className="text-2xl font-black text-primary-500 mt-1">
            {completedGoals} / {goals.length}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Milestones reached at 100%</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-dark-900 dark:text-white">
          Active Goals ({goals.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton count={6} className="h-56" />
          </div>
        ) : goals.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
            <EmptyState
              icon="Target"
              title="No financial goals set yet"
              description="Create a savings goal (e.g., Laptop, Vehicle down-payment, Emergency fund) and start depositing towards it."
              actionText="+ Create First Goal"
              onAction={() => {
                setSelectedGoal(null);
                setModalMode('create');
                setIsModalOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {goals.map((g) => {
              const saved = g.currentAmount || 0;
              const target = g.targetAmount || 1;
              const percent = Math.min(Math.round((saved / target) * 100), 100);
              const isCompleted = saved >= target;
              const remaining = Math.max(0, target - saved);

              // Deadline remaining calculation
              let deadlineText = null;
              if (g.deadline) {
                const diffDays = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                if (diffDays < 0) {
                  deadlineText = 'Deadline passed';
                } else if (diffDays === 0) {
                  deadlineText = 'Due today';
                } else {
                  deadlineText = `${diffDays} days left`;
                }
              }

              // Circular progress stroke math
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (percent / 100) * circumference;

              return (
                <motion.div
                  key={g._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Title & Options */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center font-bold">
                          <Target size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-900 dark:text-white text-sm">
                            {g.name}
                          </h3>
                          {deadlineText && (
                            <span className="flex items-center gap-1 text-[11px] text-dark-400 mt-0.5">
                              <Clock size={11} />
                              <span>{deadlineText}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedGoal(g);
                            setModalMode('edit');
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-dark-400 hover:text-primary-500 rounded-lg"
                          title="Edit Goal"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteGoal(g)}
                          className="p-1.5 text-dark-400 hover:text-danger-500 rounded-lg"
                          title="Delete Goal"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Circular & Details Split */}
                    <div className="flex items-center justify-between mt-5">
                      <div>
                        <p className="text-[11px] font-bold text-dark-400 uppercase tracking-wider">
                          Saved
                        </p>
                        <p className="text-xl font-black text-dark-900 dark:text-white mt-0.5">
                          {formatCurrency(saved, currency)}
                        </p>
                        <p className="text-xs text-dark-400 mt-1">
                          Target: {formatCurrency(target, currency)}
                        </p>
                      </div>

                      {/* Circular Animated Meter */}
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            className="text-dark-100 dark:text-dark-800"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke={isCompleted ? '#10b981' : '#8b5cf6'}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-sm font-black text-dark-900 dark:text-white">
                            {percent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Quick Deposit button */}
                  <div className="pt-4 mt-4 border-t border-dark-100 dark:border-dark-800/80 flex items-center justify-between gap-3">
                    <span className="text-xs text-dark-400">
                      {isCompleted ? (
                        <span className="text-success-500 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Completed!
                        </span>
                      ) : (
                        `Need ${formatCurrency(remaining, currency)} more`
                      )}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedGoal(g);
                        setModalMode('deposit');
                        setIsModalOpen(true);
                      }}
                      className="btn-primary py-1.5 px-3 text-xs font-bold shrink-0"
                    >
                      <PlusCircle size={14} />
                      <span>Deposit</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal (Create / Edit / Deposit) */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={selectedGoal}
        mode={modalMode}
        onSuccess={fetchGoals}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteGoal)}
        onClose={() => setDeleteGoal(null)}
        onConfirm={handleDelete}
        title="Delete Financial Goal"
        message={`Are you sure you want to delete the goal "${deleteGoal?.name}"?`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
