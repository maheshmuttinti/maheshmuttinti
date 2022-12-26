/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Slider from '@react-native-community/slider';
import {Platform, View} from 'react-native';
import {useTheme} from 'theme';
import {SubText} from 'uin';

export const SliderWithLabels = ({
  loanAmount,
  minLoanAmount,
  maxLoanAmount,
  onSliderChange = () => {},
}) => {
  const theme = useTheme();
  return (
    <>
      <Slider
        style={{
          paddingTop: 19,
          transform:
            Platform.OS === 'android' ? [{scaleX: 1.1}, {scaleY: 1.2}] : [],
        }}
        minimumValue={minLoanAmount}
        maximumValue={maxLoanAmount}
        minimumTrackTintColor={theme.colors.primaryYellow}
        maximumTrackTintColor={theme.colors.primary}
        onSlidingComplete={sliderValue => {
          onSliderChange(sliderValue);
        }}
        thumbTintColor={theme.colors.primaryBlue}
        value={loanAmount}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          top: -7,
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
