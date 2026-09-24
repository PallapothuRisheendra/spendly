export const CATEGORIES = [
  { name: 'Food', icon: 'UtensilsCrossed', color: '#f97316', bg: 'bg-orange-500' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Transport', icon: 'Car', color: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Entertainment', icon: 'Gamepad2', color: '#8b5cf6', bg: 'bg-violet-500' },
  { name: 'Bills', icon: 'Receipt', color: '#ef4444', bg: 'bg-red-500' },
  { name: 'Health', icon: 'Heart', color: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Education', icon: 'GraduationCap', color: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Travel', icon: 'Plane', color: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Salary', icon: 'Banknote', color: '#22c55e', bg: 'bg-green-500' },
  { name: 'Freelance', icon: 'Laptop', color: '#6366f1', bg: 'bg-indigo-500' },
  { name: 'Investment', icon: 'TrendingUp', color: '#14b8a6', bg: 'bg-teal-500' },
  { name: 'Gift', icon: 'Gift', color: '#d946ef', bg: 'bg-fuchsia-500' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#64748b', bg: 'bg-slate-500' },
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c =>
  !['Salary', 'Freelance', 'Investment', 'Gift'].includes(c.name)
);

export const INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'Banknote', color: '#22c55e', bg: 'bg-green-500' },
  { name: 'Freelance', icon: 'Laptop', color: '#6366f1', bg: 'bg-indigo-500' },
  { name: 'Investment', icon: 'TrendingUp', color: '#14b8a6', bg: 'bg-teal-500' },
  { name: 'Gift', icon: 'Gift', color: '#d946ef', bg: 'bg-fuchsia-500' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#64748b', bg: 'bg-slate-500' },
];

export const PAYMENT_METHODS = [
  { name: 'Cash', icon: 'Banknote' },
  { name: 'UPI', icon: 'Smartphone' },
  { name: 'Credit Card', icon: 'CreditCard' },
  { name: 'Debit Card', icon: 'CreditCard' },
  { name: 'Bank Transfer', icon: 'Building2' },
  { name: 'Other', icon: 'Wallet' },
];

export const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
};

export const CHART_COLORS = [
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#ef4444',
  '#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#14b8a6',
  '#d946ef', '#22c55e', '#64748b'
];

export const CATEGORY_COLORS = {};
CATEGORIES.forEach(c => { CATEGORY_COLORS[c.name] = c.color; });
