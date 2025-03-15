const { db } = require('./firebase/firebaseConfigBackend');

const getWeeklySteps = async (userId) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps').doc('weeklySteps');
  try {
    const stepsDoc = await stepsRef.get();
    if (!stepsDoc.exists) {
      // Initialize the document if it doesn't exist
      console.log(`Initializing document for userId: ${userId}`);
      await stepsRef.set({ weeklySteps: Array(7).fill(0) });
      return Array(7).fill(0);
    }
    const stepsData = stepsDoc.data();
    return stepsData.weeklySteps || [];
  } catch (error) {
    console.error(`Error getting weekly steps for userId: ${userId}`, error);
    throw error;
  }
};

const updateSteps = async (userId, steps) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps').doc('weeklySteps');
  try {
    const stepsDoc = await stepsRef.get();
    if (!stepsDoc.exists) {
      // Initialize the document if it doesn't exist
      console.log(`Initializing document for userId: ${userId}`);
      await stepsRef.set({ weeklySteps: Array(7).fill(0) });
    }
    const stepsData = stepsDoc.data();
    const weeklySteps = stepsData.weeklySteps || Array(7).fill(0);

    // Update today's steps
    const today = new Date().getDay();
    weeklySteps[today] = steps;

    await stepsRef.update({ weeklySteps });
    console.log(`Updated steps for userId: ${userId}, steps: ${steps}`);
  } catch (error) {
    console.error(`Error updating steps for userId: ${userId}`, error);
    throw error;
  }
};

module.exports = {
  getWeeklySteps,
  updateSteps,
};