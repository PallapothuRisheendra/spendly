import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, currency = 'INR' }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const title = item.fullDay || label;
    const amount = payload[0].value || 0;
    return (
      <div className="glass-card p-3 rounded-2xl border border-dark-200 dark:border-dark-700 bg-white/95 dark:bg-dark-900/95 shadow-xl text-xs space-y-1">
        <p className="font-extrabold text-dark-900 dark:text-white">{title}</p>
        <p className="text-accent-500 font-bold">
          Spent: <span className="text-dark-900 dark:text-white font-extrabold">{formatCurrency(amount, currency)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const WeeklyChart = ({ data = [], currency = 'INR', height = 220 }) => {
  if (!data || !data.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-dark-400">
        No weekly spending records
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount || 0));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weeklyBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
              <stop offset="100%" stopColor="#0891b2" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            allowDecimals={false}
            domain={maxAmount > 0 ? [0, 'auto'] : [0, 5000]}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Bar
            dataKey="amount"
            fill="url(#weeklyBarGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
