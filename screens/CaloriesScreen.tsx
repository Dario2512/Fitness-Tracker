import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../backend/firebase/firebaseConfig'; 

// Define types for calorie data
type CalorieEntry = {
  id: string;
  calories: number;
  date: { seconds: number; nanoseconds: number }; // Firestore Timestamp
};

const CaloriesScreen = () => {
  const [todayCalories, setTodayCalories] = useState<number>(0);
  const [weeklyCalories, setWeeklyCalories] = useState<CalorieEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCalories = async () => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('User is not logged in');
        setLoading(false);
        return;
      }

      try {
        // Get today's calories
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayDocRef = doc(db, `calories/${userId}/dailyCalories`, startOfDay.toISOString()); // Correct path
        const todayDocSnap = await getDoc(todayDocRef);

        if (todayDocSnap.exists()) {
          setTodayCalories(todayDocSnap.data().calories || 0);
        } else {
          setTodayCalories(0); // No data for today
        }

        // Get last 7 days' calories
        const caloriesRef = collection(db, `calories/${userId}/dailyCalories`);
        const q = query(caloriesRef);

        onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as CalorieEntry[];

            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7); // Get the start of the week (7 days ago)

            const filteredData = data.filter((entry) => {
              const entryDate = new Date(entry.date.seconds * 1000);
              return entryDate >= weekStart;
            });

            setWeeklyCalories(filteredData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching weekly calories:', error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching calorie data:', error);
        setLoading(false);
      }
    };

    fetchCalories(); // Call the async function
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading calories data...</Text>
      </View>
    );
  }

  const renderWeeklyCalories = ({ item }: { item: CalorieEntry }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        {new Date(item.date.seconds * 1000).toLocaleDateString()}: {item.calories} kcal
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.todayBox}>
        <Text style={styles.header}>Today's Calories</Text>
        <Text style={styles.calories}>{todayCalories} kcal</Text>
      </View>
      <View style={styles.weekBox}>
        <Text style={styles.header}>Calories Burned This Week</Text>
        <FlatList
          data={weeklyCalories}
          keyExtractor={(item) => item.id}
          renderItem={renderWeeklyCalories}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  todayBox: { padding: 20, backgroundColor: '#cde', marginBottom: 20 },
  weekBox: { padding: 20, backgroundColor: '#eec' },
  header: { fontSize: 18, fontWeight: 'bold' },
  calories: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  card: { padding: 10, backgroundColor: '#fff', marginVertical: 5, borderRadius: 5 },
  cardText: { fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, marginTop: 10 },
  listContent: { paddingBottom: 20 },
});

export default CaloriesScreen;
