import React, { useEffect, useState } from 'react';
import { Button, FlatList, Modal, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { auth } from '../backend/firebase/firebaseConfig'; 
import styles from './styles/stylesCalories';
import Constants from "expo-constants";


interface CalorieEntry {
  date: any; // Can be a string or Firestore Timestamp
  calories: number;
  foodName?: string;
  foodWeight?: string;
}

interface GroupedCalorieEntry {
  date: string;
  totalCalories: number;
  foodEntries: CalorieEntry[];
}

const CaloriesScreen = () => {
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<GroupedCalorieEntry[]>([]);
  const [showFoodModal, setShowFoodModal] = useState(false);

  // Input states for food modal
  const [foodName, setFoodName] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  const userId = auth.currentUser?.uid;

  // Fetch today's calories
  const fetchTodaysCalories = async () => {
    try {
      const response = await fetch(`https://fce6-178-220-185-182.ngrok-free.app/todaysCalories?userId=${userId}`);
      const data = await response.json();
      setTodayCalories(data.calories || 0);
    } catch (error) {
      console.error('Error fetching today\'s calories:', error);
    }
  };

  // Fetch weekly calories
  const fetchWeeklyCalories = async () => {
    try {
      const response = await fetch(`https://fce6-178-220-185-182.ngrok-free.app/weeklyCalories?userId=${userId}`);
      const data = await response.json();
      const groupedData = groupCaloriesByDate(data.weeklyCalories || []);
      setWeeklyCalories(groupedData);
    } catch (error) {
      console.error('Error fetching weekly calories:', error);
    }
  };

  // Group calories by date and calculate total calories for each day
  const groupCaloriesByDate = (calories: CalorieEntry[]): GroupedCalorieEntry[] => {
    const grouped: { [key: string]: GroupedCalorieEntry } = {};

    calories.forEach((entry) => {
      if (!entry.date) {
        console.warn('Skipping entry with undefined date:', entry);
        return;
      }

      let dateStr: string;
      if (typeof entry.date === 'string') {
        dateStr = entry.date;
      } else if (entry.date._seconds !== undefined && entry.date._nanoseconds !== undefined) {
        // Convert Firestore Timestamp to ISO string
        dateStr = new Date(entry.date._seconds * 1000).toISOString();
      } else {
        console.warn('Skipping entry with invalid date format:', entry);
        return;
      }

      const date = dateStr.split('T')[0]; // Extract the date part (YYYY-MM-DD)
      if (!grouped[date]) {
        grouped[date] = { date, totalCalories: 0, foodEntries: [] };
      }
      grouped[date].totalCalories += entry.calories;
      grouped[date].foodEntries.push(entry);
    });

    return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
      const response = await fetch(`https://fce6-178-220-185-182.ngrok-free.app/incrementFoodCalories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          additionalCalories: Number(foodCalories),
          foodName: foodName,
          foodWeight: foodWeight,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Food calories added:', result);
        fetchTodaysCalories();
        fetchWeeklyCalories();
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
      dateObj = new Date(date);
    } else if (date && date._seconds !== undefined && date._nanoseconds !== undefined) {
      dateObj = new Date(date._seconds * 1000); 
    } else {
      dateObj = new Date(date);
    }
  
    return dateObj.toLocaleDateString();
  };

  // Render each day's calories
  const renderWeeklyCalories = ({ item }: { item: GroupedCalorieEntry }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        {formatDate(item.date)}: {item.totalCalories} kcal
      </Text>
      {item.foodEntries.map((foodEntry, index) => (
        <View key={index} style={styles.foodEntry}>
          <Text style={styles.cardText}>Food: {foodEntry.foodName}</Text>
          <Text style={styles.cardText}>Weight: {foodEntry.foodWeight} g</Text>
          <Text style={styles.cardText}>Calories: {foodEntry.calories} kcal</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Calories</Text>
      <Text style={styles.todayBox}>{todayCalories} kcal</Text>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={styles.modalButton} 
        onPress={() => setShowFoodModal(true)}
      >
        <Text style={styles.modalButtonText}>Add Food Calories</Text>
      </TouchableOpacity>
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
            <TouchableOpacity style={styles.modalButton} onPress={addFoodCalories}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowFoodModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CaloriesScreen;