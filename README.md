# 💎 Spendly – Smart Expense Tracker (Full-Stack Fintech SaaS)

> **Spendly** is a production-grade, modern full-stack personal finance and expense management platform built with **React, Vite, Tailwind CSS, Framer Motion, Express.js, and MongoDB**. Designed with fintech SaaS aesthetics, dark/light modes, glassmorphism, dynamic analytics, real-time budget threshold meters, circular financial goals, and subscription monitoring.

---

## 📸 Highlights & Core Features

- 🎨 **Modern Fintech Glassmorphic UI**: Tailored color palettes, backdrop blur cards, gradient blobs, responsive mobile drawers, and smooth Framer Motion micro-interactions.
- 🌓 **Dual Theme Engine**: Seamless Dark Mode (default) and Light Mode toggle with instant CSS variable transitions.
- 💱 **Multi-Currency Support**: Switch on the fly between **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)** across all calculations and ledger views.
- 📊 **Dynamic Data Visualizations (Recharts)**:
  - Income vs Expense monthly trend lines & bars.
  - Interactive Expense Category Donut chart.
  - Spending velocity curve & weekly distribution graphs.
  - Multi-period filters (7 Days, 30 Days, 3 Months, 6 Months, 1 Year).
- 🧠 **Smart Dynamic Spending Insights**: Real-time dynamically generated financial observations (e.g. *"You spent 18% more on Food this month"*, *"Top expenditure channel is Shopping (42%)"*, *"Healthy Savings Rate of 32%"*).
- 🎯 **Financial Goals with Circular Meters**: Create custom savings milestones, track target deadlines, and make quick deposits with animated circular progress indicators.
- 🥧 **Budget Management & Warning Thresholds**: Set category-specific monthly spending caps with real-time progress bars transitioning from **Normal (0–70%)** to **Warning (70–90%)** and **Exceeded (>90%)**.
- 🔁 **Recurring Expenses & Subscriptions**: Track Netflix, Spotify, Gym, Rent, and WiFi with due-date urgency countdown badges and monthly recurring forecast cards.
- 🧾 **Interactive Ledger & Filtering**: Real-time debounced search, category filtering, payment method filters, date range filters, sorting (newest/oldest/highest/lowest), and mobile-responsive card transitions.
- 📥 **Export & Print Ready**: Export ledger directly to `.csv` spreadsheets or trigger print-friendly financial statements.
- ⌨️ **Keyboard Shortcuts**: Power-user shortcuts (`Shift+A` for Quick Add Expense, `Shift+T` for Transactions, `Shift+D` for Dashboard, `?` for Shortcuts cheat sheet).
- 🔒 **Full Authentication & Data Isolation**: Secure JWT authentication, bcryptjs password hashing, protected routes, and strict MongoDB user tenancy.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, Axios, Recharts, Lucide React, React Hot Toast |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs, Express-Validator, Helmet, Morgan, Cors |
| **Design Style** | Glassmorphism, Modern SaaS Dashboard, Dark/Light Themes, HSL Color Palettes, Responsive Flex/Grid |

---

## 📁 Project Architecture

