import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  useEffect(() => {
    fetchLastMeasurement();
  }, []);

  const fetchLastMeasurement = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        // Fetch the last measurement from the Firestore or wherever last measurement data is stored.
        const response = await fetch(`http://192.168.56.1:3000/api/measurements/last?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setLastMeasurement(data);
        } else {
          console.error('Failed to fetch last measurement');
        }
      } catch (error) {
        console.error('Error fetching last measurement:', error);
      }
    }
  };

  const handleMeasure = async () => {
    setIsMeasuring(true);
    try {
      const response = await fetch(`http://192.168.56.1:3000/api/measurements?userId=${auth.currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Measurement result:', result);
        fetchLastMeasurement(); // Update the last measurement after saving
      } else {
        console.error('Failed to save measurement');
      }
    } catch (error) {
      console.error('Error during measurement:', error);
    } finally {
      setIsMeasuring(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('SignInScreen');
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

      <Button title={isMeasuring ? 'Measuring...' : 'Measure'} onPress={handleMeasure} disabled={isMeasuring} />

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
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  lastMeasurement: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default HomeScreen;
