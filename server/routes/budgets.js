const express = require('express');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgets');

const router = express.Router();

router.route('/').get(getBudgets).post(createBudget);

router.route('/:id').get(getBudget).put(updateBudget).delete(deleteBudget);

module.exports = router;
