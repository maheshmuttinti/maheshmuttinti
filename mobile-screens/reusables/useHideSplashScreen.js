import SplashScreen from 'react-native-splash-screen';

export const useHideSplashScreen = () => {
  const hideSplashScreen = () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  };
  return {hideSplashScreen};
};
