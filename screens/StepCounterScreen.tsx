import { Pedometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import { auth } from '../backend/firebase/firebaseConfig';

const StepCounterScreen: React.FC = () => {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState<{ date: string, steps: number }[]>([]);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          console.log('Requesting activity recognition permission...');
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
          console.log('Permission result:', granted);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Activity recognition permission granted');
            startPedometer();
          } else {
            console.log('Activity recognition permission denied');
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
  }, []);

  const startPedometer = async () => {
    console.log('Starting pedometer...');
    const isAvailable = await Pedometer.isAvailableAsync();
    console.log('Pedometer availability:', isAvailable);
    if (isAvailable) {
      console.log('Pedometer is available');
      Pedometer.watchStepCount(result => {
        console.log('Step count updated:', result.steps);
        setCurrentSteps(result.steps);
        updateSteps(result.steps);
      });

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const result = await Pedometer.getStepCountAsync(start, end);
      console.log('Initial step count:', result.steps);
      setCurrentSteps(result.steps);
      updateSteps(result.steps);
    } else {
      console.error('Pedometer is not available');
      Alert.alert('Error', 'Pedometer is not available');
    }
  };

  const fetchWeeklySteps = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        console.log('Fetching weekly steps for userId:', userId);
        const response = await fetch(`https://7b79-178-220-185-8.ngrok-free.app/api/steps/weekly?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          const sortedData = sortWeeklySteps(data);
          setWeeklySteps(sortedData);
        } else {
          console.error('Failed to fetch weekly steps');
          Alert.alert('Error', 'Failed to fetch weekly steps');
        }
      } catch (error) {
        console.error('Error fetching weekly steps:', error);
        Alert.alert('Error', 'Network request failed');
      }
    }
  };

  const sortWeeklySteps = (steps: number[]) => {
    const today = new Date();
    const sortedSteps = steps.map((step, index) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - index));
      return { date: date.toDateString(), steps: step };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedSteps;
  };

  const updateSteps = async (steps: number) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        console.log('Updating steps for userId:', userId, 'with steps:', steps);
        const response = await fetch(`https://7b79-178-220-185-8.ngrok-free.app/api/steps/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, steps }),
        });
        if (!response.ok) {
          console.error('Failed to update steps');
          Alert.alert('Error', 'Failed to update steps');
        } else {
          console.log('Steps updated successfully');
        }
      } catch (error) {
        console.error('Error updating steps:', error);
        Alert.alert('Error', 'Network request failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Steps: {currentSteps} 🏃</Text>
      <Text style={styles.subHeader}>Last 7 Days</Text>
      <FlatList
        data={weeklySteps}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.stepItem}>
            <Text style={styles.stepText}>{item.date}: {item.steps} steps</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  stepItem: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default StepCounterScreen;