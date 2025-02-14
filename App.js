import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import StatsScreen from './screens/StatsScreen';
import UserScreen from './screens/UserScreen';
import MapsScreen from './screens/MapsScreen';
import CaloriesScreen from './screens/CaloriesScreen';

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
            headerTitle: 'Calories Tracker', // Update title
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
