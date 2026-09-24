const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get summary analytics
// @route   GET /api/analytics/summary
exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Current month totals
    const [currentIncome, currentExpense, prevIncome, prevExpense, totalIncome, totalExpense] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, type: 'income', date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'income', date: { $gte: prevMonthStart, $lte: prevMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: prevMonthStart, $lte: prevMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const curInc = currentIncome[0]?.total || 0;
    const curExp = currentExpense[0]?.total || 0;
    const prvInc = prevIncome[0]?.total || 0;
    const prvExp = prevExpense[0]?.total || 0;
    const totInc = totalIncome[0]?.total || 0;
    const totExp = totalExpense[0]?.total || 0;

    const incomeChange = prvInc > 0 ? ((curInc - prvInc) / prvInc * 100).toFixed(1) : 0;
    const expenseChange = prvExp > 0 ? ((curExp - prvExp) / prvExp * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalBalance: totInc - totExp,
        totalIncome: totInc,
        totalExpense: totExp,
        savings: totInc - totExp,
        currentMonthIncome: curInc,
        currentMonthExpense: curExp,
        previousMonthIncome: prvInc,
        previousMonthExpense: prvExp,
        incomeChange: Number(incomeChange),
        expenseChange: Number(expenseChange),
        currentMonthSavings: curInc - curExp,
        previousMonthSavings: prvInc - prvExp
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category breakdown
// @route   GET /api/analytics/categories
exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case '7d':
        dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '3m':
        dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth() - 3, 1) };
        break;
      case '6m':
        dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1) };
        break;
      case '1y':
        dateFilter = { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) };
        break;
      default:
        dateFilter = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
    }

    const categories = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalSpent = categories.reduce((sum, cat) => sum + cat.total, 0);

    const data = categories.map(cat => ({
      category: cat._id,
      amount: cat.total,
      count: cat.count,
      percentage: totalSpent > 0 ? Number(((cat.total / totalSpent) * 100).toFixed(1)) : 0
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly trends
// @route   GET /api/analytics/monthly
exports.getMonthly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { months } = req.query;
    const numMonths = parseInt(months) || 6;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - numMonths + 1, 1);

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Build month-by-month data
    const result = [];
    for (let i = 0; i < numMonths; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - numMonths + 1 + i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthName = d.toLocaleString('default', { month: 'short' });

      const income = monthlyData.find(m => m._id.year === year && m._id.month === month && m._id.type === 'income');
      const expense = monthlyData.find(m => m._id.year === year && m._id.month === month && m._id.type === 'expense');

      result.push({
        month: `${monthName} ${year}`,
        monthShort: monthName,
        income: income?.total || 0,
        expense: expense?.total || 0,
        savings: (income?.total || 0) - (expense?.total || 0)
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly spending
// @route   GET /api/analytics/weekly
exports.getWeekly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeklyData = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const result = shortDays.map((shortDay, index) => {
      // MongoDB $dayOfWeek: 1 = Sunday, 2 = Monday, ..., 7 = Saturday
      const dayData = weeklyData.find(d => d._id === index + 1);
      return {
        day: shortDay,
        fullDay: fullDays[index],
        amount: dayData ? Math.round(dayData.total) : 0
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get spending insights
// @route   GET /api/analytics/insights
exports.getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Get category comparison between months
    const [currentCategories, prevCategories] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: prevMonthStart, $lte: prevMonthEnd } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
      ])
    ]);

    const insights = [];

    // Highest spending category
    if (currentCategories.length > 0) {
      insights.push({
        type: 'info',
        icon: 'TrendingUp',
        message: `Your highest spending category is ${currentCategories[0]._id} at ₹${currentCategories[0].total.toLocaleString()}.`
      });
    }

    // Compare each category with previous month
    currentCategories.forEach(curr => {
      const prev = prevCategories.find(p => p._id === curr._id);
      if (prev) {
        const change = ((curr.total - prev.total) / prev.total * 100).toFixed(0);
        if (change > 10) {
          insights.push({
            type: 'warning',
            icon: 'ArrowUp',
            message: `You spent ${change}% more on ${curr._id} this month compared to last month.`
          });
        } else if (change < -10) {
          insights.push({
            type: 'success',
            icon: 'ArrowDown',
            message: `Your ${curr._id} spending decreased by ${Math.abs(change)}% this month. Great job!`
          });
        }
      }
    });

    // Daily average
    const daysInMonth = now.getDate();
    const totalCurrentExpense = currentCategories.reduce((sum, c) => sum + c.total, 0);
    if (totalCurrentExpense > 0) {
      const dailyAvg = (totalCurrentExpense / daysInMonth).toFixed(0);
      insights.push({
        type: 'info',
        icon: 'Calendar',
        message: `Your average daily spending this month is ₹${Number(dailyAvg).toLocaleString()}.`
      });
    }

    // Transaction frequency
    const totalTransactions = currentCategories.reduce((sum, c) => sum + c.count, 0);
    if (totalTransactions > 0) {
      insights.push({
        type: 'info',
        icon: 'Activity',
        message: `You've made ${totalTransactions} expense transactions this month across ${currentCategories.length} categories.`
      });
    }

    // If no data
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        icon: 'Info',
        message: 'Start adding expenses to see personalized spending insights here.'
      });
    }

    res.json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
};
