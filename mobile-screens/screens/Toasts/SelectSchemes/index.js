/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {InfoIcon, WarningIcon1} from 'assets';
import {View, Text} from 'react-native';
import {useTheme} from 'theme';
import {Card} from 'uin';

const SchemeWarningComponent = () => {
  const theme = useTheme();
  return (
    <Card
      style={{
        backgroundColor: theme.colors.backgroundYellow,
        paddingLeft: 17.25,
        marginHorizontal: 17,
        marginTop: 30,
        marginBottom: 100,
        borderRadius: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <InfoIcon fill={theme.colors.error} />
      </View>
      <Text
        style={{
          ...theme.fontSizes.small,
          fontWeight: theme.fontWeights.moreBold,
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
          paddingLeft: 17.25,
          marginRight: 52,
        }}>
        You have selected enough schemes to reach the desired loan amount
      </Text>
    </Card>
  );
};

const SelectSchemeWarningComponent = () => {
  const theme = useTheme();

  return (
    <Card
      style={{
        backgroundColor: theme.colors.backgroundYellow,
        paddingLeft: 17.25,
        marginHorizontal: 17,
        marginTop: 30,
        marginBottom: 100,
        borderRadius: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <WarningIcon1 />
      </View>
      <Text
        style={{
          ...theme.fontSizes.small,
          fontWeight: theme.fontWeights.moreBold,
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
          paddingLeft: 17.25,
          marginRight: 52,
        }}>
        You cannot add more than 3 NBFC to compare
      </Text>
    </Card>
  );
};

export {SchemeWarningComponent, SelectSchemeWarningComponent};
