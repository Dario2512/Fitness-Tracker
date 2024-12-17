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
    color: '#FFF',
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
    color: '#FFF',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
  caloriesBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  caloriesHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 10,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  caloriesNote: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default stylesStats;
