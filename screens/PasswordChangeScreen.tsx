import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { changePassword } from '../backend/passwordChangeHandler';
import styles from './styles/stylesPasswordChange';

const PasswordChangeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== repeatNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully.');
      navigation.goBack();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        placeholderTextColor="white"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="white"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat New Password"
        placeholderTextColor="white"
        secureTextEntry
        value={repeatNewPassword}
        onChangeText={setRepeatNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordChangeScreen;