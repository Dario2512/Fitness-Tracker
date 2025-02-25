import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
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
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInScreen">
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
          component={CaloriesScreen} // Add the CaloriesScreen
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Food Tracker', // Update title
          }}
        />
        <Stack.Screen
          name="Maps"
          component={MapsScreen} //Add MapsScreen
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Nearby Places',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen} // Add SettingsScreen
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Settings',
          }}
        />
        <Stack.Screen
          name="EmergencyNumber"
          component={EmergencyNumberScreen} // Add EmergencyNumberScreen
          options={{
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: 'white',
            headerTitle: 'Emergency Contact',
          }}
          />
          <Stack.Screen
          name="PasswordChange"
          component={PasswordChangeScreen} // Add EmergencyNumberScreen
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
