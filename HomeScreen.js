
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { auth } from './firebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { email } = route.params; 

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
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('SignInScreen'); 
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Set the logout button in the header
  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button title="Logout" onPress={handleLogout} />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Fitness Tracker</Text>
        <Text style={styles.userEmail}>Logged in as: {email}</Text> 
        
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

      <View style={styles.buttonContainer}>
        <Button title="Stats" onPress={() => navigation.navigate('Stats')} />
        <Button title="User" onPress={() => navigation.navigate('User')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 25,
    paddingTop: 10,
    backgroundColor: '#ddd',
    borderTopWidth: 1,
    borderTopColor: '#acacac',
  },
});

export default HomeScreen;
