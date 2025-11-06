const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/v1/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  const budgets = await Budget.find();
  res.status(200).json({ success: true, count: budgets.length, data: budgets });
};

// @desc    Get single budget
// @route   GET /api/v1/budgets/:id
// @access  Private
exports.getBudget = async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);
  if (!budget) {
    return res.status(404).json({ success: false, msg: 'Budget not found' });
  }
  res.status(200).json({ success: true, data: budget });
};

// @desc    Create new budget
// @route   POST /api/v1/budgets
// @access  Private
exports.createBudget = async (req, res, next) => {
  const budget = await Budget.create(req.body);
  res.status(201).json({
    success: true,
    data: budget,
  });
};

// @desc    Update budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!budget) {
    return res.status(404).json({ success: false, msg: 'Budget not found' });
  }
  res.status(200).json({ success: true, data: budget });
};

// @desc    Delete budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);
  if (!budget) {
    return res.status(404).json({ success: false, msg: 'Budget not found' });
  }
  res.status(200).json({ success: true, data: {} });
};
