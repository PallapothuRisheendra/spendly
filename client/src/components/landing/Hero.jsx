import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  CreditCard,
  PieChart as PieIcon,
  ShoppingBag,
  Car,
  UtensilsCrossed,
} from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background glowing gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/15 dark:bg-primary-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-accent-500/15 dark:bg-accent-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-pink-500/15 dark:bg-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-8 text-center lg:text-left"
          >
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Zap size={14} className="text-primary-500" />
              <span>Next-Gen Smart Expense Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-dark-900 dark:text-white leading-[1.15]">
              Take Control of <br />
              <span className="gradient-text">Your Money.</span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Track your spending, understand your habits, and reach your financial goals with Spendly. Real-time analytics, automated budgets, and AI-like spending insights.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto btn-primary py-4 px-8 text-base shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto btn-secondary py-4 px-8 text-base"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Micro proof badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-dark-500 dark:text-dark-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-success-500" />
                <span>Bank-grade encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <PieIcon size={16} className="text-accent-500" />
                <span>Zero configuration</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Animated Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            {/* Main Mockup Glass Card */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-dark-900/80 backdrop-blur-2xl border border-white/40 dark:border-dark-700/60 shadow-2xl overflow-hidden">
              {/* Top Header Mockup */}
              <div className="flex items-center justify-between pb-6 border-b border-dark-100 dark:border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    JD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-dark-900 dark:text-white">Alex Morgan</h4>
                    <p className="text-xs text-dark-400">Personal Pro Account</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-success-500/10 text-success-500 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success-500 animate-ping" />
                  <span>Live Sync</span>
                </div>
              </div>

              {/* Total Balance Hero Metric */}
              <div className="py-6">
                <p className="text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                  Total Net Balance
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-dark-900 dark:text-white">
                    ₹<AnimatedCounter value={124850} />
                  </h3>
                  <span className="inline-flex items-center text-xs font-bold text-success-500 bg-success-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp size={12} className="mr-1" /> +14.2%
                  </span>
                </div>
              </div>

              {/* Mini Sparkline Bars */}
              <div className="grid grid-cols-7 gap-2 items-end h-20 mb-6 px-1">
                {[45, 65, 30, 85, 95, 60, 80].map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-accent-400 opacity-90 hover:opacity-100 transition-opacity"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] font-medium text-dark-400">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recent Transactions Mock list */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                  Recent Activity
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <UtensilsCrossed size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark-900 dark:text-white">Fine Dining & Lounge</p>
                      <p className="text-[10px] text-dark-400">Today, 2:30 PM</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-danger-500">-₹1,450</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-800/60 border border-dark-100 dark:border-dark-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark-900 dark:text-white">Apple Store Accessories</p>
                      <p className="text-[10px] text-dark-400">Yesterday</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-danger-500">-₹4,900</span>
                </div>
              </div>
            </div>

            {/* Floating Decorative Card 1: Savings Goal */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -top-6 -right-4 sm:-right-8 p-4 rounded-2xl bg-white dark:bg-dark-800/90 backdrop-blur-xl border border-white/60 dark:border-dark-700 shadow-xl hidden sm:flex items-center gap-3.5 z-20"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-500/15 text-primary-500 flex items-center justify-center font-bold">
                🎯
              </div>
              <div>
                <p className="text-[11px] font-semibold text-dark-400">MacBook Pro Goal</p>
                <p className="text-sm font-extrabold text-dark-900 dark:text-white">₹1,40,000 / ₹1,80,000</p>
                <div className="w-32 h-1.5 bg-dark-100 dark:bg-dark-700 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full w-[78%]" />
                </div>
              </div>
            </motion.div>

            {/* Floating Decorative Card 2: Monthly Spent */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-4 sm:-left-8 p-4 rounded-2xl bg-white dark:bg-dark-800/90 backdrop-blur-xl border border-white/60 dark:border-dark-700 shadow-xl hidden sm:flex items-center gap-3.5 z-20"
            >
              <div className="w-11 h-11 rounded-xl bg-success-500/15 text-success-500 flex items-center justify-center font-bold">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-dark-400">Monthly Spending</p>
                <p className="text-sm font-extrabold text-dark-900 dark:text-white">↓ 8.4% vs last month</p>
                <p className="text-[10px] text-success-500 font-medium">On track with budget</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
