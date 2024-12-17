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
    top: 15,
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
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5, // Shadow for better visibility
  },
  measurementText: {
    fontSize: 18,
    color: '#FFF', // White text for measurements
    marginVertical: 5,
  },
  measureButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 50
  },
  measureButton: {
    backgroundColor: '#FF6347', // Tomato red for the measure button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  measureButtonDisabled: {
    backgroundColor: '#D3D3D3', // Light gray when disabled
  },
  measureButtonText: {
    fontSize: 18,
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
  heartContainer: {
    marginBottom: 50,
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
});

export default styles;
