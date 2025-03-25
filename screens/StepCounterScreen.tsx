import { Pedometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, PermissionsAndroid, Platform, Text, View } from 'react-native';
import { auth } from '../backend/firebase/firebaseConfig';
import { formatDate } from '../utils/formatDate';
import styles from './styles/stylesSteps';
import Constants from "expo-constants";

//const NGROK_URL = Constants.expoConfig?.extra?.NGROK_URL;

const StepCounterScreen: React.FC = () => {
  const [currentSteps, setCurrentSteps] = useState(0); // Steps counted in the current session
  const [historicalSteps, setHistoricalSteps] = useState(0); // Steps fetched from the backend or device
  const [weeklySteps, setWeeklySteps] = useState<{ id: string, date: string, steps: number, caloriesBurned?: number }[]>([]);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
            {
              title: 'Activity Recognition Permission',
              message: 'This app needs access to your activity to count steps.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            startPedometer();
          } else {
            Alert.alert('Permission Denied', 'Activity recognition permission is required to count steps.');
          }
        } catch (err) {
          console.warn('Error requesting permission:', err);
        }
      } else {
        startPedometer();
      }
    };

    requestPermissions();
    fetchWeeklySteps();
    fetchHistoricalSteps(); // Fetch historical steps from the backend or device
  }, []);

  const startPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable) {
      Pedometer.watchStepCount(result => {
        const newSteps = historicalSteps + result.steps; // Combine historical and real-time steps
        setCurrentSteps(result.steps);
        updateSteps(newSteps); // Update the backend with the total steps
      });

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const result = await Pedometer.getStepCountAsync(start, end);
      setCurrentSteps(result.steps);
      updateSteps(historicalSteps + result.steps); // Update the backend with the total steps
    } else {
      Alert.alert('Error', 'Pedometer is not available');
    }
  };

  const fetchWeeklySteps = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const response = await fetch(`https://6707-178-220-185-182.ngrok-free.app/api/steps/weekly?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setWeeklySteps(data);
        } else {
          Alert.alert('Error', 'Failed to fetch weekly steps');
        }
      } catch (error) {
        Alert.alert('Error', 'Network request failed');
      }
    }
  };

  const fetchHistoricalSteps = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const today = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch(`https://6707-178-220-185-182.ngrok-free.app/api/steps/weekly?userId=${userId}`);
        if (response.ok) {
          const data: { id: string; date: string; steps: number; caloriesBurned?: number }[] = await response.json(); // Explicitly type the data array
          const todaySteps = data.find((step) => step.date === today); // TypeScript now knows the type of 'step'
          setHistoricalSteps(todaySteps?.steps || 0); // Initialize historical steps
        } else {
          Alert.alert('Error', 'Failed to fetch historical steps');
        }
      } catch (error) {
        Alert.alert('Error', 'Network request failed');
      }
    }
  };

  const updateSteps = async (steps: number) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const date = new Date().toISOString().split('T')[0];
      try {
        const response = await fetch(`https://6707-178-220-185-182.ngrok-free.app/api/steps/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, steps, date }),
        });
        if (!response.ok) {
          Alert.alert('Error', 'Failed to update steps');
        }
      } catch (error) {
        Alert.alert('Error', 'Network request failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Steps: {historicalSteps + currentSteps} 🏃</Text>
      <Text style={styles.subHeader}>Last 7 Days</Text>
      <FlatList
        data={weeklySteps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.stepItem}>
            <Text style={styles.stepText}>
              {formatDate(item.date)}: {item.steps} steps,{"\n"} {item.caloriesBurned ? item.caloriesBurned.toFixed(0) : 'N/A'} calories burned
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default StepCounterScreen;