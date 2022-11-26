/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {CustomizedSkeleton} from 'uin';

export default function () {
  return (
    <CustomizedSkeleton
      lineStyle={{
        width: '80%',
        backgroundColor: '#fefefe',
        height: 32,
        marginTop: 0,
      }}
      containerStyle={{
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      boneColor={'#fdfdfd'}
    />
  );
}
