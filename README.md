# Fitness Tracker (Trackario)

A complete health monitoring app: track vital signs via Bluetooth, count steps, monitor calories, and send emergency messages with your location.

---

## What does the app do?

- **Vital Measurements:** Receives heart rate, SpO2, and temperature from an ESP32 device via Bluetooth.
- **Step Counter:** Counts your daily and weekly steps using your phone’s sensors.
- **Calories:** Calculates and tracks calories burned and food intake.
- **Emergency Function:** Sends a pre-filled SMS with your location to an emergency contact if you don’t respond to a health alert.
- **History:** View your measurement and step history.
- **Maps:** View current location and relevant destinations in your surrounding (Hospitals, Gyms and Stadiums)
- **User Authentication:** Uses Firebase for user management and data storage.

---

## Project Structure

- `/screens` – React Native/Expo screens and UI components
- `/backend` – Node.js/Express backend (REST API, Firebase)
- `/Hardware` – Arduino IDE code for the physical device

---

## Quick Start Guide

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):  
  ```bash
  npm install -g expo-cli
- Ngrok (for exposing your backend to the internet)
- Android Studio (for emulator, optional)
- Physical Android device (required for sensors: Bluetooth, pedometer, etc.)
- Firebase project setup
- .env file(root directory) with Google Maps API


### 2. Install dependencies
Project root:
- npm install or npm install --legacy-peer-deps
cd backend:
- npm install

### 3. Backend setup
- Place your Firebase service account key (firebase-adminsdk.json) in backend/firebase/.
- Place your firebaseConfig.js in backend/firebase/

Start the backend server:
- cd backend
- node server.js

### 4. Expose backend with Ngrok (optional) or use localhost(local ip)
- ngrok http 3000
- Copy the generated Ngrok URL (e.g., https://****.ngrok-free.app) and use it in your frontend fetch requests (in /screens files)

### 5. Frontend setup & running
- Make sure all backend URLs are correct in your frontend code
- Start expo: npm start 
- Scan the QR code with the Expo Go app 
- or
- run on a physical device: eas build --platform android --profile development 
- (make sure you have expo account)


### 6. ESP32 physical device
- Open /Hardware/ESP32.ino in Arduino IDE.
Select the correct board and port(ESP32 Dev module).
Upload the sketch to your ESP32 device.

### 7. Permissions Required
- Bluetooth (for vital measurements)
- Location (for emergency location sharing and Maps screen)
- Activity Recognition (for step counting)

### 8. Troubleshooting

Frontend-backend connection issues:
- Make sure Ngrok is running and the URL is correct in your frontend code.

Firebase errors:
- Check your service account key and Firestore permissions.

Bluetooth not working:
- Check permissions and hardware connections.
