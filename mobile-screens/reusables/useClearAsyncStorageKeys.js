import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {clearAuth, setShowIntro, setIsUserLoggedInWithMPIN} from 'store';

export const useClearAsyncStorageKeys = () => {
  const dispatch = useDispatch();

  const clearStoreForLogout = async () => {
    try {
      dispatch(setShowIntro(false));
      await AsyncStorage.setItem('@show_intro', JSON.stringify(false));
      await AsyncStorage.setItem('@logged_into_app', JSON.stringify(true));
      dispatch(setIsUserLoggedInWithMPIN(false));
      dispatch(clearAuth());
      await AsyncStorage.removeItem('@access_token');
    } catch (error) {
      console.log(
        'error while redirection after set pin later button clicked',
        error,
      );
      return error;
    }
  };
  const clearStoreForDeleteAccount = async () => {
    try {
      dispatch(setShowIntro(false));
      await AsyncStorage.setItem('@show_intro', JSON.stringify(false));
      await AsyncStorage.setItem('@logged_into_app', JSON.stringify(false));
      dispatch(setIsUserLoggedInWithMPIN(false));
      dispatch(clearAuth());
      await AsyncStorage.removeItem('@access_token');
      await AsyncStorage.removeItem('@is_mobile_number_verified');
    } catch (error) {
      console.log(
        'error while redirection after set pin later button clicked',
        error,
      );
      return error;
    }
  };

  return {clearStoreForLogout, clearStoreForDeleteAccount};
};
