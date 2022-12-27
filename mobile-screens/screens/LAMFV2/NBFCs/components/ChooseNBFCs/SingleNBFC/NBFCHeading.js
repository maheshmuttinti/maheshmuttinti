/* eslint-disable react-native/no-inline-styles */
import {useTheme} from 'theme';
import {Heading} from 'uin';
import React from 'react';
import {Text} from 'react-native';

export const NBFCHeading = ({nbfcName}) => {
  const theme = useTheme();
  return (
    <Heading
      style={{
        color: theme.colors.primaryOrange,
        fontWeight: theme.fontWeights.moreBold,
        ...theme.fontSizes.small,
        paddingTop: 8,
      }}>
      <Text
        style={{
          fontWeight: theme.fontWeights.semiBold,
          color: theme.colors.greyscale750,
        }}>
        Under
      </Text>{' '}
      {`${nbfcName}`}
    </Heading>
  );
};
