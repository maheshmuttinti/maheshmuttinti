/* eslint-disable react-native/no-inline-styles */
import {TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useTheme} from 'theme';

const screens = [
  'LoanAmountSelection',
  'ChooseNBFCSingle',
  'ChooseNBFCHorizontal',
  'ChooseNBFCVertical',
  'CompareNBFCs',
];

export default function ({navigation}) {
  const theme = useTheme();
  return (
    <>
      {screens.map((screen, index) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Development', {screen: screen});
          }}
          key={`screen-${index}`}
          style={{
            backgroundColor: 'violet',
            padding: 16,
            borderBottomWidth: 2,
          }}>
          <Text style={{...theme.fontSizes.heading5}}>{screen}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}
