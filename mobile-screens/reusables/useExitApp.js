import {useEffect} from 'react';
import {BackHandler} from 'react-native';

export default function useExitApp() {
  const backAction = () => {
    BackHandler.exitApp();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });
}
