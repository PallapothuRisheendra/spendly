import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, currency = 'INR' }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const monthTitle = item.month || label;
    const spentAmount = payload[0].value || 0;
    return (
      <div className="glass-card p-3 rounded-2xl border border-dark-200 dark:border-dark-700 bg-white/95 dark:bg-dark-900/95 shadow-xl text-xs space-y-1">
        <p className="font-extrabold text-dark-900 dark:text-white">{monthTitle}</p>
        <p className="text-primary-500 font-bold">
          Total Spending: <span className="text-dark-900 dark:text-white font-extrabold">{formatCurrency(spentAmount, currency)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const MonthlyChart = ({ data = [], currency = 'INR', height = 280 }) => {
  if (!data || !data.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-dark-400">
        No monthly spending trends available
      </div>
    );
  }

  const maxExpense = Math.max(...data.map(d => d.expense || 0));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis
            dataKey="monthShort"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            allowDecimals={false}
            domain={maxExpense > 0 ? [0, 'auto'] : [0, 10000]}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpense)"
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
