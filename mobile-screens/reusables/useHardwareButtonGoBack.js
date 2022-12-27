import * as React from 'react';
import {BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function useHardwareButtonGoBack(
  preventGoBack = false,
  backActionCallback,
) {
  const navigation = useNavigation();

  const backAction = () => {
    if (preventGoBack === true) {
      return true;
    } else {
      // Todo: Not Working check it again
      console.log('typeof backActionCallback: ', typeof backActionCallback);
      if (typeof backActionCallback === 'function') {
        backActionCallback();
      } else {
        navigation.canGoBack() && navigation.pop();
      }
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
