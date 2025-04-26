import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Easing, FlatList, Image, Linking, Modal, PermissionsAndroid, Text, TouchableOpacity, View, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx'; // Import the BLE manager
import { auth, db } from '../backend/firebase/firebaseConfig';
import { Buffer } from 'buffer';
import bluetoothIcon from './images/Bluetooth.png'; // Add the Bluetooth icon
import settingsIcon from './images/Gear.png';
import heartIcon from './images/HeartV2.png';
import styles from './styles/styles';
import Constants from "expo-constants";

//const NGROK_URL = Constants.expoConfig?.extra?.NGROK_URL;
const manager = new BleManager();

const BtHomeScreen = () => {
  const navigation = useNavigation();
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [heartAnimation] = useState(new Animated.Value(1)); // Initial scale of heart
  const [name, setname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [bluetoothModalVisible, setBluetoothModalVisible] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
  const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb"

  useEffect(() => {
    fetchLastMeasurement();
    fetchUserData();
    fetchEmergencyNumber();
    requestBluetoothPermissions(); // Request Bluetooth permissions
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ]);
  
        if (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permission Denied', 'Bluetooth permissions are required to scan for devices.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  

  const fetchLastMeasurement = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const response = await fetch(`https://b703-178-220-185-182.ngrok-free.app/api/measurements/last?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setLastMeasurement(data);
        } else {
          console.error('Failed to fetch last measurement');
        }
      } catch (error) {
        console.error('Error fetching last measurement:', error);
      }
    }
  };

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setname(userData.name || 'User');
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const fetchEmergencyNumber = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
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
    }
  };

  const handleMeasure = async () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'Please connect to a Bluetooth device first.');
      return;
    }
  
    setIsMeasuring(true);
    animateHeart(true); // Start heart animation
  
    let totalHeartRate = 0;
    let totalSpO2 = 0;
    let totalTemperature = 0;
    let count = 0;
  
    console.log("Starting measurement...");
  
    let subscription; // Declare subscription variable
  
    try {
      // Monitor the characteristic
      subscription = connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID, // Service UUID
        CHARACTERISTIC_UUID, // Characteristic UUID
        async (error, characteristic) => {
          if (error) {
            console.error('Error reading characteristic:', error);
            return;
          }
  
          if (!characteristic?.value) {
            console.error('Received empty characteristic value.');
            return;
          }
  
          let decodedData = Buffer.from(characteristic.value, 'base64').toString('utf-8').trim();
          console.log('Decoded Data:', decodedData);
  
          // Process data
          const values = decodedData.split(',').map(value => parseFloat(value));
  
          if (values.length !== 3) {
            console.error('Unexpected data format:', decodedData);
            return;
          }
  
          const [heartRate, spO2, temperature] = values;
  
          if (!isNaN(heartRate) && !isNaN(spO2) && !isNaN(temperature)) {
            totalHeartRate += heartRate;
            totalSpO2 += spO2;
            totalTemperature += temperature;
            count += 1;
            console.log(`Received: HR=${heartRate}, SpO2=${spO2}, Temp=${temperature}`);
          } else {
            console.error('Invalid numeric data:', decodedData);
          }
        }
      );
  
      // Wait for 60 seconds to collect data
      await new Promise((resolve) => setTimeout(resolve, 5000));
  
      // Stop monitoring after the time interval
      if (subscription) {
        console.log("Stopping monitoring...");
        subscription.remove(); // Stop monitoring safely
      }
  
      if (count === 0) {
        console.error('No valid data received during measurement.');
        setIsMeasuring(false);
        animateHeart(false);
        return;
      }
  
      const averageHeartRate = totalHeartRate / count;
      const averageSpO2 = totalSpO2 / count;
      const averageTemperature = totalTemperature / count;
  
      console.log('Averages:', {
        heartRate: averageHeartRate,
        spO2: averageSpO2,
        temperature: averageTemperature,
      });
  
      // Check for abnormal values
      if (averageHeartRate < 50 || averageHeartRate > 150 || 
          averageSpO2 < 90 || averageTemperature < 35.1 || 
          averageTemperature > 37.5) {
        setModalVisible(true);
  
        setTimeout(() => {
          if (modalVisible) {
            redirectToPhoneApp();
          }
        }, 60000);        
      }
  
      // Send averaged measurement to the backend
      try {
        const response = await fetch(`https://b703-178-220-185-182.ngrok-free.app/api/measurements?userId=${auth.currentUser.uid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: auth.currentUser.uid, 
            heartRate: averageHeartRate, 
            spO2: averageSpO2, 
            temperature: averageTemperature 
          }),
        });
  
        if (response.ok) {
          console.log('Measurement saved successfully');
          fetchLastMeasurement(); // Refresh the last measurement
        } else {
          console.error('Failed to save measurement');
        }
      } catch (error) {
        console.error('Error during measurement:', error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsMeasuring(false);
      animateHeart(false); // Stop heart animation
    }
  };    

  const redirectToPhoneApp = () => {
    const phoneNumber = `tel:${emergencyNumber}`;
    Linking.openURL(phoneNumber).catch((err) => console.error('Error opening phone app:', err));
  };

  const animateHeart = (shouldAnimate) => {
    if (shouldAnimate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnimation, {
            toValue: 1.5,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnimation, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      heartAnimation.stopAnimation();
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('successfully logged out.');
      navigation.replace('SignInScreen');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        console.log("Disconnected from device.");
        setConnectedDevice(null); // Reset the connected device state
      } catch (error) {
        console.error("Error disconnecting from device:", error);
      }
    } else {
      console.log("No device connected.");
    }
  };
  

  const handleBluetoothPress = () => {
    if (connectedDevice) {
      // If connected, disconnect
      handleDisconnect();
    } else {
      // If not connected, show the Bluetooth modal
      setBluetoothModalVisible(true);
      scanForDevices();
    }
  };  
  

  const scanForDevices = () => {
    setAvailableDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning for devices:', error);
        return;
      }
      setAvailableDevices((prevDevices) => {
        const deviceExists = prevDevices.some((d) => d.id === device.id);
        if (!deviceExists) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });
  
    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };
  

  const connectToDevice = async (deviceId) => {
    try {
        const device = await manager.connectToDevice(deviceId);
        await device.discoverAllServicesAndCharacteristics();
        console.log("Connected to device:", device.id);

        setConnectedDevice(device); // Set the connected device state
        setBluetoothModalVisible(false); // Close the Bluetooth modal

        Alert.alert("Success", `Connected to ${device.name || "Device"}`);
    } catch (error) {
        console.error("Error connecting to device:", error);
        Alert.alert("Error", "Failed to connect. Try again.");
    }
};
  

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Settings Button */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <Image source={settingsIcon} style={styles.settingsIcon} />
      </TouchableOpacity>

      {/* Username Display */}
      <View style={styles.appNameContainer}>
        <Text style={styles.appName}>Hi, {name} 👋</Text>
      </View>

      {/* Last Measurement Display */}
      {lastMeasurement && (
        <View style={styles.lastMeasurement}>
          <View style={styles.lastMeasurementHeader}>
            <Text style={styles.header}>Last Measurement:</Text>
            <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('Stats')}>
              <Text style={styles.historyButtonText}>History</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.measurementText}>
            Heart Rate: {lastMeasurement.heartRate ? lastMeasurement.heartRate.toFixed(1) : 'N/A'} bpm
          </Text>
          <Text style={styles.measurementText}>
            SpO2: {lastMeasurement.spO2 ? lastMeasurement.spO2.toFixed(1) : 'N/A'} %
          </Text>
          <Text style={styles.measurementText}>
            Temperature: {lastMeasurement.temperature ? lastMeasurement.temperature.toFixed(1) : 'N/A'} °C
          </Text>
        </View>
      )}

      {/* Heart Icon */}
      <View style={styles.heartContainer}>
        <Animated.View
          style={{ transform: [{ scale: heartAnimation }] }}
        >
          <Image source={heartIcon} style={styles.heartIcon} />
        </Animated.View>
      </View>

      {/* Measure and Bluetooth Buttons */}
      <View style={styles.measureButtonContainer}>
        <TouchableOpacity
          style={[styles.measureButton, !connectedDevice && styles.measureButtonDisabled]}
          onPress={handleMeasure}
          disabled={!connectedDevice || isMeasuring}
        >
          <Text style={styles.measureButtonText}>
            {isMeasuring ? 'Measuring...' : 'Measure'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bluetoothButton}
          onPress={handleBluetoothPress}
        >
          <Image source={bluetoothIcon} style={styles.bluetoothIcon} />
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Calories')}>
          <Text style={styles.navButtonText}>Calories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('StepCounter')}>
          <Text style={styles.navButtonText}>Steps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Maps')}>
          <Text style={styles.navButtonText}>Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Bluetooth Modal */}
        <Modal
        animationType="fade"
        transparent={true}
        visible={bluetoothModalVisible}
        onRequestClose={() => setBluetoothModalVisible(false)}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Available Devices</Text>
            <FlatList
              data={availableDevices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => connectToDevice(item.id)}
                >
                  <Text style={styles.buttonText}>{item.name || item.id}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton} // Apply the new closeButton style
              onPress={() => setBluetoothModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Emergency Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Are you feeling well?</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={redirectToPhoneApp}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BtHomeScreen;