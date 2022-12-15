/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {PentagonDangerIcon} from 'assets';
import {useTheme} from 'theme';

export const InputErrorMessage = ({errorMessage}) => {
  const theme = useTheme();
  return (
    <View style={{paddingTop: 12}}>
      {errorMessage && (
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View>
            <PentagonDangerIcon fill={theme.colors.error} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '90%',
            }}>
            <Text
              style={{
                ...theme.fontSizes.medium,
                fontWeight: theme.fontWeights.moreBold,
                color: theme.colors.error,
                fontFamily: theme.fonts.regular,
                paddingLeft: 16,
              }}>
              {errorMessage}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
