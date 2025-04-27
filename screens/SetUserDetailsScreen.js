import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../backend/firebase/firebaseConfig';
import stylesSign from './styles/stylesSign'; // Reuse styles from SignIn and SignUp screens

const SetUserDetailsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    age: '',
    height: '',
    weight: '',
  });

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser.uid;
      const db = getFirestore();

      const updatedData = {
        age: parseInt(userData.age, 10),
        height: parseInt(userData.height, 10),
        weight: parseInt(userData.weight, 10),
      };

      // Save user data to Firestore
      await setDoc(doc(db, 'users', userId), updatedData, { merge: true }); // Merge with existing data

      Alert.alert('Success', 'Your details have been saved.');
      navigation.navigate('Home'); // Redirect to Home Screen
    } catch (error) {
      console.error('Error saving user details:', error);
      Alert.alert('Error', 'Failed to save your details. Please try again.');
    }
  };

  return (
    <View style={stylesSign.container}>
     
      <Text style={stylesSign.header}>Set Your Details</Text>

      <TextInput
        style={stylesSign.input}
        placeholder="Age"
        placeholderTextColor="#fff"
        value={userData.age}
        onChangeText={(text) => handleInputChange('age', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Height (cm)"
        placeholderTextColor="#fff"
        value={userData.height}
        onChangeText={(text) => handleInputChange('height', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Weight (kg)"
        placeholderTextColor="#fff"
        value={userData.weight}
        onChangeText={(text) => handleInputChange('weight', text)}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={handleSave} style={stylesSign.button}>
        <Text style={stylesSign.buttonText}>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetUserDetailsScreen;