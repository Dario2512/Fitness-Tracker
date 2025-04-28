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
  noDataText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    color: '#FFF',
    fontSize: 14,
  },
  historyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'start',
    marginVertical: 10,
    marginLeft: 20,
  },
});