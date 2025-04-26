import { StyleSheet } from 'react-native';

const stylesSign = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#1f1f1f', // Dark background for consistency with black theme
  },
  logo: {
    width: 120, // Adjust the width of the logo
    height: 120, // Adjust the height of the logo
    alignSelf: 'center', // Center the logo horizontally
    marginBottom: 10, // Add spacing below the logo
  },
  appName: {
    fontSize: 28, // Font size for the app name
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center the text
    color: '#fff', // White color for the app name
    marginBottom: 40, // Add spacing below the app name
  },
  header: {
    fontSize: 15,
    marginBottom: 40,
    textAlign: 'center',
    color: '#fff', // White color for the header text
  },
  input: {
    borderColor: '#ccc', // Light gray border for input fields
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#333', // Dark background for input fields
    color: '#fff', // White text color for input fields
  },
  errorText: {
    color: 'red', // Red color for error messages
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginBottom: 0,
    marginTop:20,
    backgroundColor: '#FF6347', // Red background color for buttons (matching red theme)
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // White text color for buttons
    textAlign: 'center',
    fontSize: 16,
  },
});

export default stylesSign;