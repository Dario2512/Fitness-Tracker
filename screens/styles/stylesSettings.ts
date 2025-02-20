import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingsItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Full width when only one item
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    maxWidth: '48%', // Ensures 2 items per row
  },
  settingsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#444',
  },
});

export default styles;
