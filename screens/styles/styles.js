import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Black background for the whole screen
  },
  // Logout button styling
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
  },
  logoutText: {
    color: '#FF4D4D', // Red logout button text
    fontSize: 16,
    fontWeight: 'bold',
  },
  // App name styling
  appNameContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20 // Push down a little from the top
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF', // White text for app name
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF', // White text for header
    textAlign: 'start',
    marginTop: 0,
    marginBottom: 20,
  },
  lastMeasurement: {
    backgroundColor: '#1A1A1A', // Dark gray background for last measurement
    padding: 10,
    borderRadius: 10,
    marginBottom: 50,
    elevation: 5, // Shadow for better visibility
  },
  lastMeasurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyButton: {
    backgroundColor: '#1A1A1A',
    padding: 10,
    paddingTop: 0,
    borderRadius: 5,
  },
  historyButtonText: {
    color: '#FF4D4D', // Red text for history button
    fontWeight: 'bold',
    fontSize: 16,
  },
  measurementText: {
    fontSize: 20, // Increase the font size
    color: '#FFF', // White text color
    marginBottom: 10, // Add some space between measurements
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
    width: 150,  // Adjust the size as needed
    height: 150,
    resizeMode: 'contain',  // Ensure the image scales correctly
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0, // Align it to the bottom
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    paddingBottom: 30,
    backgroundColor: '#1A1A1A', // Dark gray background for buttons
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#FF6347', // Tomato red for navigation buttons
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  navButtonText: {
    fontSize: 16,
    color: '#FFF', // White text
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
    padding: 5, // Adjust padding to make it smaller
  },
  settingsIcon: {
    width: 24,  // Smaller size for the gear icon
    height: 24,
    resizeMode: 'contain',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1A1A1A', // Dark gray background for modal
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
  modalButton: {
    backgroundColor: '#FF6347', 
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%', 
    alignItems: 'flex-start', 
  },
  buttonText: {
    color: '#FFF', 
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap', 
    textAlign: 'left', 
  },
  closeButton: {
    backgroundColor: '#FF6347', // Tomato red for the close button
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: '50%', // Make the button smaller (50% of the modal width)
    alignItems: 'center', // Center the text inside the button
    alignSelf: 'center', // Center the button within the modal
  },
});

export default styles;