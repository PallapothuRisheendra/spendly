import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, LineChart, Award } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'Add your expenses',
    description: 'Quickly record your daily income and expenditures with easy categorization, tags, and payment types.',
  },
  {
    step: '02',
    icon: LineChart,
    title: 'Analyze your spending',
    description: 'Understand exactly where your cash flows with automated graphs, budget thresholds, and month-on-month trends.',
  },
  {
    step: '03',
    icon: Award,
    title: 'Improve your finances',
    description: 'Hit your savings goals faster, eliminate unneeded subscriptions, and build sustainable wealth habits.',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary-500">
            Simple 3-Step Process
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-dark-900 dark:text-white">
            How Spendly Transforms Your Finances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative glass-card p-8 rounded-3xl bg-white/60 dark:bg-dark-900/60 border border-dark-100 dark:border-dark-800 text-center flex flex-col items-center"
              >
                <div className="absolute -top-5 px-4 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white font-extrabold text-xs shadow-md">
                  Step {item.step}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 flex items-center justify-center my-4">
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
