import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2c2c2c', // Dark gray background
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White text for the header
  },
  todayBox: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White text for today's calories
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 16,
    color: '#333', // Dark text for card items
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#fff', // White background for input fields
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background with transparency for modal
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2c2c2c', // Dark background for the modal
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff', // White text in modal header
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#fff', // White background for input fields
    width: '100%',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#FF6347', // Tomato red color for modal button
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15, // Adding space between save and cancel button
    backgroundColor: '#FF6347', // Tomato red color for cancel button as well
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Custom styles for buttons
  buttonsContainer: {
    marginBottom: 20,
  },
  buttonStyle: {
    borderRadius: 20,
    height: 45,
    backgroundColor: '#FF6347', // Tomato red background for main buttons
    marginBottom: 15, // Space between buttons
  },
  // Button text styles
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
