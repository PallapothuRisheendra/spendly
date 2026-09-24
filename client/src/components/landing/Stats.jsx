import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { Layers, Activity, Target, Zap } from 'lucide-react';

const stats = [
  {
    icon: Activity,
    value: 500000,
    prefix: '',
    suffix: '+',
    label: 'Expenses Tracked',
    description: 'Logged safely across active users'
  },
  {
    icon: Layers,
    value: 12,
    prefix: '',
    suffix: '+',
    label: 'Smart Categories',
    description: 'Granular budget classification'
  },
  {
    icon: Zap,
    value: 99.9,
    prefix: '',
    suffix: '%',
    decimals: 1,
    label: 'Uptime & Reliability',
    description: 'High-availability cloud architecture'
  },
  {
    icon: Target,
    value: 25000,
    prefix: '₹',
    suffix: 'L+',
    label: 'Goals Achieved',
    description: 'Total savings realized by members'
  }
];

export const Stats = () => {
  return (
    <section id="stats" className="py-20 relative bg-gradient-to-b from-primary-950/20 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-3xl border border-dark-100 dark:border-dark-800 text-center relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-dark-900 dark:text-white mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </h3>
                <p className="text-base font-bold text-dark-800 dark:text-dark-200">{stat.label}</p>
                <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
