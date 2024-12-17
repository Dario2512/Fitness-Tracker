const express = require('express');
const caloriesController = require('./caloriesController');
const router = express.Router();

// GET today's calories
router.get('/today', caloriesController.getTodaysCalories);

// POST: Increment calories based on user activity
router.post('/increment', caloriesController.incrementCalories);

// GET: Get calories burned in the last 7 days
router.get('/week', caloriesController.getWeeklyCalories);

module.exports = router;
