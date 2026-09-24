const mongoose = require('mongoose');

const recurringExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Food', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Health', 'Education', 'Travel', 'Other']
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    required: [true, 'Please provide a frequency'],
    default: 'Monthly'
  },
  nextPaymentDate: {
    type: Date,
    required: [true, 'Please provide the next payment date']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

recurringExpenseSchema.index({ userId: 1, nextPaymentDate: 1 });

module.exports = mongoose.model('RecurringExpense', recurringExpenseSchema);
