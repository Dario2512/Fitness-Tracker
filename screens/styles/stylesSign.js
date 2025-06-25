import { StyleSheet } from 'react-native';

const stylesSign = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#121212', 
  },
  logo: {
    width: 120, 
    height: 120, 
    alignSelf: 'center', 
    marginBottom: 10, 
  },
  appName: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#fff', 
    marginBottom: 40,
  },
  header: {
    fontSize: 20,
    marginBottom: 40,
    textAlign: 'center',
    color: '#fff', 
  },
  input: {
    borderColor: '#ccc', 
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#333', 
    color: '#fff', 
  },
  errorText: {
    color: 'red', 
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginBottom: 0,
    marginTop:20,
    backgroundColor: '#FF6347', 
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', 
    textAlign: 'center',
    fontSize: 16,
  },
});

export default stylesSign;