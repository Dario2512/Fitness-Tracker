import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, TouchableOpacity, View, Text, Button } from 'react-native';
import { auth } from '../backend/firebase/firebaseConfig';
import styles from './styles/styles';
import { Image } from 'react-native';
import heartIcon from './images/Heart.png';
import settingsIcon from './images/Gear.png';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [heartAnimation] = useState(new Animated.Value(1)); // Initial scale of heart

  useEffect(() => {
    fetchLastMeasurement();
  }, []);

  const fetchLastMeasurement = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const response = await fetch(`https://d68a-178-220-185-170.ngrok-free.app/api/measurements/last?userId=${userId}`);
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
    animateHeart(true); // Start heart animation

    // Simulate taking 5 measurements
    let total = 0;
    for (let i = 0; i < 5; i++) {
      const mockMeasurement = Math.random() * 10 + 70; // Replace with real sensor data
      total += mockMeasurement;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    }
    const average = total / 5;

    // Send averaged measurement to the backend
    try {
      const response = await fetch(`https://d68a-178-220-185-170.ngrok-free.app/api/measurements?userId=${auth.currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heartRate: average }),
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

      {/* App Name */}
      <View style={styles.appNameContainer}>
        <Text style={styles.appName}>Life Tracker</Text>
      </View>

      {/* Last Measurement Display */}
      {lastMeasurement && (
        <View style={styles.lastMeasurement}>
          <Text style={styles.header}>Last Measurement:</Text>
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

      {/* Measure Button */}
      <View style={styles.measureButtonContainer}>
        <Animated.View
          style={[styles.heartContainer, { transform: [{ scale: heartAnimation }] }]}
        >
          <Image source={heartIcon} style={styles.heartIcon} />
        </Animated.View>

        <TouchableOpacity
          style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]}
          onPress={handleMeasure}
          disabled={isMeasuring}
        >
          <Text style={styles.measureButtonText}>
            {isMeasuring ? 'Measuring...' : 'Measure'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Calories')}>
          <Text style={styles.navButtonText}>Calories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Stats')}>
          <Text style={styles.navButtonText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Maps')}>
          <Text style={styles.navButtonText}>Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
