const mongoose = require('mongoose');
const net = require('net');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const RecurringExpense = require('../models/RecurringExpense');

let localMongoProcess = null;

const isPortOpen = (port, host = '127.0.0.1', timeout = 1000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
};

const startLocalMongoServer = async (port = 27017) => {
  const dataDir = path.join(__dirname, '..', 'data', 'db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const { MongoBinary } = require('mongodb-memory-server');
  const mongodPath = await MongoBinary.getPath();

  console.log(`[Database] 📦 Starting local persistent MongoDB instance on port ${port}...`);
  localMongoProcess = spawn(mongodPath, ['--dbpath', dataDir, '--port', String(port), '--bind_ip', '127.0.0.1'], {
    stdio: 'ignore',
    detached: false
  });

  const cleanup = () => {
    if (localMongoProcess && !localMongoProcess.killed) {
      try {
        localMongoProcess.kill();
      } catch (_) {}
      localMongoProcess = null;
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 200));
    if (await isPortOpen(port)) {
      return true;
    }
  }
  throw new Error(`Timed out waiting for MongoDB to listen on port ${port}`);
};

const seedDemoDataIfEmpty = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding initial demo account (demo@spendly.io)...');
      const user = await User.create({
        name: 'Alex Morgan',
        email: 'demo@spendly.io',
        password: 'password123',
        currency: 'INR',
      });

      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Sample transactions spanning past 5 months and current month
      const sampleTransactions = [
        // Current Month
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

        // 1 Month Ago
        { userId: user._id, type: 'income', amount: 65000, description: 'Monthly Tech Salary', category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth() - 1, 1) },
        { userId: user._id, type: 'expense', amount: 4800, description: 'Organic Mart Groceries', category: 'Food', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 1, 4) },
        { userId: user._id, type: 'expense', amount: 3200, description: 'Uniqlo Casual Wear', category: 'Shopping', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 1, 9) },
        { userId: user._id, type: 'expense', amount: 1200, description: 'Fuel & Cab Rides', category: 'Transport', paymentMethod: 'Debit Card', date: new Date(now.getFullYear(), now.getMonth() - 1, 15) },
        { userId: user._id, type: 'expense', amount: 2200, description: 'Electricity & Utility Bill', category: 'Bills', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth() - 1, 20) },
        { userId: user._id, type: 'expense', amount: 1800, description: 'Cinema & Dinner Weekend', category: 'Entertainment', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 1, 25) },

        // 2 Months Ago
        { userId: user._id, type: 'income', amount: 65000, description: 'Monthly Tech Salary', category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth() - 2, 1) },
        { userId: user._id, type: 'income', amount: 8000, description: 'Consulting Honorarium', category: 'Freelance', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 2, 12) },
        { userId: user._id, type: 'expense', amount: 5100, description: 'Monthly Grocery Stockup', category: 'Food', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 2, 5) },
        { userId: user._id, type: 'expense', amount: 4500, description: 'IKEA Home Decor & Plants', category: 'Shopping', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 2, 14) },
        { userId: user._id, type: 'expense', amount: 950, description: 'Metro Smart Card Recharge', category: 'Transport', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 2, 18) },
        { userId: user._id, type: 'expense', amount: 1500, description: 'Gym Quarterly Installment', category: 'Health', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 2, 22) },

        // 3 Months Ago
        { userId: user._id, type: 'income', amount: 65000, description: 'Monthly Tech Salary', category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth() - 3, 1) },
        { userId: user._id, type: 'expense', amount: 3900, description: 'Fresh Market Groceries', category: 'Food', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 3, 6) },
        { userId: user._id, type: 'expense', amount: 2800, description: 'Nike Running Shoes', category: 'Shopping', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 3, 11) },
        { userId: user._id, type: 'expense', amount: 3500, description: 'Flight Ticket to Regional Conf', category: 'Travel', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 3, 19) },
        { userId: user._id, type: 'expense', amount: 1100, description: 'Water & Gas Utility', category: 'Bills', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 3, 27) },

        // 4 Months Ago
        { userId: user._id, type: 'income', amount: 65000, description: 'Monthly Tech Salary', category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth() - 4, 1) },
        { userId: user._id, type: 'expense', amount: 4600, description: 'Supermarket Provisions', category: 'Food', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 4, 4) },
        { userId: user._id, type: 'expense', amount: 1999, description: 'Noise Cancelling Headset', category: 'Shopping', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 4, 12) },
        { userId: user._id, type: 'expense', amount: 1400, description: 'City Transit & Rides', category: 'Transport', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 4, 18) },

        // 5 Months Ago
        { userId: user._id, type: 'income', amount: 65000, description: 'Monthly Tech Salary', category: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
        { userId: user._id, type: 'expense', amount: 4100, description: 'Household Provisions', category: 'Food', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 5, 5) },
        { userId: user._id, type: 'expense', amount: 2100, description: 'Streaming & Media Bills', category: 'Bills', paymentMethod: 'Credit Card', date: new Date(now.getFullYear(), now.getMonth() - 5, 15) },
        { userId: user._id, type: 'expense', amount: 800, description: 'Weekly Metro Commute', category: 'Transport', paymentMethod: 'UPI', date: new Date(now.getFullYear(), now.getMonth() - 5, 22) },
      ];

      await Transaction.insertMany(sampleTransactions);

      await Budget.insertMany([
        { userId: user._id, category: 'Food', amount: 10000, spent: 5650, month: currentMonthStr },
        { userId: user._id, category: 'Shopping', amount: 8000, spent: 5999, month: currentMonthStr },
        { userId: user._id, category: 'Transport', amount: 3000, spent: 850, month: currentMonthStr },
        { userId: user._id, category: 'Bills', amount: 5000, spent: 999, month: currentMonthStr },
        { userId: user._id, category: 'Entertainment', amount: 3000, spent: 649, month: currentMonthStr },
      ]);

      await Goal.insertMany([
        { userId: user._id, name: 'MacBook Pro M3 Max', targetAmount: 180000, currentAmount: 115000, deadline: new Date(now.getFullYear(), now.getMonth() + 3, 1) },
        { userId: user._id, name: 'Japan Cherry Blossom Trip', targetAmount: 250000, currentAmount: 90000, deadline: new Date(now.getFullYear(), now.getMonth() + 6, 15) },
        { userId: user._id, name: 'Emergency Liquid Fund', targetAmount: 100000, currentAmount: 85000, deadline: new Date(now.getFullYear(), now.getMonth() + 1, 30) },
      ]);

      await RecurringExpense.insertMany([
        { userId: user._id, name: 'Netflix Premium 4K', amount: 649, category: 'Entertainment', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 12) },
        { userId: user._id, name: 'Airtel Broadband Fiber', amount: 999, category: 'Bills', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 11) },
        { userId: user._id, name: 'Cult.Fit Gym Membership', amount: 1500, category: 'Health', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 5) },
        { userId: user._id, name: 'Spotify Duo', amount: 179, category: 'Entertainment', frequency: 'Monthly', nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 20) },
      ]);

      console.log('✨ Demo account ready! Email: demo@spendly.io | Password: password123');
    }
  } catch (seedErr) {
    console.warn('⚠️ Seeding check warning:', seedErr.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendly';
  const isLocalhost = uri.includes('localhost') || uri.includes('127.0.0.1');

  let targetPort = 27017;
  const portMatch = uri.match(/:(\d+)/);
  if (portMatch && portMatch[1]) {
    targetPort = parseInt(portMatch[1], 10);
  }

  // If pointing to localhost and port is not yet open, auto-start persistent local MongoDB daemon
  if (isLocalhost) {
    const portOpen = await isPortOpen(targetPort);
    if (!portOpen) {
      try {
        await startLocalMongoServer(targetPort);
      } catch (startErr) {
        console.warn(`[Database] ⚠️ Could not start local MongoDB daemon: ${startErr.message}`);
      }
    }
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[Database] 🚀 Connected to Real MongoDB: ${conn.connection.host}:${conn.connection.port || targetPort}/${conn.connection.name}`);
    await seedDemoDataIfEmpty();
    return conn;
  } catch (error) {
    console.log(`[Database] ⚠️ Real MongoDB connection failed (${error.message}). Falling back to MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] 💾 Using In-Memory MongoDB Fallback: ${memoryUri}`);
      await seedDemoDataIfEmpty();
      return conn;
    } catch (fallbackErr) {
      console.error(`[Database] ❌ Fatal MongoDB connection error: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

