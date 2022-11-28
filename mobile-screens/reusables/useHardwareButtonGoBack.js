import * as React from 'react';
import {BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function useHardwareButtonGoBack(preventGoBack = false) {
  const navigation = useNavigation();

  const backAction = () => {
    if (preventGoBack === true) {
      return;
    } else {
      navigation.canGoBack() && navigation.pop();
    }
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });
}
