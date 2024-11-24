import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Black background
  },
  logoutButton: {
    top: 20,
    alignSelf: 'flex-start',
    padding: 10,
  },
  logoutText: {
    color: '#FF4D4D', // Bright red
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF', // White text
    textAlign: 'center',
    marginVertical: 20,
  },
  lastMeasurement: {
    backgroundColor: '#1A1A1A', // Dark gray
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  measurementText: {
    fontSize: 18,
    color: '#FFF', // White text
    marginVertical: 5,
  },
  greenText: {
    color: '#32CD32', // Bright green
  },
  noDataText: {
    fontSize: 18,
    color: '#FF4D4D', // Bright red
    textAlign: 'center',
    marginVertical: 20,
  },
  measureButton: {
    backgroundColor: '#FF4D4D', // Bright red
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  measureButtonDisabled: {
    backgroundColor: '#D3D3D3', // Light gray for disabled
  },
  measureButtonText: {
    fontSize: 18,
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
buttonContainer: {
  position: 'absolute', // Position it at the bottom of the screen
  bottom: 20,            // Align it to the bottom
  left: 0,
  right: 0,             // Stretch it horizontally
  flexDirection: 'row',
  justifyContent: 'space-around',
  padding: 20,
  backgroundColor: '#1A1A1A', // Dark gray background
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
}
,
  navButton: {
    padding: 15,
    backgroundColor: '#FF4D4D', // Bright red
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  navButtonText: {
    fontSize: 16,
    color: '#FFF', // White text
    fontWeight: 'bold',
  },
});

export default styles;
