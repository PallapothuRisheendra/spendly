import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Tag,
  CreditCard,
  Printer,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCsv } from '../utils/exportCsv';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/LoadingAndSkeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TransactionModal } from '../components/modals/TransactionModal';
import { ReportModal } from '../components/modals/ReportModal';
import toast from 'react-hot-toast';

export const Transactions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  // Summary Metrics
  const [summary, setSummary] = useState({
    totalCount: 0,
    totalIncome: 0,
    totalExpense: 0,
  });

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [statementData, setStatementData] = useState(null);

  const currency = user?.currency || 'INR';

  // Fetch summary metrics for user's overall cashflow
  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get('/analytics/summary');
      if (res.data.success && res.data.data) {
        setSummary({
          totalCount: res.data.data.transactionCount || 0,
          totalIncome: res.data.data.totalIncome || 0,
          totalExpense: res.data.data.totalExpense || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching analytics summary for transactions:', err);
    }
  }, []);

  const fetchTransactions = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (search.trim()) params.append('search', search.trim());
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/transactions?${params.toString()}`);
      if (res.data.success) {
        setTransactions(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
      } else {
        throw new Error(res.data.message || 'Failed to retrieve transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions from API:', err);
      setError(err.response?.data?.message || err.message || 'Unable to load transactions');
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [search, type, category, paymentMethod, startDate, endDate, sort]);

  useEffect(() => {
    fetchTransactions(1);
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const handleDelete = async () => {
    if (!deleteTx) return;
    try {
      await api.delete(`/transactions/${deleteTx._id}`);
      toast.success('Transaction deleted successfully!');
      setDeleteTx(null);
      fetchTransactions(pagination.page);
      fetchSummary();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error('No transactions available to export');
      return;
    }
    exportToCsv(transactions, `spendly_transactions_${new Date().toISOString().split('T')[0]}`);
    toast.success('Transactions exported to CSV!');
  };

  const openSummaryReport = async () => {
    try {
      const res = await api.get('/analytics/summary');
      if (res.data.success) {
        setStatementData(res.data.data);
        setIsReportOpen(true);
      }
    } catch (err) {
      console.error('Error fetching statement:', err);
      toast.error('Failed to load financial statement');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setType('');
    setCategory('');
    setPaymentMethod('');
    setStartDate('');
    setEndDate('');
    setSort('newest');
  };

  const hasActiveFilters = Boolean(
    search.trim() || type || category || paymentMethod || startDate || endDate || sort !== 'newest'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Track and manage all your income and expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openSummaryReport}
            className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
            title="View financial statement"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Statement</span>
          </button>

          <button
            onClick={handleExport}
            className="btn-secondary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5"
            title="Download CSV export"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedTx(null);
              setIsModalOpen(true);
            }}
            className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary-500/20"
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 flex items-center justify-between shadow-sm transition-all"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-dark-400">Total Transactions</p>
            <p className="text-xl font-black text-dark-900 dark:text-white mt-0.5">
              {summary.totalCount || pagination.total || transactions.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
            <Receipt size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 flex items-center justify-between shadow-sm transition-all"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-success-500">Total Income</p>
            <p className="text-xl font-black text-success-500 mt-0.5">
              {formatCurrency(summary.totalIncome, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success-500/10 text-success-500 flex items-center justify-center font-bold">
            <ArrowDownRight size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 flex items-center justify-between shadow-sm transition-all"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-danger-500">Total Expenses</p>
            <p className="text-xl font-black text-danger-500 mt-0.5">
              {formatCurrency(summary.totalExpense, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger-500/10 text-danger-500 flex items-center justify-center font-bold">
            <ArrowUpRight size={20} />
          </div>
        </motion.div>
      </div>

      {/* Main Search and Action Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search by description or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type dropdown */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-800 dark:text-dark-200 cursor-pointer focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-800 dark:text-dark-200 cursor-pointer focus:outline-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-800 dark:text-dark-200 cursor-pointer focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>

          {/* Advanced toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-primary-500/10 border-primary-500/30 text-primary-500'
                : 'bg-dark-50 dark:bg-dark-800 border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Advanced Filters (Date range, Payment method) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3 border-t border-dark-100 dark:border-dark-800/80"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-dark-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-dark-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-field py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-dark-400 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="input-field py-1.5 text-xs"
                  >
                    <option value="">All Payment Methods</option>
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm.name} value={pm.name}>
                        {pm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end mt-3">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-danger-500 hover:underline font-semibold"
                  >
                    <X size={13} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction Content Table (Desktop) / Cards (Mobile) */}
      <div className="glass-card rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton count={6} className="h-14 my-2" />
          </div>
        ) : error ? (
          /* Error State with Try Again */
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-danger-500/10 text-danger-500 flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-1">
              Unable to load transactions
            </h3>
            <p className="text-sm text-dark-500 dark:text-dark-400 max-w-sm mx-auto mb-6">
              {error}
            </p>
            <button
              onClick={() => fetchTransactions(pagination.page)}
              className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
            >
              <RefreshCw size={15} />
              <span>Try Again</span>
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon="Receipt"
              title={hasActiveFilters ? 'No transactions found' : 'No transactions yet'}
              description={
                hasActiveFilters
                  ? 'No records match your selected search or filter criteria.'
                  : 'Start tracking your spending by adding your first transaction.'
              }
              actionText={hasActiveFilters ? 'Clear Filters' : 'Add Expense'}
              onAction={
                hasActiveFilters
                  ? clearFilters
                  : () => navigate('/add-expense')
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-dark-50/70 dark:bg-dark-800/40 text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wider border-b border-dark-100 dark:border-dark-800">
                  <tr>
                    <th className="p-4 pl-6">Transaction</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-800/70 text-dark-700 dark:text-dark-300">
                  {transactions.map((tx) => (
                    <motion.tr
                      key={tx._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.03)' }}
                      className="transition-colors group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              tx.type === 'income'
                                ? 'bg-success-500/10 text-success-500'
                                : 'bg-primary-500/10 text-primary-500'
                            }`}
                          >
                            <CategoryIcon
                              name={
                                tx.category === 'Food'
                                  ? 'UtensilsCrossed'
                                  : tx.category === 'Shopping'
                                  ? 'ShoppingBag'
                                  : tx.category === 'Transport'
                                  ? 'Car'
                                  : tx.category === 'Bills'
                                  ? 'Receipt'
                                  : tx.category === 'Salary' || tx.category === 'Freelance'
                                  ? 'CreditCard'
                                  : 'Tag'
                              }
                              size={17}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-dark-900 dark:text-white leading-snug">
                              {tx.description}
                            </p>
                            {tx.notes && (
                              <p className="text-[11px] text-dark-400 line-clamp-1">
                                {tx.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300">
                          {tx.category}
                        </span>
                      </td>

                      <td className="p-4 text-xs font-medium text-dark-500 dark:text-dark-400">
                        {tx.paymentMethod || 'UPI'}
                      </td>

                      <td className="p-4 text-xs text-dark-500 dark:text-dark-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      <td className="p-4 text-right">
                        <span
                          className={`font-black text-sm ${
                            tx.type === 'income' ? 'text-success-500' : 'text-danger-500'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount, currency)}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-dark-400 hover:text-primary-500 hover:bg-primary-500/10 transition-colors"
                            title="Edit transaction"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTx(tx)}
                            className="p-1.5 rounded-lg text-dark-400 hover:text-danger-500 hover:bg-danger-500/10 transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List */}
            <div className="md:hidden p-4 space-y-3">
              {transactions.map((tx) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700/60 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          tx.type === 'income'
                            ? 'bg-success-500/10 text-success-500'
                            : 'bg-primary-500/10 text-primary-500'
                        }`}
                      >
                        <CategoryIcon
                          name={
                            tx.category === 'Food'
                              ? 'UtensilsCrossed'
                              : tx.category === 'Shopping'
                              ? 'ShoppingBag'
                              : tx.category === 'Transport'
                              ? 'Car'
                              : tx.category === 'Bills'
                              ? 'Receipt'
                              : tx.category === 'Salary' || tx.category === 'Freelance'
                              ? 'CreditCard'
                              : 'Tag'
                          }
                          size={18}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-dark-900 dark:text-white text-sm">
                          {tx.description}
                        </p>
                        <p className="text-[11px] text-dark-400">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <span
                      className={`font-black text-sm ${
                        tx.type === 'income' ? 'text-success-500' : 'text-danger-500'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>

                  {tx.notes && (
                    <p className="text-xs text-dark-400 bg-dark-100/50 dark:bg-dark-900/50 p-2 rounded-xl">
                      {tx.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-dark-100 dark:border-dark-700/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-dark-200 dark:bg-dark-700 text-[10px] font-semibold">
                        {tx.category}
                      </span>
                      <span className="text-[11px] text-dark-400">{tx.paymentMethod || 'UPI'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTx(tx);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-primary-500 hover:bg-primary-500/10"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTx(tx)}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-danger-500 hover:bg-danger-500/10"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination controls */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between text-xs text-dark-500 dark:text-dark-400">
                <p>
                  Showing {transactions.length} of {pagination.total} entries
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => fetchTransactions(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-xl border border-dark-200 dark:border-dark-700 disabled:opacity-40 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 font-semibold text-dark-900 dark:text-white">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchTransactions(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 rounded-xl border border-dark-200 dark:border-dark-700 disabled:opacity-40 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Create / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTx}
        onSuccess={() => {
          fetchTransactions(pagination.page);
          fetchSummary();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTx)}
        onClose={() => setDeleteTx(null)}
        onCancel={() => setDeleteTx(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteTx?.description}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        isDanger={true}
      />

      {/* Financial Statement Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        summary={statementData}
        transactions={transactions}
        user={user}
      />
    </motion.div>
  );
};
