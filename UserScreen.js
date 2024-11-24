import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';

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
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [editedData, setEditedData] = useState({ ...userData }); // Store edited data

  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          // Redirect if user is not logged in
          navigation.navigate('SignInScreen');
          return;
        }

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data); // Display the current user data
          setEditedData(data); // Initialize the modal with current user data

          // Check if required fields are missing
          if (!data.username || !data.age || !data.height || !data.weight) {
            setIsNewUser(true); // Mark as new user if any field is missing
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
      setUserData(editedData); // Update userData with the new values
      setIsModalVisible(false); // Close the modal after saving
      navigation.navigate('Home'); // Navigate to the home screen after saving
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
      <Text style={styles.header}>User Setup</Text>
      <View style={styles.userInfo}>
        <Text>Username: {userData.username}</Text>
        <Text>Age: {userData.age}</Text>
        <Text>Height: {userData.height}</Text>
        <Text>Weight: {userData.weight}</Text>
      </View>

      <Button title="Edit Info" onPress={() => setIsModalVisible(true)} />

      {/* Modal for editing user data */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Edit User Details</Text>
          
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

          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.button}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text style={styles.button}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
  userInfo: { marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  button: { backgroundColor: '#007bff', color: 'white', padding: 10, textAlign: 'center', marginTop: 10 },
});

export default UserScreen;
