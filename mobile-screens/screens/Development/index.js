/* eslint-disable react-native/no-inline-styles */
import {Pressable, View, Text} from 'react-native';
import React from 'react';
import {useTheme} from 'theme';
import CombinedUpdateCASAndLienMarking from './CombinedUpdateCASAndLienMarking';
import FetchCASFromRTAsForm from './FetchCASFromRTAs/StepperForm';

// const screens = ['FetchCASFromRTAsForm'];

export default function ({navigation}) {
  const theme = useTheme();
  return (
    <>
      {/* {screens.map((screen, index) => (
        <Pressable
          onPress={() => {
            console.log('pressed');
            navigation.replace('Development', {screen: screen});
          }}
          key={`screen-${index}`}
          style={{backgroundColor: 'violet', padding: 16}}>
          <Text style={{...theme.fontSizes.heading5}}>{screen}</Text>
        </Pressable>
      ))} */}

      {/* <FetchCASFromRTAsForm /> */}

      <CombinedUpdateCASAndLienMarking />
    </>
  );
}
