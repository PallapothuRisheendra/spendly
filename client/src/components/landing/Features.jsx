import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  PieChart,
  Target,
  Repeat,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Bell,
  Smartphone,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Expense Tracking',
    description: 'Effortlessly log and categorize daily transactions with flexible payment methods, custom notes, and instant tagging.',
    color: 'from-blue-500 to-indigo-600',
    iconColor: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: PieChart,
    title: 'Budget Management',
    description: 'Set smart category-specific budgets with real-time progress bars, automated warning alerts, and remaining spend indicators.',
    color: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive charts featuring Income vs Expense, donut category splits, and monthly trends across 7d, 30d, 3m, 6m, and 1y filters.',
    color: 'from-cyan-500 to-teal-600',
    iconColor: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  },
  {
    icon: Target,
    title: 'Financial Goals',
    description: 'Define personalized saving targets with deadlines, animated progress dials, and one-click money contribution tracking.',
    color: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    icon: Repeat,
    title: 'Recurring Expenses',
    description: 'Keep track of subscription bills (Netflix, Internet, Gym) with daily, weekly, monthly, or yearly frequency schedules.',
    color: 'from-emerald-500 to-green-600',
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: Sparkles,
    title: 'Smart AI Insights',
    description: 'Dynamically generated financial insights that analyze month-over-month variances and identify savings opportunities.',
    color: 'from-pink-500 to-rose-600',
    iconColor: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-dark-50/50 dark:bg-dark-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary-500">
            Engineered For Modern Finance
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Everything You Need To Master Your Money
          </p>
          <p className="text-base sm:text-lg text-dark-600 dark:text-dark-300">
            Spendly combines powerful analytics with an intuitive interface so you stay in total control of every rupee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card p-8 relative rounded-3xl border border-dark-100 dark:border-dark-800/80 bg-white/70 dark:bg-dark-800/50 hover:border-primary-500/30 transition-all group"
              >
                {/* Glow pill behind icon */}
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.iconColor} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
