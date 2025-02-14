import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Modal } from 'react-native';
import { auth } from '../backend/firebase/firebaseConfig'; // Firebase auth
import styles from './styles/stylesCalories'; // Import modal styles

interface CalorieEntry {
  date: string; // Ensure this is a string like 'YYYY-MM-DD' from the backend
  calories: number;
}

const CaloriesScreen = () => {
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<CalorieEntry[]>([]);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWalkingModal, setShowWalkingModal] = useState(false);

  // Input states for food modal
  const [foodName, setFoodName] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  // Input state for walking modal
  const [walkingSteps, setWalkingSteps] = useState('');

  const userId = auth.currentUser?.uid;

  // Fetch today's calories
  const fetchTodaysCalories = async () => {
    try {
      const response = await fetch(`http://192.168.0.5:3000/todaysCalories?userId=${userId}`);
      const data = await response.json();
      setTodayCalories(data.calories || 0);
    } catch (error) {
      console.error('Error fetching today\'s calories:', error);
    }
  };

  // Fetch weekly calories
  const fetchWeeklyCalories = async () => {
    try {
      const response = await fetch(`http://192.168.0.5:3000/weeklyCalories?userId=${userId}`);
      const data = await response.json();
      setWeeklyCalories(data.weeklyCalories || []);
    } catch (error) {
      console.error('Error fetching weekly calories:', error);
    }
  };

  // Add food calories
  const addFoodCalories = async () => {
    if (!foodCalories) {
      console.log("No food calories provided");
      return;
    }
  
    if (!userId) {
      console.log("User is not authenticated");
      return;
    }
  
    try {
      const response = await fetch('http://192.168.0.5:3000/incrementFoodCalories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          additionalCalories: Number(foodCalories),
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Food calories added:', result);
        fetchTodaysCalories();
        setShowFoodModal(false);
        setFoodName('');
        setFoodWeight('');
        setFoodCalories('');
      } else {
        console.log('Failed to add food calories:', result);
      }
    } catch (error) {
      console.error('Error adding food calories:', error);
    }
  };

  // Add walking steps
  const addWalkingSteps = async () => {
    if (!walkingSteps || isNaN(Number(walkingSteps))) return;

    try {
      const response = await fetch('http://192.168.0.5:3000/incrementCalories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          steps: Number(walkingSteps),
        }),
      });
      const result = await response.json();

      if (response.ok) {
        console.log('Steps added:', result);
        fetchTodaysCalories();
        setShowWalkingModal(false);
        setWalkingSteps('');
      }
    } catch (error) {
      console.error('Error adding steps:', error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    if (userId) {
      fetchTodaysCalories();
      fetchWeeklyCalories();
    }
  }, [userId]);

  // Format date function
  const formatDate = (date: any) => {
    let dateObj: Date;
  
    if (typeof date === 'string') {
      // If it's an ISO string
      dateObj = new Date(date);
    } else if (date && date.seconds !== undefined && date.nanoseconds !== undefined) {
      // If it's a Firestore Timestamp
      dateObj = new Date(date.seconds * 1000); // Timestamp is in seconds
    } else {
      // If it's already a valid Date object
      dateObj = new Date(date);
    }
  
    return dateObj.toLocaleDateString(); // e.g., "12/17/2024"
  };

  // Render each day's calories
  const renderWeeklyCalories = ({ item }: { item: CalorieEntry }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        {formatDate(item.date)}: {item.calories} kcal
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Calories</Text>
      <Text style={styles.todayBox}>{todayCalories} kcal</Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="Add Food Calories"
          onPress={() => setShowFoodModal(true)}
          color="#FF6347" // Tomato red color for button
        />
        <Button
          title="Add Walking Steps"
          onPress={() => setShowWalkingModal(true)}
          color="#FF6347" // Tomato red color for button
        />
      </View>

      <Text style={styles.header}>Weekly Calories</Text>
      <FlatList
        data={weeklyCalories}
        renderItem={renderWeeklyCalories}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Food Modal */}
      <Modal visible={showFoodModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Food Calories</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Food Name"
              value={foodName}
              onChangeText={setFoodName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Weight (g)"
              keyboardType="numeric"
              value={foodWeight}
              onChangeText={setFoodWeight}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Calories"
              keyboardType="numeric"
              value={foodCalories}
              onChangeText={setFoodCalories}
            />
            <Button title="Save" onPress={addFoodCalories} color="tomato" />
            <Button title="Cancel" onPress={() => setShowFoodModal(false)} color="tomato" />
          </View>
        </View>
      </Modal>

      {/* Walking Steps Modal */}
      <Modal visible={showWalkingModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Walking Steps</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Number of Steps"
              keyboardType="numeric"
              value={walkingSteps}
              onChangeText={setWalkingSteps}
            />
            <Button title="Save" onPress={addWalkingSteps} color="tomato" />
            <Button title="Cancel" onPress={() => setShowWalkingModal(false)} color="tomato" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CaloriesScreen;
