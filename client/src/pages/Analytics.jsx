import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  Calendar,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { CategoryDonut } from '../components/charts/CategoryDonut';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { WeeklyChart } from '../components/charts/WeeklyChart';
import { Skeleton } from '../components/common/LoadingAndSkeleton';

export const Analytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const currency = user?.currency || 'INR';

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [sumRes, catRes, monthRes, weekRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get(`/analytics/categories?period=${period}`),
        api.get('/analytics/monthly?months=12'),
        api.get('/analytics/weekly')
      ]);

      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (monthRes.data.success) setMonthlyData(monthRes.data.data);
      if (weekRes.data.success) setWeeklyData(weekRes.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  // Dynamically calculate spending insights from real data
  const generateDynamicInsights = () => {
    const insights = [];

    const totalExp = summary?.totalExpense || 0;
    const totalInc = summary?.totalIncome || 0;
    const expChange = summary?.expenseChange || 0;
    const incChange = summary?.incomeChange || 0;

    // Insight 1: Highest category
    if (categories.length > 0) {
      const highestCat = [...categories].sort((a, b) => b.total - a.total)[0];
      const highestPct = totalExp > 0 ? ((highestCat.total / totalExp) * 100).toFixed(0) : 0;
      insights.push({
        title: 'Top Expenditure Category',
        text: `Your highest spending category is ${highestCat._id || highestCat.name} at ${formatCurrency(highestCat.total, currency)} (${highestPct}% of all expenses).`,
        type: 'info',
        icon: Zap,
      });
    }

    // Insight 2: Month over Month Change
    if (expChange !== 0) {
      const isUp = expChange > 0;
      insights.push({
        title: 'Monthly Spending Velocity',
        text: `You spent ${Math.abs(expChange).toFixed(1)}% ${isUp ? 'more' : 'less'} this month compared to previous cycle.`,
        type: isUp ? 'warning' : 'positive',
        icon: isUp ? TrendingUp : TrendingDown,
      });
    }

    // Insight 3: Savings Rate
    if (totalInc > 0) {
      const savingsRate = Math.max(0, ((totalInc - totalExp) / totalInc) * 100);
      if (savingsRate >= 20) {
        insights.push({
          title: 'Healthy Savings Rate',
          text: `You have retained ${savingsRate.toFixed(1)}% of your earnings, exceeding the recommended 20% benchmark.`,
          type: 'positive',
          icon: Sparkles,
        });
      } else {
        insights.push({
          title: 'Savings Improvement Opportunity',
          text: `Current savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build a robust emergency fund.`,
          type: 'warning',
          icon: Target,
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        title: 'Smart Insights Engine',
        text: 'Add more transactions to unlock dynamic AI-powered spending habits and behavioral analytics.',
        type: 'info',
        icon: Sparkles,
      });
    }

    return insights;
  };

  const dynamicInsights = generateDynamicInsights();

  // Metrics
  const totalExpense = summary?.totalExpense || 0;
  const totalIncome = summary?.totalIncome || 0;
  const avgDailySpend = totalExpense > 0 ? (totalExpense / 30) : 0;
  const avgMonthlySpend = monthlyData.length > 0
    ? monthlyData.reduce((acc, m) => acc + (m.expense || 0), 0) / monthlyData.length
    : totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Deep dive into spending velocity, category allocations, and cashflow patterns.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-1.5 shadow-sm">
          <Filter size={14} className="text-dark-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent text-xs font-bold text-dark-800 dark:text-dark-200 focus:outline-none cursor-pointer"
          >
            <option value="7d" className="dark:bg-dark-900">Past 7 Days</option>
            <option value="30d" className="dark:bg-dark-900">Past 30 Days</option>
            <option value="3m" className="dark:bg-dark-900">Past 3 Months</option>
            <option value="6m" className="dark:bg-dark-900">Past 6 Months</option>
            <option value="1y" className="dark:bg-dark-900">Past 1 Year</option>
          </select>
        </div>
      </div>

      {/* 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
            Average Daily Spend
          </p>
          <h3 className="text-2xl font-black text-dark-900 dark:text-white mt-1">
            {formatCurrency(avgDailySpend, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Calculated over active window</p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
            Average Monthly Spend
          </p>
          <h3 className="text-2xl font-black text-dark-900 dark:text-white mt-1">
            {formatCurrency(avgMonthlySpend, currency)}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Estimated burn rate per month</p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
            Net Savings Rate
          </p>
          <h3 className="text-2xl font-black text-success-500 mt-1">
            {savingsRate.toFixed(1)}%
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Portion of total income saved</p>
        </div>

        <div className="glass-card p-5 rounded-2xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-dark-400">
            Top Category
          </p>
          <h3 className="text-2xl font-black text-primary-500 mt-1 truncate">
            {categories.length > 0 ? (categories[0]._id || categories[0].name) : 'None'}
          </h3>
          <p className="text-[11px] text-dark-400 mt-2">Leading outgoing channel</p>
        </div>
      </div>

      {/* Dynamic AI Insights Section */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-primary-900/10 via-accent-900/10 to-transparent border border-primary-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Your Spending Insights
            </h3>
            <p className="text-xs text-dark-400">Real-time dynamic observations based on your ledger</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {dynamicInsights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700/60 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    insight.type === 'positive'
                      ? 'bg-success-500/15 text-success-500'
                      : insight.type === 'warning'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-primary-500/15 text-primary-500'
                  }`}>
                    <Icon size={15} />
                  </div>
                  <h4 className="text-xs font-bold text-dark-900 dark:text-white">
                    {insight.title}
                  </h4>
                </div>
                <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed">
                  {insight.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Income vs Expense Trend Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
          <div className="mb-6">
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Income vs Expenses (12 Months History)
            </h3>
            <p className="text-xs text-dark-400">Historical cash in vs cash out comparative timeline</p>
          </div>
          {loading ? (
            <Skeleton className="h-[340px]" />
          ) : (
            <IncomeExpenseChart data={monthlyData} currency={currency} height={340} />
          )}
        </div>

        {/* Right 4 Cols: Category Donut Breakdown */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-dark-400">Where your money goes</p>
          </div>
          {loading ? (
            <Skeleton className="h-[300px] mt-4" />
          ) : (
            <CategoryDonut data={categories} currency={currency} height={300} />
          )}
        </div>
      </div>

      {/* Bottom Velocity & Weekly Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
          <div className="mb-4">
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Monthly Expense Trajectory
            </h3>
            <p className="text-xs text-dark-400">Continuous trend of monthly outflow</p>
          </div>
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <MonthlyChart data={monthlyData} currency={currency} height={240} />
          )}
        </div>

        <div className="lg:col-span-5 glass-card p-6 rounded-3xl bg-white/80 dark:bg-dark-900/80 border border-dark-100 dark:border-dark-800">
          <div className="mb-4">
            <h3 className="text-base font-bold text-dark-900 dark:text-white">
              Weekly Distribution (7 Days)
            </h3>
            <p className="text-xs text-dark-400">Day-of-week spend concentration</p>
          </div>
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <WeeklyChart data={weeklyData} currency={currency} height={230} />
          )}
        </div>
      </div>
    </div>
  );
};
