import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorHolder: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});


const LoadingModal = (props) => {
  const {
    isLoading,
  } = props;

  return (
    <Modal
      transparent
      animationType={'none'}
      visible={isLoading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorHolder}>
          <ActivityIndicator
            animating={isLoading}
            size="large"
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;