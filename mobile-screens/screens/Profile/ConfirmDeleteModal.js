/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Card, FilledButton, Heading} from 'uin';
import {useTheme} from 'theme';

const ConfirmDeleteModal = ({
  isVisible,
  heading,
  onDelete = () => {},
  onCancel = () => {},
}) => {
  const theme = useTheme();
  return (
    <Modal
      backdropOpacity={0.7}
      animationType="fade"
      transparent={true}
      onBackdropPress={() => onCancel()}
      isVisible={isVisible}>
      <Card>
        <View
          style={{alignItems: 'center', justifyContent: 'center', padding: 24}}>
          <View style={{}}>
            <Heading style={{color: theme.colors.text}}>{heading}</Heading>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1 / 2}}>
            <FilledButton
              onPress={() => {
                onCancel();
              }}
              bgColor={'#ffffff'}
              textColor={theme.colors.text}>
              Cancel
            </FilledButton>
          </View>
          <View style={{flex: 1 / 2, marginLeft: 16}}>
            <FilledButton
              onPress={() => {
                onDelete();
                onCancel();
              }}
              bgColor={'#ffffff'}
              textColor={theme.colors.error}>
              Delete
            </FilledButton>
          </View>
        </View>
      </Card>
    </Modal>
  );
};

export default ConfirmDeleteModal;
