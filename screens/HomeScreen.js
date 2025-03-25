import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Easing, Image, Linking, Modal, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../backend/firebase/firebaseConfig';
import bluetoothIcon from './images/Bluetooth.png'; // Add the Bluetooth icon
import settingsIcon from './images/Gear.png';
import heartIcon from './images/Heart.png';
import styles from './styles/styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [heartAnimation] = useState(new Animated.Value(1)); // Initial scale of heart
  const [name, setname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [emergencyName, setEmergencyName] = useState('');

  useEffect(() => {
    fetchLastMeasurement();
    fetchUserData();
    fetchEmergencyNumber();
  }, []);

  const fetchLastMeasurement = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const response = await fetch(`https://d51e-81-181-70-235.ngrok-free.app/api/measurements/last?userId=${userId}`);
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

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setname(userData.name || 'User');
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };
  

  const fetchEmergencyNumber = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const emergencyDocRef = doc(db, 'users', userId, 'emergency', 'emergencyNumber');
        const emergencyDoc = await getDoc(emergencyDocRef);
        if (emergencyDoc.exists()) {
          const data = emergencyDoc.data();
          setEmergencyName(data?.name || '');
          setEmergencyNumber(data?.number || '');
        }
      } catch (error) {
        console.error('Error fetching emergency number:', error);
        Alert.alert('Error', 'Failed to fetch emergency number');
      }
    }
  };

  const handleMeasure = async () => {
    setIsMeasuring(true);
    animateHeart(true); // Start heart animation

    // Simulate taking 5 measurements
    let totalHeartRate = 0;
    let totalSpO2 = 0;
    let totalTemperature = 0;
    for (let i = 0; i < 5; i++) {
      const mockHeartRate = Math.random() * 10 + 70; // Replace with real sensor data
      const mockSpO2 = Math.random() * 5 + 95; // Replace with real sensor data
      const mockTemperature = Math.random() * 2 + 36; // Replace with real sensor data
      totalHeartRate += mockHeartRate;
      totalSpO2 += mockSpO2;
      totalTemperature += mockTemperature;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    }
    const averageHeartRate = totalHeartRate / 5;
    const averageSpO2 = totalSpO2 / 5;
    const averageTemperature = totalTemperature / 5;

    // Check if any of the measurements are abnormal
    if (averageHeartRate < 50 || averageHeartRate > 150 || averageSpO2 < 100 || averageTemperature < 35 || averageTemperature >= 37.5) {
      setModalVisible(true);
      setTimeout(() => {
        if (modalVisible) {
          redirectToPhoneApp();
        }
      }, 60000); // 60 seconds timer
    }

    // Send averaged measurement to the backend
    try {
      const response = await fetch(`https://d51e-81-181-70-235.ngrok-free.app/api/measurements?userId=${auth.currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heartRate: averageHeartRate, spO2: averageSpO2, temperature: averageTemperature }),
      });

      if (response.ok) {
        console.log('Measurement saved successfully');
        fetchLastMeasurement(); // Refresh the last measurement
      } else {
        console.error('Failed to save measurement');
      }
    } catch (error) {
      console.error('Error during measurement:', error);
    } finally {
      setIsMeasuring(false);
      animateHeart(false); // Stop heart animation
    }
  };

  const redirectToPhoneApp = () => {
    const phoneNumber = `tel:${emergencyNumber}`;
    Linking.openURL(phoneNumber).catch((err) => console.error('Error opening phone app:', err));
  };

  const animateHeart = (shouldAnimate) => {
    if (shouldAnimate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnimation, {
            toValue: 1.5,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnimation, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      heartAnimation.stopAnimation();
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('successfully logged out.');
      navigation.replace('SignInScreen');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Settings Button */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <Image source={settingsIcon} style={styles.settingsIcon} />
      </TouchableOpacity>

      {/* Username Display */}
      <View style={styles.appNameContainer}>
        <Text style={styles.appName}>Hi, {name} 👋</Text>
      </View>

      {/* Last Measurement Display */}
      {lastMeasurement && (
        <View style={styles.lastMeasurement}>
          <View style={styles.lastMeasurementHeader}>
            <Text style={styles.header}>Last Measurement:</Text>
            <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('Stats')}>
              <Text style={styles.historyButtonText}>History</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.measurementText}>
            Heart Rate: {lastMeasurement.heartRate ? lastMeasurement.heartRate.toFixed(1) : 'N/A'} bpm
          </Text>
          <Text style={styles.measurementText}>
            SpO2: {lastMeasurement.spO2 ? lastMeasurement.spO2.toFixed(1) : 'N/A'} %
          </Text>
          <Text style={styles.measurementText}>
            Temperature: {lastMeasurement.temperature ? lastMeasurement.temperature.toFixed(1) : 'N/A'} °C
          </Text>
        </View>
      )}

      {/* Heart Icon */}
      <View style={styles.heartContainer}>
        <Animated.View
          style={{ transform: [{ scale: heartAnimation }] }}
        >
          <Image source={heartIcon} style={styles.heartIcon} />
        </Animated.View>
      </View>

      {/* Measure and Bluetooth Buttons */}
      <View style={styles.measureButtonContainer}>
        <TouchableOpacity
          style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]}
          onPress={handleMeasure}
          disabled={isMeasuring}
        >
          <Text style={styles.measureButtonText}>
            {isMeasuring ? 'Measuring...' : 'Measure'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bluetoothButton}
          onPress={() => console.log('Bluetooth button pressed')}
        >
          <Image source={bluetoothIcon} style={styles.bluetoothIcon} />
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Calories')}>
          <Text style={styles.navButtonText}>Calories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('StepCounter')}>
          <Text style={styles.navButtonText}>Steps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Maps')}>
          <Text style={styles.navButtonText}>Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Are you feeling well?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={redirectToPhoneApp}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;