const { db } = require('./firebase/firebaseConfigBackend');

const getWeeklySteps = async (userId) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps');
  try {
    const stepsSnapshot = await stepsRef.orderBy('date', 'desc').limit(7).get();
    const stepsData = [];
    stepsSnapshot.forEach(doc => {
      stepsData.push({ id: doc.id, date: doc.data().date, steps: doc.data().steps, caloriesBurned: doc.data().caloriesBurned });
    });
    return stepsData;
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
  // Simplified formula to calculate calories burned
  const MET = 0.035; // Metabolic Equivalent of Task for walking
  const caloriesPerStep = (MET * weight * 3.5) / 200;
  return steps * caloriesPerStep;
};

module.exports = {
  getWeeklySteps,
  updateSteps,
};