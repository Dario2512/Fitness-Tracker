import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import HomeScreen from './HomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import StatsScreen from './StatsScreen';
import UserScreen from './UserScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
