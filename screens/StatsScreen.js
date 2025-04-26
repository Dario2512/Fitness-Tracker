import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
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

  const getLast7DaysData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }).reverse();
  
    const filteredDays = [];
    const heartRateData = [];
    const spO2Data = [];
    const temperatureData = [];
  
    last7Days.forEach((day) => {
      // Get all measurements for the current day
      const dailyMeasurements = measurements.filter((m) => {
        const measurementDate = new Date(m.timestamp.seconds * 1000);
        const formattedDate = `${measurementDate.getDate().toString().padStart(2, '0')}-${(measurementDate.getMonth() + 1).toString().padStart(2, '0')}`;
        return formattedDate === day;
      });
  
      if (dailyMeasurements.length > 0) {
        // Calculate averages for the day
        const avgHeartRate =
          dailyMeasurements.reduce((sum, m) => sum + m.heartRate, 0) / dailyMeasurements.length;
        const avgSpO2 =
          dailyMeasurements.reduce((sum, m) => sum + m.spO2, 0) / dailyMeasurements.length;
        const avgTemperature =
          dailyMeasurements.reduce((sum, m) => sum + m.temperature, 0) / dailyMeasurements.length;
  
        // Add the day and averages to the data arrays
        filteredDays.push(day);
        heartRateData.push(avgHeartRate);
        spO2Data.push(avgSpO2);
        temperatureData.push(avgTemperature);
      }
    });
  
    return { last7Days: filteredDays, heartRateData, spO2Data, temperatureData };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading measurements...</Text>
      </View>
    );
  }

  const { last7Days, heartRateData, spO2Data, temperatureData } = getLast7DaysData();

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
      {measurements.length > 0 ? (
        <>
          <LineChart
            data={{
              labels: last7Days,
              datasets: [
                {
                  data: heartRateData,
                  color: () => 'red', // Heart Rate in red
                  strokeWidth: 2,
                },
                {
                  data: spO2Data,
                  color: () => 'blue', // SpO2 in blue
                  strokeWidth: 2,
                },
                {
                  data: temperatureData,
                  color: () => 'green', // Temperature in green
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get('window').width} // Full width of the screen
            height={Dimensions.get('window').height / 4}
            chartConfig={{
              backgroundColor: '#1A1A1A',
              backgroundGradientFrom: '#1A1A1A',
              backgroundGradientTo: '#1A1A1A',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
              <Text style={styles.legendText}>Heart Rate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'blue' }]} />
              <Text style={styles.legendText}>SpO2</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
              <Text style={styles.legendText}>Temperature</Text>
            </View>
          </View>
          {/* Header for Measurements History */}
          <Text style={styles.historyHeader}>Measurements History:</Text>
        </>
      ) : (
        <Text style={styles.noDataText}>No data in the last 7 days</Text>
      )}
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