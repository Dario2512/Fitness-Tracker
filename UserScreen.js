import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';
import styles from './stylesUser.js';

const UserScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    username: '',
    age: '',
    height: '',
    weight: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });

  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          navigation.navigate('SignInScreen');
          return;
        }

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setEditedData(data);

          if (!data.username || !data.age || !data.height || !data.weight) {
            setIsNewUser(true);
          }
        } else {
          setError('No user data found!');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [db, navigation]);

  const handleEdit = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, editedData);
      setUserData(editedData);
      setIsModalVisible(false);
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      setError('Failed to update user data');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  if (loading) {
    return <Text>Loading user details...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Name: {userData.username}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>Age: {userData.age} years</Text>
        <Text style={styles.userInfoText}>Height: {userData.height} cm</Text>
        <Text style={styles.userInfoText}>Weight: {userData.weight} kg</Text>
      </View>

      <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.editButton}>
        <Text style={{ color: 'white' }}>Edit Info</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Edit Details:</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={editedData.username}
            onChangeText={(text) => handleInputChange('username', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={editedData.age}
            onChangeText={(text) => handleInputChange('age', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Height"
            value={editedData.height}
            onChangeText={(text) => handleInputChange('height', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={editedData.weight}
            onChangeText={(text) => handleInputChange('weight', text)}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={handleEdit} style={styles.button}>
            <Text style={{ color: 'white' }}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.buttonCancel}>
            <Text style={{ color: 'white' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default UserScreen;
