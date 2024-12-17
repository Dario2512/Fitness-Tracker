import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { auth } from '../backend/firebase/firebaseConfig';
import stylesSign from './styles/stylesSign'; // Import the styles

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const db = getFirestore();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userId = userCredential.user.uid;

        try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.username && userData.age && userData.height && userData.weight) {
              navigation.navigate('Home', { email: userCredential.user.email });
              console.log('successfull sign in.');
            } else {
              navigation.navigate('User');
            }
          } else {
            navigation.navigate('User');
          }
        } catch (error) {
          console.error('Error checking user data:', error);
          setError('Failed to check user profile. Please try again.');
        }
      })
      .catch((error) => {
        setError(error.message);
      });
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
