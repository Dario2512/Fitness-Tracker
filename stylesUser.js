import { StyleSheet } from 'react-native';

const stylesUser = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF', // White text for header
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 30,
  },
  userInfoText: {
    fontSize: 18,
    color: '#FFF', // White text for user data
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2C2C2C', // Dark background for input
    borderWidth: 1,
    borderColor: '#FF6347', // Tomato red border
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#FFF', // White text for input
    fontSize: 16,
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
    color: 'white',
    padding: 10,
    textAlign: 'center',
    marginTop: 15,
    borderRadius: 5,
    fontSize: 18,
  },
  buttonCancel: {
    backgroundColor: '#555', // Darker shade for cancel button
    color: '#FFF',
    padding: 10,
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  editButton: {
    backgroundColor: '#FF6347', // Red color for the Edit button
    color: 'white',
    padding: 10,
    textAlign: 'center',
    marginTop: 20,
    borderRadius: 5,
    fontSize: 18,
  },
});

export default stylesUser;
