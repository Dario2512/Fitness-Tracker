import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingsItem: {
    backgroundColor: '#424242', 
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', 
    aspectRatio: 1, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff', 
  },
});

export default styles;