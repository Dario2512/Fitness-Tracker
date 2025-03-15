const express = require('express');
const router = express.Router();
const { getWeeklySteps, updateSteps } = require('./stepsService');

router.get('/weekly', async (req, res) => {
  const { userId } = req.query;
  console.log(`Received request to get weekly steps for userId: ${userId}`);
  try {
    const steps = await getWeeklySteps(userId);
    res.status(200).json(steps);
  } catch (error) {
    console.error('Error fetching weekly steps:', error);
    res.status(500).send('Failed to fetch weekly steps');
  }
});

router.post('/update', async (req, res) => {
  const { userId, steps } = req.body;
  console.log(`Received request to update steps for userId: ${userId}, steps: ${steps}`);
  try {
    await updateSteps(userId, steps);
    res.status(200).send('Steps updated successfully');
  } catch (error) {
    console.error('Error updating steps:', error);
    res.status(500).send('Failed to update steps');
  }
});

module.exports = router;