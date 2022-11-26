/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {useTheme} from 'theme';
import Modal from 'react-native-modal';
const Loader = ({
  loading = true,
  text = '',
  loaderComponent,
  backdropOpacity = 0.7,
}) => {
  const theme = useTheme();
  return (
    <Modal
      backdropOpacity={backdropOpacity}
      animationType="fade"
      transparent={true}
      isVisible={loading}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {loaderComponent ? (
            loaderComponent
          ) : (
            <ActivityIndicator size="large" color="#FF5500" />
          )}
          {text.length > 0 && (
            <Text
              style={{
                ...theme.fontSizes.xlarge,
                textAlign: 'center',
                marginTop: 30,
                fontWeight: theme.fontWeights.moreBold,
                color: '#fff',
              }}>
              {text}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    padding: 35,
    alignItems: 'center',
  },
});
