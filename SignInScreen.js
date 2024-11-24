import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from './firebaseConfig';

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
          // Check if the user has their profile parameters set
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.username && userData.age && userData.height && userData.weight) {
              // If all parameters are set, navigate to Home
              navigation.navigate('Home', { email: userCredential.user.email });
            } else {
              // If any parameter is missing, navigate to UserScreen for setup
              navigation.navigate('User');
            }
          } else {
            // If no data exists, navigate to UserScreen for setup
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
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('SignUpScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
});

export default SignInScreen;
