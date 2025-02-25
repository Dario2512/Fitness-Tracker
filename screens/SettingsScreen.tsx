import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/stylesSettings';

interface SettingOption {
  id: string;
  name: string;
  screen: string;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const settingsOptions: SettingOption[] = [
    { id: '1', name: 'User Profile', screen: 'User' },
    { id: '2', name: 'Emergency Contact', screen: 'EmergencyNumber' },
    { id: '3', name: 'Change Password', screen: 'PasswordChange' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        numColumns={2}
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

export default SettingsScreen;