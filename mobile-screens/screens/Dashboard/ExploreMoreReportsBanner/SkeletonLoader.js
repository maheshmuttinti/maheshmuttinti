/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {CustomizedSkeleton} from 'uin';

export default function () {
  return (
    <View>
      {['25%', '50%', '90%'].map((width, index) => (
        <CustomizedSkeleton
          key={index}
          containerStyle={{
            backgroundColor: 'transparent',
            width: '100%',
            paddingHorizontal: 17,
            paddingTop: 0,
            paddingBottom: 0,
          }}
          lineStyle={{
            width: width,
            backgroundColor: '#ffffff',
            height: 32,
          }}
          boneColor={'#fdfdfd'}
        />
      ))}
    </View>
  );
}
