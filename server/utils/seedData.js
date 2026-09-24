const connectDB = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const RecurringExpense = require('../models/RecurringExpense');

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding...');

    // Clear existing demo user data if exists
    const demoEmail = 'demo@spendly.io';
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await Transaction.deleteMany({ userId: existingUser._id });
      await Budget.deleteMany({ userId: existingUser._id });
      await Goal.deleteMany({ userId: existingUser._id });
      await RecurringExpense.deleteMany({ userId: existingUser._id });
      await User.findByIdAndDelete(existingUser._id);
      console.log('Cleared existing demo data.');
    }

    // Create demo user
    const user = await User.create({
      name: 'Alex Morgan',
      email: demoEmail,
      password: 'password123',
      currency: 'INR',
    });

    console.log(`Created demo user: ${user.email} (Password: password123)`);

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Transactions
    const sampleTransactions = [
      { userId: user._id, type: 'income', amount: 65000, description: 'Monthly Tech Salary', category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth(), 1) },
      { userId: user._id, type: 'income', amount: 12000, description: 'UI/UX Freelance Design Project', category: 'Freelance', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth(), 8) },
      { userId: user._id, type: 'expense', amount: 4200, description: 'Supermarket Groceries & Essentials', category: 'Food', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth(), 3) },
      { userId: user._id, type: 'expense', amount: 1450, description: 'Weekend Cafe & Dining Out', category: 'Food', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth(), 5) },
      { userId: user._id, type: 'expense', amount: 5999, description: 'Zara Seasonal Clothing Haul', category: 'Shopping', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth(), 7) },
      { userId: user._id, type: 'expense', amount: 850, description: 'Uber Rides to Downtown', category: 'Transport', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth(), 10) },
      { userId: user._id, type: 'expense', amount: 999, description: 'High-speed Fiber Internet Bill', category: 'Bills', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth(), 11) },
      { userId: user._id, type: 'expense', amount: 649, description: 'Netflix 4K Premium Plan', category: 'Entertainment', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth(), 12) },
      { userId: user._id, type: 'expense', amount: 2500, description: 'Annual Health Checkup & Medicine', category: 'Health', paymentMethod: 'Debit Card', date: new Date(now.getFullYear(), now.getMonth(), 14) },
      { userId: user._id, type: 'expense', amount: 1500, description: 'Online Data Science Masterclass', category: 'Education', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth(), 16) },
    ];

    await Transaction.insertMany(sampleTransactions);
    console.log(`Inserted ${sampleTransactions.length} sample transactions.`);

    // Budgets
    const sampleBudgets = [
      { userId: user._id, category: 'Food', amount: 10000, spent: 5650, month: currentMonthStr },
      { userId: user._id, category: 'Shopping', amount: 8000, spent: 5999, month: currentMonthStr },
      { userId: user._id, category: 'Transport', amount: 3000, spent: 850, month: currentMonthStr },
      { userId: user._id, category: 'Bills', amount: 5000, spent: 999, month: currentMonthStr },
      { userId: user._id, category: 'Entertainment', amount: 3000, spent: 649, month: currentMonthStr },
    ];

    await Budget.insertMany(sampleBudgets);
    console.log(`Inserted ${sampleBudgets.length} budgets.`);

    // Goals
    const sampleGoals = [
      { userId: user._id, name: 'MacBook Pro M3 Max', targetAmount: 180000, currentAmount: 115000, deadline: new Date(now.getFullYear(), now.getMonth() + 3, 1) },
      { userId: user._id, name: 'Japan Cherry Blossom Trip', targetAmount: 250000, currentAmount: 90000, deadline: new Date(now.getFullYear(), now.getMonth() + 6, 15) },
      { userId: user._id, name: 'Emergency Liquid Fund', targetAmount: 100000, currentAmount: 85000, deadline: new Date(now.getFullYear(), now.getMonth() + 1, 30) },
    ];

    await Goal.insertMany(sampleGoals);
    console.log(`Inserted ${sampleGoals.length} goals.`);

    // Recurring
    const sampleRecurring = [
      { userId: user._id, name: 'Netflix Premium 4K', amount: 649, category: 'Entertainment', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 12) },
      { userId: user._id, name: 'Airtel Broadband Fiber', amount: 999, category: 'Bills', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 11) },
      { userId: user._id, name: 'Cult.Fit Gym Membership', amount: 1500, category: 'Health', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 5) },
      { userId: user._id, name: 'Spotify Duo', amount: 179, category: 'Entertainment', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 20) },
    ];

    await RecurringExpense.insertMany(sampleRecurring);
    console.log(`Inserted ${sampleRecurring.length} recurring expenses.`);

    console.log('Seeding completed successfully! 🚀');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
