const RecurringExpense = require('../models/RecurringExpense');

// @desc    Get all recurring expenses
// @route   GET /api/recurring
exports.getRecurring = async (req, res, next) => {
  try {
    const recurring = await RecurringExpense.find({ userId: req.user._id }).sort({ nextPaymentDate: 1 });
    res.json({ success: true, data: recurring });
  } catch (error) {
    next(error);
  }
};

// @desc    Create recurring expense
// @route   POST /api/recurring
exports.createRecurring = async (req, res, next) => {
  try {
    const { name, amount, category, frequency, nextPaymentDate } = req.body;

    const recurring = await RecurringExpense.create({
      userId: req.user._id,
      name,
      amount,
      category,
      frequency,
      nextPaymentDate
    });

    res.status(201).json({ success: true, data: recurring });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recurring expense
// @route   PUT /api/recurring/:id
exports.updateRecurring = async (req, res, next) => {
  try {
    let recurring = await RecurringExpense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!recurring) {
      return res.status(404).json({ success: false, message: 'Recurring expense not found' });
    }

    recurring = await RecurringExpense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: recurring });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recurring expense
// @route   DELETE /api/recurring/:id
exports.deleteRecurring = async (req, res, next) => {
  try {
    const recurring = await RecurringExpense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!recurring) {
      return res.status(404).json({ success: false, message: 'Recurring expense not found' });
    }

    await RecurringExpense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Recurring expense deleted' });
  } catch (error) {
    next(error);
  }
};
