import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  const [heartRate, setHeartRate] = useState(0);
  const [spO2, setSpO2] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(Math.floor(Math.random() * (120 - 60 + 1) + 60)); 
      setSpO2(Math.floor(Math.random() * (100 - 90 + 1) + 90)); 
      setTemperature((Math.random() * (38 - 36) + 36).toFixed(1)); 
      setSteps(Math.floor(Math.random() * 10000)); 
    }, 3000); // refresh la 3 sec

    return () => clearInterval(interval); 
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Fitness Tracker</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Heart Rate:</Text>
        <Text style={styles.value}>{heartRate} bpm</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>SpO2:</Text>
        <Text style={styles.value}>{spO2}%</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>Temperature:</Text>
        <Text style={styles.value}>{temperature}°C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Steps:</Text>
        <Text style={styles.value}>{steps}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
});

export default HomeScreen;
