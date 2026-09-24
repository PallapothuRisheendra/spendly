const express = require('express');
const router = express.Router();
const { getSummary, getCategories, getMonthly, getWeekly, getInsights } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSummary);
router.get('/categories', getCategories);
router.get('/monthly', getMonthly);
router.get('/weekly', getWeekly);
router.get('/insights', getInsights);

module.exports = router;
