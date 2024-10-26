// SignUpScreen.js

import { createUserWithEmailAndPassword } from 'firebase/auth'; // Adjust the import
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from './firebaseConfig'; // Adjust the path as necessary

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (password !== reEnterPassword) {
      setError("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('SignInScreen'); // Ensure it matches your Home screen name
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setError('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          setError('That email address is invalid!');
        } else {
          setError(error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
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
        onChangeText={setReEnterPassword}
        value={reEnterPassword}
        secureTextEntry
      />
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
