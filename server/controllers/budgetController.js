const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets for user
// @route   GET /api/budgets
exports.getBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;
    const query = { userId: req.user._id };
    if (month) query.month = month;

    const budgets = await Budget.find(query).sort({ createdAt: -1 });

    // Recalculate spent from actual transactions for accuracy
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const [year, mon] = budget.month.split('-');
        const startDate = new Date(year, parseInt(mon) - 1, 1);
        const endDate = new Date(year, parseInt(mon), 0, 23, 59, 59);

        const result = await Transaction.aggregate([
          {
            $match: {
              userId: req.user._id,
              type: 'expense',
              category: budget.category,
              date: { $gte: startDate, $lte: endDate }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const spent = result.length > 0 ? result[0].total : 0;
        
        // Update the stored spent value
        if (budget.spent !== spent) {
          await Budget.findByIdAndUpdate(budget._id, { spent });
        }

        return {
          ...budget.toObject(),
          spent
        };
      })
    );

    res.json({ success: true, data: budgetsWithSpent });
  } catch (error) {
    next(error);
  }
};

// @desc    Create budget
// @route   POST /api/budgets
exports.createBudget = async (req, res, next) => {
  try {
    const { category, amount, month } = req.body;

    // Check for existing budget
    const existing = await Budget.findOne({
      userId: req.user._id,
      category,
      month
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Budget for ${category} already exists for ${month}`
      });
    }

    // Calculate current spent
    const [year, mon] = month.split('-');
    const startDate = new Date(year, parseInt(mon) - 1, 1);
    const endDate = new Date(year, parseInt(mon), 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          category,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const spent = result.length > 0 ? result[0].total : 0;

    const budget = await Budget.create({
      userId: req.user._id,
      category,
      amount,
      spent,
      month
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};
