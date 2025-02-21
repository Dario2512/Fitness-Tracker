import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../backend/firebase/firebaseConfig.js';
import generatePDF from '../backend/pdfGenerator'; 
import styles from './styles/stylesStats.js';

const StatsScreen = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = () => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('User is not logged in');
        return;
      }

      // Query the user's measurements, ordered by timestamp in descending order
      const measurementsRef = collection(db, `users/${userId}/measurements`);
      const q = query(measurementsRef, orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMeasurements(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching measurements:', error);
        }
      );

      return unsubscribe; // Cleanup on unmount
    };

    const unsubscribe = fetchMeasurements();
    return unsubscribe;
  }, []);

  const handleGeneratePDF = async (measurement) => {
    try {
      await generatePDF(measurement);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading measurements...</Text>
      </View>
    );
  }

  const renderMeasurement = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Heart Rate: {item.heartRate} bpm</Text>
      <Text style={styles.cardText}>SpO2: {item.spO2} %</Text>
      <Text style={styles.cardText}>Temperature: {item.temperature.toFixed(1)} °C</Text>
      <Text style={styles.cardText}>
        Time: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => handleGeneratePDF(item)}>
        <Text style={styles.buttonText}>Create Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Statistics</Text>
      <FlatList
        data={measurements}
        keyExtractor={(item) => item.id}
        renderItem={renderMeasurement}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default StatsScreen;