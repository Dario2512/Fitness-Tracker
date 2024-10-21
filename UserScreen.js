import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UserScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Profile Information</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default UserScreen;
