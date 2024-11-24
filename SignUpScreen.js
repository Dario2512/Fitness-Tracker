import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from './firebaseConfig';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');  // New state for re-enter password
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');  // To store password mismatch error

  const handleSignUp = async () => {
    if (password !== reenterPassword) {
      setPasswordError('Passwords do not match!');
      return; // Stop the sign-up process if passwords do not match
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Create user document in Firestore with default values
      await setDoc(doc(db, 'users', userId), {
        username: username,
        age: '',  // Default empty or null
        height: '',
        weight: '',
      });

      console.log('User signed up and document created!');
      navigation.navigate('SignInScreen'); // Navigate to Sign In after successful sign up
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        onChangeText={setReenterPassword}
        value={reenterPassword}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Already have an account? Sign In" onPress={() => navigation.navigate('SignInScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
});

export default SignUpScreen;
