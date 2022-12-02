/* eslint-disable react-native/no-inline-styles */
import {Pressable} from 'react-native';
import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {BackArrow} from 'assets';

export default function (fill) {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
          onPress={() => {
            navigation.canGoBack() && navigation.pop();
          }}
          style={{width: 50, marginLeft: 16}}>
          <BackArrow fill={fill} />
        </Pressable>
      ),
    });
  }, [navigation, fill]);
  return null;
}
