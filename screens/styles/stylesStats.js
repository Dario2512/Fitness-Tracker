import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  cardText: {
    color: 'white',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
});