import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { auth, db } from './backend/firebase/firebaseConfig';
import CaloriesScreen from './screens/CaloriesScreen';
import EmergencyNumberScreen from './screens/EmergencyNumberScreen';
import MapsScreen from './screens/MapsScreen';
import PasswordChangeScreen from './screens/PasswordChangeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SetUserDetailsScreen from './screens/SetUserDetailsScreen';
import StatsScreen from './screens/StatsScreen';
import StepCounterScreen from './screens/StepCounterScreen';
import UserScreen from './screens/UserScreen';
import BtHomeScreen from './screens/BtHomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Function to refresh Firebase token
  const refreshToken = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.getIdToken(true); // Force token refresh
        console.log('🔥 Firebase token refreshed successfully.');
      } catch (error) {
        console.error('❌ Error refreshing Firebase token:', error);
      }
    }
  };

  // Function to create or fetch user data from Firestore
  const fetchUserData = async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userRef, {
          name: user.displayName || "New User",
          email: user.email,
          createdAt: new Date(),
        });
        console.log('✅ User document created in Firestore.');
      } else {
        //console.log('📌 User Data:', userSnap.data()); 
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('✅ User is authenticated:', user.uid);

        await refreshToken(); // Refresh token immediately
        await fetchUserData(user); // Fetch user data

        // Check last active session
        const lastActive = await AsyncStorage.getItem('lastActive');
        const currentTime = Date.now();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours

        if (lastActive && currentTime - parseInt(lastActive) > expirationTime) {
          await auth.signOut();
          setUser(null);
        } else {
          setUser(user);
          await AsyncStorage.setItem('lastActive', currentTime.toString());
        }
      } else {
        console.log('⚠️ User is not authenticated');
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Refresh token every 30 minutes
  useEffect(() => {
    const interval = setInterval(refreshToken, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  // Update last active timestamp every minute
  useEffect(() => {
    const updateLastActive = async () => {
      const currentTime = Date.now();
      await AsyncStorage.setItem('lastActive', currentTime.toString());
    };

    const interval = setInterval(updateLastActive, 60 * 1000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  if (initializing) return null; // Show nothing while checking authentication state

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "SignInScreen"}>
        <Stack.Screen 
          name="SignInScreen" 
          component={SignInScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen}
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
        name="SetUserDetailsScreen" 
        component={SetUserDetailsScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={BtHomeScreen} 
          options={{ 
            headerShown: false,
            title: userData ? `Welcome, ${userData.name}` : "Welcome"
          }} 
        />
        <Stack.Screen 
          name="User" 
          component={UserScreen} 
          options={{
            headerStyle: { backgroundColor: '#121212' }, 
            headerTintColor: 'white',
            headerTitle: "User Info", 
          }} 
        />
        <Stack.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' }, 
            headerTintColor: 'white',
            headerTitle: '', 
          }} 
        />
        <Stack.Screen
          name="Calories"
          component={CaloriesScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Food Tracker',
          }}
        />
        <Stack.Screen
          name="Maps"
          component={MapsScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Nearby Places',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Settings',
          }}
        />
        <Stack.Screen
          name="EmergencyNumber"
          component={EmergencyNumberScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Emergency Contact',
          }}
        />
        <Stack.Screen
          name="PasswordChange"
          component={PasswordChangeScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="StepCounter"
          component={StepCounterScreen}
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Steps History',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
