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
    const userRef = db.collection('users').doc(userId).collection('calories')
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

// Increment food calories
exports.incrementFoodCalories = async (req, res) => {
  const { userId, additionalCalories, foodName, foodWeight } = req.body;

  if (!userId || !additionalCalories) {
    return res.status(400).json({ error: 'User ID and additional calories are required' });
  }

  const startOfDay = getStartOfDayTimestamp();
  const userCalorieCollectionRef = db.collection('users').doc(userId).collection('calories');

  try {
    // Check if the user exists in the 'users' collection
    const user = await db.collection('users').doc(userId).get();
    if (!user.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new document with a unique ID (using the current timestamp)
    const newDocRef = userCalorieCollectionRef.doc();

    // Increment the calories for the day
    await newDocRef.set({
      calories: additionalCalories,
      date: Timestamp.fromDate(new Date()),
      foodName: foodName || null,
      foodWeight: foodWeight || null,
    });

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

    const userCalorieRef = db.collection('users').doc(userId).collection('calories');
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