/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import Slider from '@react-native-community/slider';
import {View} from 'react-native';
import {useTheme} from 'theme';
import {SubText} from 'uin';

export const ProgressBar = ({
  percentageValue = 20,
  minLoanAmount = 100,
  maxLoanAmount = 100000,
}) => {
  const theme = useTheme();
  return (
    <>
      <View
        style={{
          height: 5,
          backgroundColor: theme.colors.primaryYellow,
          width: `${percentageValue}%`,
          borderRadius: 12,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 5,
        }}>
        <SubText
          style={{
            ...theme.fontSizes.xsmall,
            fontWeight: theme.fontWeights.veryBold,
          }}>{`₹${minLoanAmount}`}</SubText>
        <SubText
          style={{
            ...theme.fontSizes.xsmall,
            fontWeight: theme.fontWeights.veryBold,
          }}>{`₹${maxLoanAmount}`}</SubText>
      </View>
    </>
  );
};
