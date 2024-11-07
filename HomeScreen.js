import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from './firebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [heartRate, setHeartRate] = useState(0);
  const [spO2, setSpO2] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false); 
  const [lastMeasurement, setLastMeasurement] = useState(null); 

  useEffect(() => {
    fetchLastMeasurement();
  }, []);

  const fetchLastMeasurement = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const measurementRef = collection(db, 'users', userId, 'measurements');
      const measurementQuery = query(measurementRef, orderBy('timestamp', 'desc'), limit(1));
      const snapshot = await getDocs(measurementQuery);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data(); 
        setLastMeasurement(data); 
      }
    }
  };

  const handleMeasure = async () => {
    let heartRateTotal = 0, spO2Total = 0, temperatureTotal = 0, stepsTotal = 0;

    setIsMeasuring(true); 

    
    for (let i = 0; i < 10; i++) {
      const heartRateReading = Math.floor(Math.random() * (120 - 60 + 1) + 60); 
      const spO2Reading = Math.floor(Math.random() * (100 - 90 + 1) + 90); 
      const temperatureReading = (Math.random() * (38 - 36) + 36).toFixed(1); 
      const stepsReading = Math.floor(Math.random() * 10000);

     
      heartRateTotal += heartRateReading;
      spO2Total += spO2Reading;
      temperatureTotal += parseFloat(temperatureReading); 
      stepsTotal += stepsReading;

      console.log(`Reading #${i + 1}:`, { heartRateReading, spO2Reading, temperatureReading, stepsReading });

      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
    }

    // Calculate averages
    const heartRateAvg = heartRateTotal / 10;
    const spO2Avg = spO2Total / 10;
    const temperatureAvg = temperatureTotal / 10;
    const stepsAvg = stepsTotal / 10;

    // Log average values for debugging
    console.log('Averages:', { heartRateAvg, spO2Avg, temperatureAvg, stepsAvg });

    // Upload data to Firestore
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        await addDoc(collection(db, 'users', userId, 'measurements'), {
          heartRate: heartRateAvg,
          spO2: spO2Avg,
          temperature: temperatureAvg,
          steps: stepsAvg,
          timestamp: new Date(),
        });
        console.log('Data successfully uploaded to Firestore');

        // After uploading, fetch the last measurement again
        fetchLastMeasurement(); // Update the last measurement
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    }

    setIsMeasuring(false); // Stop measuring
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User signed out');
      navigation.replace('SignInScreen'); // Redirect to the Login screen after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Trackario</Text>


      
      {lastMeasurement && (
        <View style={styles.lastMeasurement}>
          <Text style={styles.header}>Last Measurement:</Text>
          <Text style={styles.label}>Heart Rate: {lastMeasurement.heartRate} bpm</Text>
          <Text style={styles.label}>SpO2: {lastMeasurement.spO2}%</Text>
          <Text style={styles.label}>Temperature: {lastMeasurement.temperature}°C</Text>
          <Text style={styles.label}>Steps: {lastMeasurement.steps}</Text>
        </View>
      )}

      <Button title={isMeasuring ? "Measuring..." : "Measure"} onPress={handleMeasure} disabled={isMeasuring} />

      
      <View style={styles.buttonContainer}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Stats" onPress={() => navigation.navigate('Stats')} />
        <Button title="User" onPress={() => navigation.navigate('User')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distribute space between content and buttons
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  lastMeasurement: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
