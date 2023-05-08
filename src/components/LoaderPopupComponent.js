import React from 'react';
import {View, Text, Modal, ActivityIndicator, StyleSheet} from 'react-native';

export default function LoaderPopupComponent(props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onRequestClose}>
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color={'#000'}
          />
          <Text style={styles.loaderText}>
            {props.text !== null ? props.text : 'Loading'}
            {' ...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subcontainer: {
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  loadingIndicator: {
    color: '#000000',
  },
  loaderText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Ubuntu-Medium',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
});
