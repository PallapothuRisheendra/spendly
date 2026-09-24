import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatPercentage, getCurrentMonth, getMonthName } from '../utils/formatters';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { CategoryDonut } from '../components/charts/CategoryDonut';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { WeeklyChart } from '../components/charts/WeeklyChart';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/LoadingAndSkeleton';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Receipt,
  Sparkles,
  Calendar,
  Filter,
  PieChart,
  Target,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [period, setPeriod] = useState('30d');

  const currency = user?.currency || 'INR';
  const currentMonth = getCurrentMonth();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, catRes, monthRes, weekRes, txRes, budgetRes, goalRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get(`/analytics/categories?period=${period}`),
        api.get('/analytics/monthly?months=6'),
        api.get('/analytics/weekly'),
        api.get('/transactions?limit=5&sort=newest'),
        api.get(`/budgets?month=${currentMonth}`),
        api.get('/goals')
      ]);

      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (monthRes.data.success) setMonthlyData(monthRes.data.data);
      if (weekRes.data.success) setWeeklyData(weekRes.data.data);
      if (txRes.data.success) setRecentTransactions(txRes.data.data);
      if (budgetRes.data.success) setBudgets(budgetRes.data.data);
      if (goalRes.data.success) setGoals(goalRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const statCards = [
    {
      title: 'Total Balance',
      amount: summary?.totalBalance || 0,
      change: summary?.incomeChange || 0,
      isPositive: (summary?.totalBalance || 0) >= 0,
      icon: Wallet,
      iconBg: 'bg-violet-500/20 text-violet-400',
    },
    {
      title: 'Total Income',
      amount: summary?.currentMonthIncome || summary?.totalIncome || 0,
      change: summary?.incomeChange || 0,
      isPositive: (summary?.incomeChange || 0) >= 0,
      icon: TrendingUp,
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      title: 'Total Expenses',
      amount: summary?.currentMonthExpense || summary?.totalExpense || 0,
      change: summary?.expenseChange || 0,
      isPositive: (summary?.expenseChange || 0) <= 0,
      icon: TrendingDown,
      iconBg: 'bg-rose-500/20 text-rose-400',
    },
    {
      title: 'Net Savings',
      amount: summary?.currentMonthSavings || summary?.savings || 0,
      change: summary?.incomeChange || 0,
      isPositive: (summary?.currentMonthSavings || 0) >= 0,
      icon: PiggyBank,
      iconBg: 'bg-cyan-500/20 text-cyan-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Welcome back, <span className="font-semibold text-primary-500">{user?.name || 'Explorer'}</span>. Here is your cashflow overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-1.5 shadow-sm">
            <Filter size={14} className="text-dark-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent text-xs font-semibold text-dark-700 dark:text-dark-200 focus:outline-none cursor-pointer"
            >
              <option value="7d" className="dark:bg-dark-900">Last 7 Days</option>
              <option value="30d" className="dark:bg-dark-900">Last 30 Days</option>
              <option value="3m" className="dark:bg-dark-900">Last 3 Months</option>
              <option value="6m" className="dark:bg-dark-900">Last 6 Months</option>
              <option value="1y" className="dark:bg-dark-900">Last 1 Year</option>
            </select>
          </div>

          <Link
            to="/add-expense"
            className="btn-primary py-2 px-4 text-xs font-bold"
          >
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <Skeleton count={4} className="h-36" />
        ) : (
          statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card p-5 relative rounded-2xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-dark-900 dark:text-white tracking-tight">
                  <AnimatedCounter
                    value={card.amount}
                    prefix={currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                  />
                </h3>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-100 dark:border-dark-800/80 text-xs">
                  <span
                    className={`inline-flex items-center font-bold ${
                      card.isPositive ? 'text-success-500' : 'text-danger-500'
                    }`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight size={14} className="mr-0.5" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-0.5" />
                    )}
                    {formatPercentage(card.change)}
                  </span>
                  <span className="text-dark-400 text-[11px]">vs last month</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Income vs Expense comparison */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-dark-900 dark:text-white">
                Income vs Expense Trends
              </h3>
              <p className="text-xs text-dark-400">Monthly cashflow distribution</p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-[300px]" />
          ) : (
            <IncomeExpenseChart data={monthlyData} currency={currency} height={300} />
          )}
        </div>

        {/* Right: Expense Category Donut */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Category Breakdown
            </h3>
            <p className="text-xs text-dark-400">Expense split across categories</p>
          </div>
          {loading ? (
            <Skeleton className="h-[300px] mt-4" />
          ) : (
            <CategoryDonut data={categories} currency={currency} height={280} />
          )}
        </div>
      </div>

      {/* Secondary Charts Row: Monthly area & Weekly bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Expense Curve */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80">
          <div className="mb-4">
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Spending Velocity
            </h3>
            <p className="text-xs text-dark-400">Monthly expense trajectory</p>
          </div>
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <MonthlyChart data={monthlyData} currency={currency} height={240} />
          )}
        </div>

        {/* Weekly Expense Bar */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80">
          <div className="mb-4">
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Weekly Distribution
            </h3>
            <p className="text-xs text-dark-400">Day-by-day expenditure pattern</p>
          </div>
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <WeeklyChart data={weeklyData} currency={currency} height={220} />
          )}
        </div>
      </div>

      {/* Budget Progress & Goals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Monthly Budget Progress */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                <PieChart size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark-900 dark:text-white">
                  Monthly Budgets
                </h3>
                <p className="text-xs text-dark-400">{getMonthName(currentMonth)} allocation</p>
              </div>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <Skeleton count={3} className="h-14 my-2" />
          ) : budgets.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-dark-400">No monthly budgets configured yet.</p>
              <Link to="/budgets" className="text-xs font-bold text-primary-500 hover:underline mt-1 inline-block">
                + Set category budget
              </Link>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {budgets.slice(0, 4).map((b) => {
                const spent = b.spent || 0;
                const limit = b.amount || 1;
                const percent = Math.min(Math.round((spent / limit) * 100), 100);
                const isOver = spent > limit;
                const isWarn = !isOver && percent >= 70;

                let barColor = 'bg-gradient-to-r from-primary-500 to-accent-400';
                if (isOver) barColor = 'bg-gradient-to-r from-danger-600 to-danger-500';
                else if (isWarn) barColor = 'bg-gradient-to-r from-amber-500 to-orange-500';

                return (
                  <div key={b._id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-dark-800 dark:text-dark-200">
                        <CategoryIcon name={b.category === 'Food' ? 'UtensilsCrossed' : b.category === 'Shopping' ? 'ShoppingBag' : b.category === 'Transport' ? 'Car' : b.category === 'Bills' ? 'Receipt' : 'Folder'} size={14} />
                        <span>{b.category}</span>
                      </div>
                      <span className="font-semibold text-dark-500 dark:text-dark-400">
                        {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Financial Goals Progress */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center font-bold">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark-900 dark:text-white">
                  Savings Goals
                </h3>
                <p className="text-xs text-dark-400">Target milestones progress</p>
              </div>
            </div>
            <Link
              to="/goals"
              className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <Skeleton count={3} className="h-14 my-2" />
          ) : goals.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-dark-400">No active financial goals yet.</p>
              <Link to="/goals" className="text-xs font-bold text-primary-500 hover:underline mt-1 inline-block">
                + Set savings goal
              </Link>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {goals.slice(0, 3).map((g) => {
                const saved = g.currentAmount || 0;
                const target = g.targetAmount || 1;
                const percent = Math.min(Math.round((saved / target) * 100), 100);
                const isCompleted = saved >= target;

                return (
                  <div key={g._id} className="p-3.5 rounded-2xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-dark-900 dark:text-white">{g.name}</span>
                        {isCompleted && (
                          <span className="text-success-500 font-bold text-[10px] flex items-center gap-0.5">
                            <CheckCircle2 size={12} /> Done
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-extrabold text-primary-500">
                        {percent}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-dark-400">
                      <span>Saved: {formatCurrency(saved, currency)}</span>
                      <span>Target: {formatCurrency(target, currency)}</span>
                    </div>

                    <div className="w-full h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${isCompleted ? 'bg-success-500' : 'bg-gradient-to-r from-primary-500 to-accent-400'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Spending Insights Banner */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-primary-900/10 via-accent-900/10 to-transparent border border-primary-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-dark-900 dark:text-white">
                Spending Insights & Tips
              </h3>
              <p className="text-xs text-dark-400">Automated behavioral analysis from your active records</p>
            </div>
          </div>
          <Link
            to="/analytics"
            className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
          >
            <span>Analytics</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700/60 shadow-xs">
            <p className="text-xs font-bold text-primary-500 mb-1">Top Expense Channel</p>
            <p className="text-xs text-dark-700 dark:text-dark-300">
              {categories.length > 0
                ? `${categories[0].category || categories[0]._id} represents ${categories[0].percentage || 0}% of your total outflow.`
                : 'Log expenses to see where your money flows.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700/60 shadow-xs">
            <p className="text-xs font-bold text-emerald-500 mb-1">Savings Performance</p>
            <p className="text-xs text-dark-700 dark:text-dark-300">
              {(summary?.totalIncome || 0) > 0
                ? `You have preserved ${Math.max(0, (((summary?.totalIncome - summary?.totalExpense) / summary?.totalIncome) * 100)).toFixed(1)}% of total income as net surplus.`
                : 'Positive cashflow is being maintained.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700/60 shadow-xs">
            <p className="text-xs font-bold text-cyan-500 mb-1">Budget Health</p>
            <p className="text-xs text-dark-700 dark:text-dark-300">
              {budgets.length > 0
                ? `${budgets.filter(b => (b.spent || 0) <= (b.amount || 1)).length} of ${budgets.length} monthly categories are currently within spending limits.`
                : 'Set category targets in the Budgets tab to prevent overspending.'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-dark-400">Latest recorded transactions</p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <Skeleton count={5} className="h-14 my-2" />
        ) : recentTransactions.length === 0 ? (
          <EmptyState
            icon="Receipt"
            title="No transactions recorded yet"
            description="Start tracking your cashflow by logging your very first expense or income."
            actionText="+ Add Transaction"
            onAction={() => window.location.href = '/add-expense'}
          />
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700/50 hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                    <CategoryIcon name={tx.category === 'Food' ? 'UtensilsCrossed' : tx.category === 'Shopping' ? 'ShoppingBag' : tx.category === 'Transport' ? 'Car' : tx.category === 'Bills' ? 'Receipt' : 'Folder'} size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark-900 dark:text-white">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-dark-400">
                      <span>{new Date(tx.date).toLocaleDateString('en-IN')}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-dark-200 dark:bg-dark-700 text-dark-700 dark:text-dark-300 font-medium">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-black ${
                      tx.type === 'income' ? 'text-success-500' : 'text-danger-500'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount, currency)}
                  </p>
                  <p className="text-[10px] text-dark-400">{tx.paymentMethod || 'Cash'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

