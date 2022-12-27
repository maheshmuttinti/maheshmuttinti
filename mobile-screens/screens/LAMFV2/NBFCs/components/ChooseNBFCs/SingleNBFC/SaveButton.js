/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'theme';
import {BaseButton} from 'uin';

export const SaveButton = ({onSave = () => {}}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 24,
        position: 'absolute',
        width: '100%',
        bottom: 24,
      }}>
      <BaseButton
        onPress={() => {
          onSave();
        }}
        gradientColors={[
          theme.colors.primaryOrange800,
          theme.colors.primaryOrange,
        ]}>
        Save
      </BaseButton>
    </View>
  );
};
