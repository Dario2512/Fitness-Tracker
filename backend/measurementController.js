const { firestore } = require('firebase-admin');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase/firebase-adminsdk.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

exports.handleMeasurement = async (req, res) => {
  try {
    const { userId } = req.query;

    let heartRateTotal = 0, spO2Total = 0, temperatureTotal = 0;

    // Generate random measurements (without steps)
    for (let i = 0; i < 10; i++) {
      heartRateTotal += Math.floor(Math.random() * (120 - 60 + 1) + 60);
      spO2Total += Math.floor(Math.random() * (100 - 90 + 1) + 90);
      temperatureTotal += (Math.random() * (38 - 36) + 36);
    }

    const heartRateAvg = heartRateTotal / 10;
    const spO2Avg = spO2Total / 10;
    const temperatureAvg = temperatureTotal / 10;

    // Save data to Firestore
    await db.collection('users').doc(userId).collection('measurements').add({
      userId: userId,
      heartRate: heartRateAvg,
      spO2: spO2Avg,
      temperature: temperatureAvg,
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

    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    // Fetch the last measurement for the given user
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('measurements')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No measurements found for the given user' });
    }

    const lastMeasurement = snapshot.docs[0].data();
    res.status(200).json(lastMeasurement);
  } catch (error) {
    console.error('Error fetching last measurement:', error);
    res.status(500).json({ error: 'Failed to fetch last measurement data' });
  }
};

