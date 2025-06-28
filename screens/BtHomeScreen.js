import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Easing, FlatList, Image, Linking, Modal, PermissionsAndroid, Text, TouchableOpacity, View, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx'; 
import { auth, db } from '../backend/firebase/firebaseConfig';
import { Buffer } from 'buffer';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import bluetoothIcon from './images/Bluetooth.png'; 
import settingsIcon from './images/Gear.png';
import heartIcon from './images/HeartV2.png';
import styles from './styles/styles';
import Constants from "expo-constants";

const manager = new BleManager();
let timerInterval;

const BtHomeScreen = () => {
  const navigation = useNavigation();
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [heartAnimation] = useState(new Animated.Value(1)); 
  const [name, setname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const [location, setLocation] = useState(null);
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyReason, setEmergencyReason] = useState('');
  const [bluetoothModalVisible, setBluetoothModalVisible] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
  const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb"

  useEffect(() => {
    fetchLastMeasurement();
    fetchUserData();
    fetchEmergencyNumber();
    requestBluetoothPermissions(); 
  }, []);

  useEffect(() => {
    if (modalVisible) {
      startTimer();
      fetchLocation();
    } else {
      clearTimer();
    }
  }, [modalVisible]);

  useEffect(() => {
    const initializeLocation = async () => {
      console.log('Fetching location on screen load...');
      setLocation(null); 
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to send your location.');
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location fetched on screen load:', location.coords);
        setLocation(location.coords); 
      } catch (error) {
        console.error('Error fetching location on screen load:', error);
        setLocation(null); 
      }
    };
  
    initializeLocation(); 
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
        const response = await fetch(`https://dbc7-178-220-185-88.ngrok-free.app/api/measurements/last?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setLastMeasurement(data); 
          } else {
            setLastMeasurement(null);
          }
        } else {
          setLastMeasurement(null); 
        }
      } catch (error) {
        setLastMeasurement(null); 
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
    animateHeart(true); 
  
    let totalHeartRate = 0;
    let totalSpO2 = 0;
    let totalTemperature = 0;
    let count = 0;
  
    console.log("Starting measurement...");
  
    let subscription; 
  
    try {
      subscription = connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID, 
        async (error, characteristic) => {
          if (error) {
            return;
          }
  
          if (!characteristic?.value) {
            console.error('Received empty characteristic value.');
            return;
          }
  
          let decodedData = Buffer.from(characteristic.value, 'base64').toString('utf-8').trim();
          console.log('Decoded Data:', decodedData);
  
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
  
      await new Promise((resolve) => setTimeout(resolve, 30000));
  
      if (subscription) {
        console.log("Stopping monitoring...");
        subscription.remove(); 
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
  
      const reason = getEmergencyReason(averageHeartRate, averageSpO2, averageTemperature);
      if (reason) {
        setEmergencyReason(reason);
        setModalVisible(true);
        setTimeout(() => {
          if (modalVisible) {
            redirectToPhoneApp();
          }
        }, 5000);
      }
  
      try {
        const response = await fetch(`https://dbc7-178-220-185-88.ngrok-free.app/api/measurements?userId=${auth.currentUser.uid}`, {
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
          fetchLastMeasurement();
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
      animateHeart(false);
    }
  };

  function getEmergencyReason(heartRate, spO2, temperature) {
    let reason = '';

    // Heart Rate
    if (heartRate < 30) reason += 'extremely low heart rate ';
    else if (heartRate < 40) reason += 'very low heart rate ';
    else if (heartRate < 50) reason += 'low heart rate ';
    else if (heartRate > 180) reason += 'extremely high heart rate ';
    else if (heartRate > 140) reason += 'very high heart rate ';
    else if (heartRate > 120) reason += 'high heart rate ';

    // SpO2
    if (spO2 < 80) reason += 'dangerously low oxygen saturation ';
    else if (spO2 < 85) reason += 'very low oxygen saturation) ';
    else if (spO2 < 90) reason += 'low oxygen saturation ';
    else if (spO2 < 94) reason += 'slightly low oxygen saturation ';

    // Temperature
    if (temperature < 32) reason += 'body temperature extremely low ';
    else if (temperature < 35.1) reason += 'body temperature low ';
    else if (temperature > 41) reason += 'life-threatening fever ';
    else if (temperature > 39.5) reason += 'very high fever ';
    else if (temperature > 37.5) reason += 'mild fever ';

    return reason.trim();
  }
  

  
  const startTimer = () => {
    clearInterval(timerInterval); 
    setTimer(60); 
    timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          sendEmergencyMessage(); 
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const clearTimer = () => {
    clearInterval(timerInterval); 
    setTimer(60); 
  };

  const redirectToPhoneApp = () => {
    const phoneNumber = `tel:${emergencyNumber}`;
    Linking.openURL(phoneNumber).catch((err) => console.error('Error opening phone app:', err));
  };

  const fetchLocation = async () => {
    console.log('Fetching location...');
    setLocation(null); 
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to send your location.');
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      console.log('Location fetched:', location.coords);
      setLocation(location.coords); 
    } catch (error) {
      setLocation(null); 
    }
  };

  const sendEmergencyMessage = async () => {
    if (!emergencyNumber) {
      Alert.alert('Error', 'No emergency contact available.');
      return;
    }
  
    if (!location) {
      console.log('Fetching location before sending the message...');
      await fetchLocation(); 
    }
  
    const message = location
      ? `I'm not feeling well. My current location is: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : "I'm not feeling well. I couldn't fetch my location.";
  
    try {
      const smsUrl = `sms:${emergencyNumber}?body=${encodeURIComponent(message)}`;
      Linking.openURL(smsUrl).catch((err) => {
        console.error('Error opening messaging app:', err);
        Alert.alert('Error', 'Failed to open messaging app.');
      });
    } catch (error) {
      console.error('Error preparing SMS:', error);
      Alert.alert('Error', 'Failed to prepare emergency message.');
    }
  
    setModalVisible(false); 
  };

  const handleYes = () => {
    clearTimer();
    setModalVisible(false); 
  };
  
  const handleNo = () => {
    clearTimer();
    setModalVisible(false);
    redirectToPhoneApp(); 
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
        setConnectedDevice(null); 
      } catch (error) {
        console.error("Error disconnecting from device:", error);
      }
    } else {
      console.log("No device connected.");
    }
  };
  

  const handleBluetoothPress = () => {
    if (connectedDevice) {
      handleDisconnect();
    } else {
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
      if (device.name !== "Trackario") return prevDevices;
      const deviceExists = prevDevices.some((d) => d.id === device.id);
      if (!deviceExists) {
        return [...prevDevices, device];
      }
      return prevDevices;
    });
    });
  
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };
  

  const connectToDevice = async (deviceId) => {
    try {
        const device = await manager.connectToDevice(deviceId);
        await device.discoverAllServicesAndCharacteristics();
        console.log("Connected to device:", device.id);

        setConnectedDevice(device); 
        setBluetoothModalVisible(false); 

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
      {lastMeasurement ? (
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
      ) : (
        <View style={styles.noMeasurementContainer}>
          <Text style={styles.noMeasurementText}>No measurements available. Start measuring to see your stats!</Text>
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
            {emergencyReason ? (
              <Text style={styles.emergencyReasonText}>
                You have {emergencyReason}.
              </Text>
            ) : null}
            <Text style={styles.timerText}>{timer}s</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleYes}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleNo}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BtHomeScreen;