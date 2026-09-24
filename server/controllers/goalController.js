const Goal = require('../models/Goal');

// @desc    Get all goals
// @route   GET /api/goals
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

// @desc    Create goal
// @route   POST /api/goals
exports.createGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, currentAmount, deadline, color, icon } = req.body;

    const goal = await Goal.create({
      userId: req.user._id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      color,
      icon
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
exports.updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Add money to goal
// @route   PUT /api/goals/:id/add-money
exports.addMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    await goal.save();

    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    next(error);
  }
};
