import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';
import styles from './styles'; // Import styles.js

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
        const response = await fetch(`http://192.168.0.103:3000/api/measurements/last?userId=${userId}`);
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
      const response = await fetch(`http://192.168.0.103:3000/api/measurements?userId=${auth.currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Measurement result:', result);
        fetchLastMeasurement();
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

      {lastMeasurement ? (
        <View style={styles.lastMeasurement}>
          <Text style={styles.cardTitle}>Last Measurement:</Text>
          <Text style={styles.measurementText}>Heart Rate: <Text style={styles.greenText}>{lastMeasurement.heartRate} bpm</Text></Text>
          <Text style={styles.measurementText}>SpO2: <Text style={styles.greenText}>{lastMeasurement.spO2}%</Text></Text>
          <Text style={styles.measurementText}>Temperature: <Text style={styles.greenText}>{lastMeasurement.temperature}°C</Text></Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>No measurement data available</Text>
      )}

      <TouchableOpacity
        style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]}
        onPress={handleMeasure}
        disabled={isMeasuring}
      >
        <Text style={styles.measureButtonText}>
          {isMeasuring ? 'Measuring...' : 'Measure'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Stats')}>
          <Text style={styles.navButtonText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('User')}>
          <Text style={styles.navButtonText}>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
