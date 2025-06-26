import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  todayBox: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', 
  },
  card: {
    backgroundColor: '#1A1A1A',
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
    color: '#ffffff', 
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#fff', 
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', 
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
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
    color: '#fff',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15, 
    backgroundColor: '#555', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%', 
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  buttonStyle: {
    borderRadius: 20,
    height: 45,
    backgroundColor: '#FF6347',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  foodEntry: {
    marginBottom: 10,
  },
});

export default styles;