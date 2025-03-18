const { db } = require('./firebase/firebaseConfigBackend');

const getWeeklySteps = async (userId) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps');
  try {
    const stepsSnapshot = await stepsRef.orderBy('date', 'desc').limit(7).get();
    const stepsData = [];
    stepsSnapshot.forEach(doc => {
      stepsData.push({ id: doc.id, date: doc.data().date, steps: doc.data().steps });
    });
    return stepsData;
  } catch (error) {
    console.error(`Error getting weekly steps for userId: ${userId}`, error);
    throw error;
  }
};

const updateSteps = async (userId, steps, date) => {
  const stepsRef = db.collection('users').doc(userId).collection('steps');
  try {
    const docId = `${userId}_${date}`; // Use a combination of userId and date as the document ID
    await stepsRef.doc(docId).set({ date, steps }, { merge: true });
    console.log(`Updated steps for userId: ${userId}, steps: ${steps}, date: ${date}`);
  } catch (error) {
    console.error(`Error updating steps for userId: ${userId}`, error);
    throw error;
  }
};

module.exports = {
  getWeeklySteps,
  updateSteps,
};