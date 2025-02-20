import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import styles from './styles/stylesSettings';

interface SettingOption {
  id: string;
  name: string;
  screen: string;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const settingsOptions: SettingOption[] = [
    { id: '1', name: 'User Profile', screen: 'User' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <Text style={styles.settingsText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingsItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
  },
  settingsText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
