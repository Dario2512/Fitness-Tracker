const { firestore } = require('firebase-admin');
const admin = require('firebase-admin');

// Initialize Firebase Admin with the Firebase service account JSON file path
const serviceAccount = require('./firebase-adminsdk.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

// Function to handle measurements (POST)
exports.handleMeasurement = async (req, res) => {
  try {
    const { userId } = req.query;

    let heartRateTotal = 0, spO2Total = 0, temperatureTotal = 0, stepsTotal = 0;

    // Generate random measurements and calculate averages
    for (let i = 0; i < 10; i++) {
      heartRateTotal += Math.floor(Math.random() * (120 - 60 + 1) + 60);
      spO2Total += Math.floor(Math.random() * (100 - 90 + 1) + 90);
      temperatureTotal += (Math.random() * (38 - 36) + 36);
      stepsTotal += Math.floor(Math.random() * 10000);
    }

    const heartRateAvg = heartRateTotal / 10;
    const spO2Avg = spO2Total / 10;
    const temperatureAvg = temperatureTotal / 10;
    const stepsAvg = stepsTotal / 10;

    // Save data to Firestore
    await db.collection('users').doc(userId).collection('measurements').add({
      heartRate: heartRateAvg,
      spO2: spO2Avg,
      temperature: temperatureAvg,
      steps: stepsAvg,
      timestamp: new Date(),
    });

    res.status(200).json({ message: 'Measurement data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save measurement data' });
  }
};

// Function to fetch the last measurement (GET)
exports.getLastMeasurement = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch the last measurement for the given user
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('measurements')
      .orderBy('timestamp', 'desc')  // Order by timestamp descending (most recent first)
      .limit(1)  // Only get the most recent measurement
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No measurements found for the given user' });
    }

    const lastMeasurement = snapshot.docs[0].data();  // Get the first document (most recent)
    res.status(200).json(lastMeasurement);  // Return the last measurement data
  } catch (error) {
    console.error('Error fetching last measurement:', error);
    res.status(500).json({ error: 'Failed to fetch last measurement data' });
  }
};
