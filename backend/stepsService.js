const { db } = require('./firebase/firebaseConfigBackend');

const getWeeklySteps = async (userId) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps');
  try {
    // Get the last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      last7Days.push(formattedDate);
    }

    // Fetch all steps data for the last 7 days
    const stepsSnapshot = await stepsRef.where('date', 'in', last7Days).get();
    const stepsData = {};

    stepsSnapshot.forEach(doc => {
      const data = doc.data();
      stepsData[data.date] = { id: doc.id, date: data.date, steps: data.steps, caloriesBurned: data.caloriesBurned };
    });

    // Fill in missing days with 0 steps
    const weeklySteps = last7Days.map(date => {
      return stepsData[date] || { id: `${userId}_${date}`, date, steps: 0, caloriesBurned: 0 };
    });

    return weeklySteps;
  } catch (error) {
    console.error(`Error getting weekly steps for userId: ${userId}`, error);
    throw error;
  }
};

const updateSteps = async (userId, steps, date) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps');
  const userRef = db.collection('users').doc(userId);
  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const { age, height, weight } = userData;

    // Calculate calories burned
    const caloriesBurned = calculateCaloriesBurned(steps, weight, height, age);

    const docId = `${userId}_${date}`; // Use a combination of userId and date as the document ID
    await stepsRef.doc(docId).set({ date, steps, caloriesBurned }, { merge: true });
    console.log(`Updated steps for userId: ${userId}, steps: ${steps}, date: ${date}, caloriesBurned: ${caloriesBurned}`);
  } catch (error) {
    console.error(`Error updating steps for userId: ${userId}`, error);
    throw error;
  }
};

const calculateCaloriesBurned = (steps, weight, height, age) => {
  // formula to calculate calories burned
  const MET = 0.035; // Metabolic Equivalent of Task for walking
  const caloriesPerStep = (MET * weight * 3.5) / 200;
  return steps * caloriesPerStep;
};

module.exports = {
  getWeeklySteps,
  updateSteps,
};