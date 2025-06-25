import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  map: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 15, 
    backgroundColor: 'gray', 
    color: 'white', 
  },
  suggestionsList: {
    maxHeight: 200,
    backgroundColor: 'gray', 
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: 'white', 
    borderBottomWidth: 1,
    color: 'white', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
  fabIcon: {
    color: 'red', 
  },
  fabBackdrop: {
    backgroundColor: 'transparent', 
  },
});