const express = require('express');
const caloriesController = require('./caloriesController');
const router = express.Router();

// GET today's calories
router.get('/todaysCalories', caloriesController.getTodaysCalories);

// POST: Increment food calories
router.post('/incrementFoodCalories', caloriesController.incrementFoodCalories);

// GET: Get calories burned in the last 7 days
router.get('/weeklyCalories', caloriesController.getWeeklyCalories);

module.exports = router;