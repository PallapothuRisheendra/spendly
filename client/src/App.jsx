import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { AddExpense } from './pages/AddExpense';
import { Budgets } from './pages/Budgets';
import { Analytics } from './pages/Analytics';
import { Goals } from './pages/Goals';
import { Recurring } from './pages/Recurring';
import { Settings } from './pages/Settings';

// Modals
import { TransactionModal } from './components/modals/TransactionModal';
import { KeyboardShortcutsModal } from './components/modals/KeyboardShortcutsModal';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-dark-500">Loading Spendly...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Only Route Guard (for login/register when already signed in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Keyboard listener and Quick Add helper wrapper
const AppContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        if (user) setQuickAddOpen(true);
      } else if (e.shiftKey && e.key.toUpperCase() === 'T') {
        e.preventDefault();
        if (user) navigate('/transactions');
      } else if (e.shiftKey && e.key.toUpperCase() === 'D') {
        e.preventDefault();
        if (user) navigate('/dashboard');
      } else if (e.shiftKey && e.key.toUpperCase() === 'B') {
        e.preventDefault();
        if (user) navigate('/budgets');
      } else if (e.shiftKey && e.key.toUpperCase() === 'G') {
        e.preventDefault();
        if (user) navigate('/goals');
      } else if (e.shiftKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
        if (user) navigate('/settings');
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, navigate]);

  return (
    <>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public Authentication Pages */}
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Authenticated Dashboard Pages */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/recurring" element={<Recurring />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Quick Add Transaction Modal */}
      {user && (
        <TransactionModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          onSuccess={() => {
            // refresh data or trigger event
            window.location.reload();
          }}
        />
      )}

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 600,
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
