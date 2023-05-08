import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

export default function LoaderComponent() {
  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.loadingIndicator} size="small" />
      <Text style={styles.loadingText}>{'Loading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    color: '#000000',
  },
  loadingText: {
    fontFamily: 'Ubuntu-Medium',
    marginVertical: 10,
  },
});
