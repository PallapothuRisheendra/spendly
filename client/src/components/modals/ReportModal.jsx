import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, Sparkles, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ReportModal = ({ isOpen, onClose, summary, transactions, user }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currency = user?.currency || 'INR';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm print:hidden"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-3xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 print:border-none print:shadow-none print:m-0 print:p-6 print:w-full"
        >
          {/* Top Bar with actions */}
          <div className="flex items-center justify-between pb-6 border-b border-dark-100 dark:border-dark-800 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                Financial Summary Report
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn-secondary py-2 px-3 text-xs font-bold"
              >
                <Printer size={15} />
                <span>Print Report</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="mt-6 space-y-6">
            {/* Header / Brand */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-dark-900 dark:text-white tracking-tight">
                  Spend<span className="text-primary-500">ly</span>
                </h1>
                <p className="text-xs text-dark-400">Official Monthly Statement</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-dark-800 dark:text-dark-200">
                  {user?.name || 'Account Holder'}
                </p>
                <p className="text-xs text-dark-400">
                  Generated: {formatDate(new Date())}
                </p>
              </div>
            </div>

            {/* Stats Summary Box */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700/60">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
                  Total Balance
                </p>
                <p className="text-xl font-black text-dark-900 dark:text-white mt-1">
                  {formatCurrency(summary?.totalBalance || 0, currency)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-success-500">
                  Total Income
                </p>
                <p className="text-xl font-black text-success-500 mt-1">
                  +{formatCurrency(summary?.totalIncome || 0, currency)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-danger-500">
                  Total Expenses
                </p>
                <p className="text-xl font-black text-danger-500 mt-1">
                  -{formatCurrency(summary?.totalExpense || 0, currency)}
                </p>
              </div>
            </div>

            {/* Transactions Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-500 dark:text-dark-400 mb-3">
                Recent Logged Transactions ({transactions?.length || 0})
              </h3>
              <div className="overflow-x-auto rounded-xl border border-dark-100 dark:border-dark-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-dark-100/60 dark:bg-dark-800/60 text-dark-600 dark:text-dark-300 font-bold border-b border-dark-200 dark:border-dark-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Method</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-100 dark:divide-dark-800 text-dark-700 dark:text-dark-300">
                    {transactions && transactions.length > 0 ? (
                      transactions.slice(0, 15).map((tx) => (
                        <tr key={tx._id}>
                          <td className="p-3 whitespace-nowrap">{formatDate(tx.date)}</td>
                          <td className="p-3 font-semibold text-dark-900 dark:text-white">{tx.description}</td>
                          <td className="p-3">{tx.category}</td>
                          <td className="p-3">{tx.paymentMethod || 'Cash'}</td>
                          <td className={`p-3 text-right font-bold ${tx.type === 'income' ? 'text-success-500' : 'text-danger-500'}`}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-dark-400">
                          No transactions found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between text-[11px] text-dark-400">
              <p>Spendly Smart Financial Tracker • www.spendly.app</p>
              <p>End of report</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
