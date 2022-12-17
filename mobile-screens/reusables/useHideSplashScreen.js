import SplashScreen from 'react-native-splash-screen';

export const useHideSplashScreen = () => {
  const hideSplashScreen = (time = 1500) => {
    setTimeout(() => {
      SplashScreen.hide();
    }, time);
  };
  return {hideSplashScreen};
};
