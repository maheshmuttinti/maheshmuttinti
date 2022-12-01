/* eslint-disable react-native/no-inline-styles */
import {Pressable, Text} from 'react-native';
import React from 'react';
import {useTheme} from 'theme';

const screens = [
  'FetchCASFromRTAsForm',
  'CombinedUpdateCASAndLienMarking',
  'UpdatePortfolio',
];

export default function ({navigation}) {
  const theme = useTheme();
  return (
    <>
      {screens.map((screen, index) => (
        <Pressable
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
        </Pressable>
      ))}
    </>
  );
}
