import { StyleSheet } from 'react-native';

const stylesUser = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF', // White text for header
    textAlign: 'center',
    marginBottom: 50, // Add more spacing below the header
  },
  userInfo: {
    marginBottom: 30,
    alignItems: 'center', // Center user info text
  },
  userInfoText: {
    fontSize: 18,
    color: '#FFF', // White text for user data
    marginBottom: 10,
    textAlign: 'center', // Center-align text
  },
  input: {
    backgroundColor: '#2C2C2C', // Dark background for input
    borderWidth: 1,
    borderColor: '#FF6347', // Tomato red border
    borderRadius: 5,
    padding: 10,
    width: '80%', // Increase width for better usability
    marginBottom: 15,
    color: '#FFF', // White text for input
    fontSize: 16,
    textAlign: 'center', // Center-align input text
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A1A', // Dark gray background for modal
  },
  button: {
    backgroundColor: '#FF6347', // Tomato red for buttons
    padding: 12,
    width: '80%', // Make buttons consistent with input width
    textAlign: 'center',
    marginTop: 15,
    borderRadius: 5,
    fontSize: 18,
    alignItems: 'center', // Center button text
  },
  buttonCancel: {
    backgroundColor: '#555', // Darker shade for cancel button
    padding: 12,
    width: '80%', // Make buttons consistent with input width
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 5,
    fontSize: 18,
    alignItems: 'center', // Center button text
  },
  editButton: {
    backgroundColor: '#FF6347', // Red color for the Edit button
    paddingVertical: 8, // Adjust vertical padding
    paddingHorizontal: 20, // Adjust horizontal padding to wrap around text
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center', // Center the button horizontally
  },
  editButtonText: {
    color: '#FFF', // White text for the button
    fontSize: 16,
    textAlign: 'center',
  },
});

export default stylesUser;