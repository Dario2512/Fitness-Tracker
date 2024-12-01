import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAn_rmtbFkSBRhiqBAfqdwhUuKdRKqV9Mc",
  authDomain: "fitness-tracker-be834.firebaseapp.com",
  projectId: "fitness-tracker-be834",
  storageBucket: "fitness-tracker-be834.appspot.com",
  messagingSenderId: "711765208589",
  appId: "1:711765208589:web:b4dccca0e9d829a5afaf44",
  measurementId: "G-XL4BVK5YLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
