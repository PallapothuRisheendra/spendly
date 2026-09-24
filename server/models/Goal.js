const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a goal name'],
    trim: true,
    maxlength: [100, 'Goal name cannot exceed 100 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: [1, 'Target amount must be at least 1']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  color: {
    type: String,
    default: '#8B5CF6'
  },
  icon: {
    type: String,
    default: 'Target'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