```text
spendly/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── CategoryDonut.jsx
│   │   │   │   ├── IncomeExpenseChart.jsx
│   │   │   │   ├── MonthlyChart.jsx
│   │   │   │   └── WeeklyChart.jsx
│   │   │   ├── common/
│   │   │   │   ├── AnimatedCounter.jsx
│   │   │   │   ├── CategoryIcon.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── LoadingAndSkeleton.jsx
│   │   │   │   └── ThemeToggle.jsx
│   │   │   ├── landing/
│   │   │   │   ├── CTA.jsx
│   │   │   │   ├── Features.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   ├── LandingNavbar.jsx
│   │   │   │   └── Stats.jsx
│   │   │   └── modals/
│   │   │       ├── BudgetModal.jsx
│   │   │       ├── GoalModal.jsx
│   │   │       ├── KeyboardShortcutsModal.jsx
│   │   │       ├── RecurringModal.jsx
│   │   │       ├── ReportModal.jsx
│   │   │       └── TransactionModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── AddExpense.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Recurring.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── exportCsv.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── goalController.js
│   │   ├── recurringController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Budget.js
│   │   ├── Goal.js
│   │   ├── RecurringExpense.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── budgets.js
│   │   ├── goals.js
│   │   ├── recurring.js
│   │   └── transactions.js
│   ├── utils/
│   │   └── seedData.js
│   ├── server.js
│   └── package.json
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started & Installation

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster connection URI)

### 2. Environment Configuration
Create a `.env` file in the root `spendly/` directory (or use `.env.example` as a template):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spendly
JWT_SECRET=your_ultra_secure_jwt_secret_key_spendly_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Backend Setup
```bash
cd server
npm install
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 4. Optional: Seed Demo Account & Sample Data
To populate a pre-configured demo account with rich transactions, budgets, goals, and subscriptions for presentations/grading:
```bash
cd server
npm run seed
```
> **Demo Credentials:**
> - Email: `demo@spendly.io`
> - Password: `password123`

### 5. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*The client dev server will start on `http://localhost:5173`.*

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `PUT` | `/api/auth/profile` | Update name, currency, notification settings | Yes |
| `PUT` | `/api/auth/password` | Update account password | Yes |
| `DELETE` | `/api/auth/account` | Permanently wipe user account and data | Yes |

### 💳 Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/transactions` | Query & filter transactions (search, date, category, method, sort) | Yes |
| `POST` | `/api/transactions` | Create new income or expense | Yes |
| `GET` | `/api/transactions/:id`| Retrieve single transaction | Yes |
| `PUT` | `/api/transactions/:id`| Update transaction details | Yes |
| `DELETE` | `/api/transactions/:id`| Delete transaction | Yes |

### 🥧 Budgets (`/api/budgets`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/budgets?month=YYYY-MM` | Get category budgets for specific month | Yes |
| `POST` | `/api/budgets` | Set monthly category spending limit | Yes |
| `PUT` | `/api/budgets/:id` | Update budget cap | Yes |
| `DELETE` | `/api/budgets/:id` | Remove category budget | Yes |

### 🎯 Goals (`/api/goals`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/goals` | Retrieve all savings goals | Yes |
| `POST` | `/api/goals` | Create financial savings goal | Yes |
| `PUT` | `/api/goals/:id` | Update goal info or deposit funds | Yes |
| `DELETE` | `/api/goals/:id` | Delete savings goal | Yes |

### 🔁 Recurring Expenses (`/api/recurring`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/recurring` | Get all recurring subscriptions | Yes |
| `POST` | `/api/recurring` | Schedule new recurring expense | Yes |
| `PUT` | `/api/recurring/:id` | Edit subscription | Yes |
| `DELETE` | `/api/recurring/:id` | Delete subscription | Yes |

### 📈 Analytics (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics/summary` | Get balance, total income, total expense, savings, MoM change | Yes |
| `GET` | `/api/analytics/categories` | Get category spending distribution | Yes |
| `GET` | `/api/analytics/monthly` | Get monthly timeline data for trends | Yes |
| `GET` | `/api/analytics/weekly` | Get 7-day daily spend distribution | Yes |

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
|---|---|
| `Shift + A` | Open Quick Add Expense Modal |
| `Shift + T` | Jump to Transactions Ledger |
| `Shift + D` | Jump to Financial Dashboard |
| `Shift + B` | Jump to Budget Limits |
| `Shift + G` | Jump to Savings Goals |
| `Shift + S` | Jump to Settings & Profile |
| `?` | Open Keyboard Shortcuts Cheat Sheet |
| `Esc` | Dismiss any active modal |

---

## 🛡️ Security & Privacy

- All sensitive passwords hashed with **bcryptjs** (salt rounds: 10).
- Stateless **JWT** authentication with bearer authorization header verification.
- User data strict isolation: Every database query filters by `userId: req.user._id`.
- Protected from basic web vulnerabilities using **Helmet** security headers.
- Input validation and sanitization using **express-validator**.
