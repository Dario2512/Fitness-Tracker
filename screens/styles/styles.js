import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', 
  },
  // Logout button styling
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
  },
  logoutText: {
    color: '#FF4D4D', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  // App name styling
  appNameContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20 
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF', 
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF', 
    textAlign: 'start',
    marginTop: 0,
    marginBottom: 20,
  },
  lastMeasurement: {
    backgroundColor: '#1A1A1A', 
    padding: 10,
    borderRadius: 10,
    marginBottom: 50,
    elevation: 5, 
  },
  lastMeasurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noMeasurementContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMeasurementText: {
    fontSize: 16,
    color: '#888', 
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  historyButton: {
    backgroundColor: '#1A1A1A',
    padding: 10,
    paddingTop: 0,
    borderRadius: 5,
  },
  historyButtonText: {
    color: '#FF4D4D', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  measurementText: {
    fontSize: 20, 
    color: '#FFF', 
    marginBottom: 10, 
  },
  measureButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  measureButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  measureButtonDisabled: {
    backgroundColor: '#ff6347',
    opacity: 0.5,
  },
  measureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bluetoothButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  bluetoothIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  heartContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 10,
  },
  heartIcon: {
    width: 150,  
    height: 150,
    resizeMode: 'contain',  
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0, 
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    paddingBottom: 30,
    backgroundColor: '#1A1A1A', 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#FF6347', 
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  navButtonText: {
    fontSize: 16,
    color: '#FFF', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Navigation Drawer Button Styling
  drawerButton: {
    position: 'absolute',
    top: 15,
    right: 10,
    padding: 10,
  },
  drawerText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  settingsButton: {
    position: 'absolute',
    top: 45,
    right: 10,
    padding: 5, 
  },
  settingsIcon: {
    width: 24,  
    height: 24,
    resizeMode: 'contain',
  },
// Modal styles
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
},
modalContent: {
  width: '80%',
  backgroundColor: '#1A1A1A', 
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
},
modalLabel: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#FFF', 
  marginBottom: 20,
},
timerText: {
  fontSize: 16, 
  color: 'white', 
  marginBottom: 20, 
  textAlign: 'center', 
},
modalButton: {
  backgroundColor: '#FF6347', 
  paddingVertical: 10, 
  paddingHorizontal: 20, 
  borderRadius: 10, 
  marginVertical: 10, 
  alignItems: 'center', 
  alignSelf: 'center', 
  width: '80%', 
},
buttonText: {
  color: '#FFF', 
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center', 
},
closeButton: {
  backgroundColor: '#FF6347', 
  paddingVertical: 10, 
  paddingHorizontal: 20, 
  borderRadius: 10, 
  marginVertical: 10, 
  alignItems: 'center', 
  alignSelf: 'center', 
  width: '80%', 
},
});

export default styles;