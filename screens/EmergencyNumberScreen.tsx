import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../backend/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from './styles/stylesEmergencyNumber';

const EmergencyNumberScreen: React.FC = () => {
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmergencyNumber, setNewEmergencyNumber] = useState('');
  const [newEmergencyName, setNewEmergencyName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEmergencyNumber = async () => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        Alert.alert('Error', 'User is not logged in');
        return;
      }

      try {
        const emergencyDocRef = doc(db, 'users', userId, 'emergency', 'emergencyNumber');
        const emergencyDoc = await getDoc(emergencyDocRef);
        if (emergencyDoc.exists()) {
          const data = emergencyDoc.data();
          setEmergencyName(data?.name || '');
          setEmergencyNumber(data?.number || '');
        }
      } catch (error) {
        console.error('Error fetching emergency number:', error);
        Alert.alert('Error', 'Failed to fetch emergency number');
      }
    };

    fetchEmergencyNumber();
  }, []);

  const handleSave = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'User is not logged in');
      return;
    }

    try {
      const emergencyDocRef = doc(db, 'users', userId, 'emergency', 'emergencyNumber');
      await setDoc(emergencyDocRef, { name: newEmergencyName, number: newEmergencyNumber }, { merge: true });
      setEmergencyName(newEmergencyName);
      setEmergencyNumber(newEmergencyNumber);
      setModalVisible(false);
      //Alert.alert('Success', 'Emergency number saved successfully');
    } catch (error) {
      console.error('Error saving emergency number:', error);
      Alert.alert('Error', 'Failed to save emergency number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Emergency Info:</Text>
      <Text style={styles.emergencyName}>{emergencyName}</Text>
      <Text style={styles.emergencyNumber}>{emergencyNumber}</Text>
      <TouchableOpacity style={styles.button} onPress={() => {
        setNewEmergencyName(emergencyName);
        setNewEmergencyNumber(emergencyNumber);
        setModalVisible(true);
      }}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Edit Info</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#888"
              value={newEmergencyName}
              onChangeText={setNewEmergencyName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter emergency number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={newEmergencyNumber}
              onChangeText={setNewEmergencyNumber}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmergencyNumberScreen;