import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ff6347', 
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 10, 
    paddingHorizontal: 30,
    marginTop: 20, 
    borderRadius: 5,
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;