import { StyleSheet } from 'react-native';

const stylesUser = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    padding: 20,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF', 
    textAlign: 'center',
    marginBottom: 50, 
  },
  userInfo: {
    marginBottom: 30,
    alignItems: 'center', 
  },
  userInfoText: {
    fontSize: 18,
    color: '#FFF', 
    marginBottom: 10,
    textAlign: 'center', 
  },
  input: {
    backgroundColor: '#2C2C2C', 
    borderWidth: 1,
    borderColor: '#FF6347', 
    borderRadius: 5,
    padding: 10,
    width: '80%', 
    marginBottom: 15,
    color: '#FFF', 
    fontSize: 16,
    textAlign: 'center', 
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
    backgroundColor: '#1A1A1A', 
  },
  button: {
    backgroundColor: '#FF6347', 
    padding: 12,
    width: '80%', 
    textAlign: 'center',
    marginTop: 15,
    borderRadius: 5,
    fontSize: 18,
    alignItems: 'center', 
  },
  buttonCancel: {
    backgroundColor: '#555', 
    padding: 12,
    width: '80%', 
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 5,
    fontSize: 18,
    alignItems: 'center', 
  },
  editButton: {
    backgroundColor: '#FF6347', 
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center', 
  },
  editButtonText: {
    color: '#FFF', 
    fontSize: 16,
    textAlign: 'center',
  },
});

export default stylesUser;