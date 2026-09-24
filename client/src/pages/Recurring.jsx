import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Tag,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/LoadingAndSkeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RecurringModal } from '../components/modals/RecurringModal';
import toast from 'react-hot-toast';

export const Recurring = () => {
  const { user } = useAuth();
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const currency = user?.currency || 'INR';

  const fetchRecurring = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recurring');
      if (res.data.success) {
        setRecurring(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching recurring:', err);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await api.delete(`/recurring/${deleteItem._id}`);
      toast.success('Recurring expense removed');
      setDeleteItem(null);
      fetchRecurring();
    } catch (err) {
      toast.error('Failed to delete recurring expense');
    }
  };

  // Monthly normalized total calculation
  const totalMonthlyBurn = recurring.reduce((acc, item) => {
    const amt = item.amount || 0;
    if (item.frequency === 'Daily') return acc + amt * 30;
    if (item.frequency === 'Weekly') return acc + amt * 4.33;
    if (item.frequency === 'Yearly') return acc + amt / 12;
    return acc + amt; // Monthly
  }, 0);

  const getDueBadge = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: 'bg-danger-500/15 text-danger-500 border-danger-500/30' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', color: 'bg-danger-500/15 text-danger-500 border-danger-500/30' };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays}d`, color: 'bg-amber-500/15 text-amber-500 border-amber-500/30' };
    } else {
      return { text: `In ${diffDays} days`, color: 'bg-primary-500/10 text-primary-500 border-primary-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            Recurring & Subscriptions
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Automate tracking of monthly memberships, bills, and subscription commitments.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="btn-primary py-2 px-4 text-xs font-bold"
        >
          <Plus size={16} />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Top Banner Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
            Estimated Monthly Outflow
          </p>
          <h3 className="text-2xl font-black text-dark-900 dark:text-white mt-1">
            {formatCurrency(totalMonthlyBurn, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Combined recurring burn rate</p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
            Active Subscriptions
          </p>
          <h3 className="text-2xl font-black text-primary-500 mt-1">
            {recurring.length} Active
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Scheduled recurring items</p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Next Up
          </p>
          <h3 className="text-xl font-bold text-dark-900 dark:text-white mt-1 truncate">
            {recurring.length > 0 ? recurring[0].name : 'None due'}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">
            {recurring.length > 0 && recurring[0].nextPaymentDate ? formatDate(recurring[0].nextPaymentDate) : 'No upcoming dues'}
          </p>
        </div>
      </div>

      {/* Recurring Items List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-dark-900 dark:text-white">
          Active Services & Bills ({recurring.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton count={6} className="h-44" />
          </div>
        ) : recurring.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
            <EmptyState
              icon="Repeat"
              title="No recurring expenses or subscriptions logged"
              description="Keep tabs on Netflix, Spotify, Gym memberships, and WiFi by logging them here."
              actionText="+ Add First Subscription"
              onAction={() => {
                setSelectedItem(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recurring.map((item) => {
              const badge = getDueBadge(item.nextPaymentDate);

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                          <CategoryIcon name={item.category === 'Bills' ? 'Receipt' : item.category === 'Entertainment' ? 'Gamepad2' : 'Repeat'} size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-900 dark:text-white text-sm">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-dark-400 font-medium">
                              {item.frequency}
                            </span>
                            <span className="text-dark-300 dark:text-dark-600">•</span>
                            <span className="text-[11px] text-dark-400">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-dark-400 hover:text-primary-500 rounded-lg"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="p-1.5 text-dark-400 hover:text-danger-500 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mt-4">
                      <p className="text-2xl font-black text-dark-900 dark:text-white">
                        {formatCurrency(item.amount, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Next Payment Date & Badge */}
                  <div className="pt-4 mt-4 border-t border-dark-100 dark:border-dark-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-dark-500 dark:text-dark-400 text-[11px]">
                      <Calendar size={13} />
                      <span>{formatDate(item.nextPaymentDate)}</span>
                    </div>

                    {badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recurring={selectedItem}
        onSuccess={fetchRecurring}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Remove Subscription"
        message={`Are you sure you want to stop tracking "${deleteItem?.name}"?`}
        confirmText="Yes, Remove"
        variant="danger"
      />
    </div>
  );
};
