// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
