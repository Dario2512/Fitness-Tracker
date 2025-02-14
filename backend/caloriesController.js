const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Import the service account credentials (make sure to point to the correct path)
const firebaseConfig = require('./firebase/firebase-adminsdk.json');


// Initialize the Firebase Admin SDK with service account credentials
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
} else {
  admin.app(); // Use the existing app if already initialized
}

const db = getFirestore();

// Utility function to get the start of the current day as a timestamp
const getStartOfDayTimestamp = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};


// Get today's calories for a user
exports.getTodaysCalories = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const startOfDay = getStartOfDayTimestamp();
    const userRef = db.collection('calories').doc(userId).collection('dailyCalories')
      .where('date', '>=', Timestamp.fromDate(startOfDay))
      .where('date', '<', Timestamp.fromDate(new Date(startOfDay.getTime() + 86400000))); // Add 1 day (24 hours)

    const querySnapshot = await userRef.get();

    if (querySnapshot.empty) {
      return res.status(200).json({ calories: 0 });
    }

    let totalCalories = 0;
    querySnapshot.forEach((doc) => {
      totalCalories += doc.data().calories;
    });

    res.status(200).json({ calories: totalCalories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch today\'s calories' });
  }
};


// Increment calories burned based on steps
exports.incrementCalories = async (req, res) => {
  const { userId, steps } = req.body;

  if (!userId || !steps) {
    return res.status(400).json({ error: 'User ID and steps are required' });
  }

  const startOfDay = getStartOfDayTimestamp();
  const userDocRef = db.collection('calories').doc(userId).collection('dailyCalories').doc(startOfDay.toISOString());

  try {
    // Check if the user exists in the 'users' collection
    const user = await db.collection('users').doc(userId).get();
    if (!user.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { age, height, weight } = user.data();
    const caloriesBurnedPerStep = 0.04; // Rough estimate for walking
    const caloriesBurned = steps * caloriesBurnedPerStep;

    // Update the daily calories for the user, creating the document if it doesn't exist
    await userDocRef.set(
      {
        calories: admin.firestore.FieldValue.increment(caloriesBurned),
        date: Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );
    res.status(200).json({ message: 'Calories updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to increment calories' });
  }
};


// Increment food calories
exports.incrementFoodCalories = async (req, res) => {
  const { userId, additionalCalories } = req.body;

  if (!userId || !additionalCalories) {
    return res.status(400).json({ error: 'User ID and additional calories are required' });
  }

  const startOfDay = getStartOfDayTimestamp();
  const userDocRef = db.collection('calories').doc(userId).collection('dailyCalories').doc(startOfDay.toISOString());

  try {
    // Check if the user exists in the 'users' collection
    const user = await db.collection('users').doc(userId).get();
    if (!user.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Increment the calories for the day
    await userDocRef.set(
      {
        calories: admin.firestore.FieldValue.increment(additionalCalories),
        date: Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );
    res.status(200).json({ message: 'Food calories updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to increment food calories' });
  }
};


// Get the last 7 days' calories burned
exports.getWeeklyCalories = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const userCalorieRef = db.collection('calories').doc(userId).collection('dailyCalories');
    const query = await userCalorieRef.where('date', '>=', Timestamp.fromDate(weekStart)).get();

    if (query.empty) {
      return res.status(200).json({ weeklyCalories: [] });
    }

    const weeklyCalories = [];
    query.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to JavaScript Date and format it to ISO string
      const formattedDate = data.date.toDate().toISOString(); // Convert to ISO string
      
      // Push the formatted date and other data
      weeklyCalories.push({ date: formattedDate, ...data });
    });

    res.status(200).json({ weeklyCalories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weekly calories' });
  }
};


