/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {useTheme} from 'theme';

export const VerifyOTPLoader = ({loading}) => {
  const theme = useTheme();
  return (
    <>
      {loading === true && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 12,
          }}>
          <ActivityIndicator
            size="small"
            color={theme.colors.primaryBlue || '#003AC9'}
          />
          <Text
            style={{
              paddingLeft: 24,
              color: theme.colors.text,
              fontFamily: theme.fonts.regular,
              ...theme.fontSizes.small,
            }}>
            Please Wait, Verifying the OTP...
          </Text>
        </View>
      )}
    </>
  );
};
