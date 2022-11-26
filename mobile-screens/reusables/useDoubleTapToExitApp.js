import {Platform, BackHandler, ToastAndroid} from 'react-native';
let currentCount = 0;
export const useDoubleBackPressExit = (exitHandler = () => {}) => {
  if (Platform.OS === 'ios') return;
  const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    if (currentCount === 1) {
      exitHandler();
      subscription.remove();
      return true;
    }
    backPressHandler();
    return true;
  });
};

const backPressHandler = () => {
  if (currentCount < 1) {
    currentCount += 1;

    ToastAndroid.show('Press back again to exit FinEzzy', ToastAndroid.SHORT);
  }
  setTimeout(() => {
    currentCount = 0;
  }, 2000);
};
