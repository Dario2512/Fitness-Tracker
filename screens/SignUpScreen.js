import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../backend/firebase/firebaseConfig';
import stylesSign from './styles/stylesSign';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignUp = async () => {
    if (password !== reenterPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        name: name,
        surname: surname,
        age: '',
        height: '',
        weight: '',
      });

      navigation.navigate('SignInScreen');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={stylesSign.container}>
      <TextInput
        style={stylesSign.input}
        placeholder="Name"
        placeholderTextColor="#fff"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Surname"
        placeholderTextColor="#fff"
        onChangeText={setSurname}
        value={surname}
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={stylesSign.input}
        placeholder="Re-enter Password"
        placeholderTextColor="#fff"
        onChangeText={setReenterPassword}
        value={reenterPassword}
        secureTextEntry
      />
      {passwordError ? <Text style={stylesSign.errorText}>{passwordError}</Text> : null}
      {error ? <Text style={stylesSign.errorText}>{error}</Text> : null}
      <TouchableOpacity style={stylesSign.button} onPress={handleSignUp}>
        <Text style={stylesSign.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={stylesSign.button} onPress={() => navigation.navigate('SignInScreen')}>
        <Text style={stylesSign.buttonText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
