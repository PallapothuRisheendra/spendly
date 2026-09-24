const express = require('express');
const router = express.Router();
const { getGoals, createGoal, updateGoal, addMoney, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.put('/:id/add-money', addMoney);

module.exports = router;
