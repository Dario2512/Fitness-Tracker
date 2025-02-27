import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { auth } from './backend/firebase/firebaseConfig';
import CaloriesScreen from './screens/CaloriesScreen';
import EmergencyNumberScreen from './screens/EmergencyNumberScreen';
import HomeScreen from './screens/HomeScreen';
import MapsScreen from './screens/MapsScreen';
import PasswordChangeScreen from './screens/PasswordChangeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import StatsScreen from './screens/StatsScreen';
import UserScreen from './screens/UserScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, [initializing]);

  useEffect(() => {
    const updateLastActive = async () => {
      const currentTime = Date.now();
      await AsyncStorage.setItem('lastActive', currentTime.toString());
    };

    const interval = setInterval(updateLastActive, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (initializing) return null; // Render a loading screen or null while checking auth state

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "SignInScreen"}>
        <Stack.Screen 
          name="SignInScreen" 
          component={SignInScreen} 
          options={{
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen}
          options={{
            headerShown: false,
          }}  
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerShown: false, 
          }} 
        />
        <Stack.Screen 
          name="User" 
          component={UserScreen} 
          options={{
            headerStyle: { backgroundColor: '#121212' }, 
            headerTintColor: 'white',
            headerTitle: 'User Info', 
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
            headerTitle: 'Change Password',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}