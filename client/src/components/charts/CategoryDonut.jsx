import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, CATEGORY_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, currency = 'INR' }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-card p-3 rounded-xl border border-dark-200 dark:border-dark-700 shadow-xl text-xs space-y-1">
        <p className="font-bold text-dark-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          {data.name}
        </p>
        <p className="text-dark-600 dark:text-dark-300 font-medium">
          Amount: <span className="font-bold text-dark-900 dark:text-white">{formatCurrency(data.value, currency)}</span>
        </p>
        <p className="text-dark-400">
          Share: <span className="font-bold text-primary-500">{data.payload.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryDonut = ({ data = [], currency = 'INR', height = 300 }) => {
  if (!data || !data.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-sm text-dark-400">
        No category expense records found
      </div>
    );
  }

  const chartData = data.map((item, idx) => ({
    name: item.category || item._id,
    value: item.amount || item.total,
    percentage: item.percentage || 0,
    color: CATEGORY_COLORS[item.category || item._id] || CHART_COLORS[idx % CHART_COLORS.length],
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
