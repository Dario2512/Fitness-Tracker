import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 30, // Increased padding for better spacing
    backgroundColor: '#121212', // Dark background
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  label: {
    fontSize: 28, // Larger font size for the label
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30, // Add more spacing below the label
    textAlign: 'center',
  },
  emergencyName: {
    fontSize: 22, // Larger font size for emergency name
    color: 'white',
    marginBottom: 15,
    textAlign: 'center', // Center-align text
  },
  emergencyNumber: {
    fontSize: 22, // Larger font size for emergency number
    color: 'white',
    marginBottom: 40, // Add more spacing below the emergency number
    textAlign: 'center', // Center-align text
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 20, // Reduced horizontal padding
    borderRadius: 8, // Slightly smaller border radius
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: {
    color: 'white',
    fontSize: 16, // Slightly smaller font size for button text
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%', // Increased width for modal content
    backgroundColor: '#1e1e1e', // Dark gray background for modal
    padding: 30, // Increased padding for modal content
    borderRadius: 15, // Slightly larger border radius
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 22, // Larger font size for modal label
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50, // Increased height for input
    borderColor: '#FF6347', // Tomato red border
    borderWidth: 1,
    paddingHorizontal: 15, // Increased horizontal padding
    marginBottom: 25, // Increased spacing between inputs
    borderRadius: 8, // Slightly larger border radius
    backgroundColor: '#2C2C2C', // Dark background for input
    color: 'white', // White text for input
    fontSize: 18, // Larger font size for input text
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'tomato',
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 20, // Reduced horizontal padding
    borderRadius: 8, // Slightly smaller border radius
    alignItems: 'center',
    marginTop: 10, // Reduced spacing between buttons
    width: '100%',
  },
});