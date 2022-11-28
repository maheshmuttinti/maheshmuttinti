/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {Card, Heading} from 'uin';
import {useTheme} from 'theme';
import {InfoIcon} from 'assets';

export const WarningCard = () => {
  const theme = useTheme();

  return (
    <Card
      style={{
        backgroundColor: theme.colors.backgroundYellow,
        paddingHorizontal: 17,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
      }}>
      <View>
        <InfoIcon fill={theme.colors.error} />
      </View>
      <Heading
        style={{
          ...theme.fontSizes.small,
          fontFamily: theme.fonts.regular,
          color: theme.colors.text,
          paddingLeft: 17.25,
          marginRight: 17,
        }}>
        Please complete your loan application in{' '}
        <Text style={{color: theme.colors.error}}>10 days</Text>. Processing fee
        is to be paid if you fail to do so.
      </Heading>
    </Card>
  );
};
