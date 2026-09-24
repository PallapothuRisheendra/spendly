const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get all transactions for user
// @route   GET /api/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      type, category, paymentMethod,
      startDate, endDate,
      minAmount, maxAmount,
      search, sort, limit, page
    } = req.query;

    const query = { userId: req.user._id };

    // Filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Sorting
    let sortOption = { date: -1 }; // Default newest first
    if (sort === 'oldest') sortOption = { date: 1 };
    if (sort === 'highest') sortOption = { amount: -1 };
    if (sort === 'lowest') sortOption = { amount: 1 };

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Transaction.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const { type, amount, description, category, paymentMethod, date, notes } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      description,
      category,
      paymentMethod,
      date: date || new Date(),
      notes
    });

    // Update budget spent amount if expense
    if (type === 'expense') {
      const txDate = new Date(date || new Date());
      const month = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      await Budget.findOneAndUpdate(
        { userId: req.user._id, category, month },
        { $inc: { spent: amount } }
      );
    }

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const oldAmount = transaction.amount;
    const oldCategory = transaction.category;
    const oldType = transaction.type;
    const oldDate = transaction.date;

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update budget spent amounts
    if (oldType === 'expense') {
      const oldMonth = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, '0')}`;
      await Budget.findOneAndUpdate(
        { userId: req.user._id, category: oldCategory, month: oldMonth },
        { $inc: { spent: -oldAmount } }
      );
    }
    if (transaction.type === 'expense') {
      const newDate = new Date(transaction.date);
      const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
      await Budget.findOneAndUpdate(
        { userId: req.user._id, category: transaction.category, month: newMonth },
        { $inc: { spent: transaction.amount } }
      );
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update budget if expense
    if (transaction.type === 'expense') {
      const txDate = new Date(transaction.date);
      const month = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      await Budget.findOneAndUpdate(
        { userId: req.user._id, category: transaction.category, month: month },
        { $inc: { spent: -transaction.amount } }
      );
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};
