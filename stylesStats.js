import { StyleSheet } from 'react-native';

const stylesStats = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF', // White text for header
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFF', // White text for loading text
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1A1A1A', // Dark gray background for cards
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5, // Shadow for better visibility
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347', // Tomato red for card title
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#FFF', // White text for card content
    marginBottom: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default stylesStats;
