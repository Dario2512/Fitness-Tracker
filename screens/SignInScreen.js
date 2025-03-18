import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../backend/firebase/firebaseConfig';
import stylesSign from './styles/stylesSign'; // Import the styles

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.name && userData.surname && userData.age && userData.height && userData.weight) {
          await AsyncStorage.setItem('lastActive', Date.now().toString());
          navigation.navigate('Home', { name: userData.name });
          console.log('Successful sign in.');
        } else {
          navigation.navigate('User');
        }
      } else {
        navigation.navigate('User');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      setError(error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={stylesSign.container}>
      <Text style={stylesSign.header}>Sign In</Text>
      <TextInput
        style={stylesSign.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      {error ? <Text style={stylesSign.errorText}>{error}</Text> : null}
      <TouchableOpacity style={stylesSign.button} onPress={handleSignIn}>
        <Text style={stylesSign.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={stylesSign.button} onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={stylesSign.buttonText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;