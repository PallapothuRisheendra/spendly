import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PieChart,
  BarChart3,
  Target,
  Repeat,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Add Expense', path: '/add-expense', icon: PlusCircle },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Recurring', path: '/recurring', icon: Repeat },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white flex flex-col transition-colors">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-200 dark:border-dark-800 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800"
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-400 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-xl font-black">
              Spend<span className="text-primary-500">ly</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/settings"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-400 flex items-center justify-center text-white text-xs font-bold"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Link>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Fixed Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white/70 dark:bg-dark-900/70 backdrop-blur-xl border-r border-dark-200 dark:border-dark-800/80 p-5 shrink-0 justify-between">
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 px-2 mb-8 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="text-2xl font-black text-dark-900 dark:text-white">
                Spend<span className="text-primary-500">ly</span>
              </span>
            </Link>

            {/* Nav list */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? 'sidebar-link-active' : 'sidebar-link'
                    }
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom user card & logout */}
          <div className="pt-4 border-t border-dark-200 dark:border-dark-800/80 space-y-3">
            <Link
              to="/settings"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-dark-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-danger-500 hover:bg-danger-500/10 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="relative w-72 max-w-[80vw] bg-white dark:bg-dark-900 h-full p-6 flex flex-col justify-between z-10 shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 mb-4 border-b border-dark-100 dark:border-dark-800">
                    <Link
                      to="/"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-400 flex items-center justify-center text-white">
                        <Sparkles size={18} />
                      </div>
                      <span className="text-xl font-black">
                        Spend<span className="text-primary-500">ly</span>
                      </span>
                    </Link>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-xl text-dark-400 hover:text-dark-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                          }
                        >
                          <Icon size={19} />
                          <span>{item.name}</span>
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-dark-200 dark:border-dark-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger-500 hover:bg-danger-500/10"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Desktop Topbar */}
          <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-dark-200 dark:border-dark-800/80 bg-white/40 dark:bg-dark-900/40 backdrop-blur-md sticky top-0 z-30">
            {/* Search Input */}
            <div className="relative w-80">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
              />
              <input
                type="text"
                placeholder="Search transactions, budgets..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/transactions?search=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-dark-100/70 dark:bg-dark-800/70 border border-dark-200 dark:border-dark-700/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Right Top Actions */}
            <div className="flex items-center gap-4">
              <Link
                to="/add-expense"
                className="btn-primary py-2 px-4 text-xs shadow-md shadow-primary-500/20"
              >
                <PlusCircle size={16} />
                <span>+ Add Expense</span>
              </Link>

              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-xl border border-dark-200 dark:border-dark-700/60 bg-white/70 dark:bg-dark-800/70 text-dark-600 dark:text-dark-300 relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 glass-card bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 p-4 rounded-2xl shadow-2xl z-50"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-dark-100 dark:border-dark-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-dark-900 dark:text-white">
                          Smart Alerts
                        </span>
                        <span className="text-[10px] text-primary-500 font-semibold">Live</span>
                      </div>
                      <div className="py-3 space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                          🎉 Spendly system updated with dynamic insights!
                        </div>
                        <div className="p-2.5 rounded-xl bg-warning-500/10 text-warning-600 dark:text-warning-400">
                          ⚠️ Check your monthly budgets to prevent overspending.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />

              <div className="flex items-center gap-3 pl-3 border-l border-dark-200 dark:border-dark-800">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-dark-900 dark:text-white leading-tight">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-dark-400">
                    {user?.currency || 'INR'} Wallet
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main page view outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
