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
        />
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerShown: false, // This will completely hide the header, including the back button
          }} 
        />
        <Stack.Screen 
          name="User" 
          component={UserScreen} 
        />
        <Stack.Screen 
          name="Stats" 
          component={StatsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
