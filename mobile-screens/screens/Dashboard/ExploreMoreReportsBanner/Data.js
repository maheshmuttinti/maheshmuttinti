/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {DashboardPageEnder} from 'assets';

export default function ({ref, ...props}) {
  return (
    <View
      {...props}
      ref={ref}
      style={{
        alignItems: 'center',
      }}>
      <DashboardPageEnder />
    </View>
  );
}
