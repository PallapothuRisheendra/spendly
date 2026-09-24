const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Food', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Health', 'Education', 'Travel', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: [1, 'Budget amount must be at least 1']
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  month: {
    type: String,
    required: [true, 'Please provide a month'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  }
}, {
  timestamps: true
});

// Compound index for user + month queries
budgetSchema.index({ userId: 1, month: 1 });
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
