import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {
  clearAuth,
  setShowIntro,
  setIsUserLoggedInWithMPIN,
  setSessionExpired,
} from 'store';

export const useClearAsyncStorageKeys = () => {
  const dispatch = useDispatch();

  const clearStoreForLogout = async () => {
    try {
      console.log(
        'clearing the store for logout----------------------------'.toUpperCase(),
      );
      dispatch(setShowIntro(false));
      await AsyncStorage.setItem('@show_app_promo', JSON.stringify(false));
      dispatch(setIsUserLoggedInWithMPIN(false));
      dispatch(clearAuth());
      await AsyncStorage.removeItem('@access_token');
      console.log(
        'cleared the store for logout----------------------------'.toUpperCase(),
      );
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
      console.log(
        'clearing the store for delete account----------------------------'.toUpperCase(),
      );
      dispatch(setSessionExpired(false));
      dispatch(setShowIntro(false));
      await AsyncStorage.setItem('@show_app_promo', JSON.stringify(false));
      dispatch(setIsUserLoggedInWithMPIN(false));
      dispatch(clearAuth());
      await AsyncStorage.removeItem('@access_token');
      await AsyncStorage.removeItem('@is_mobile_number_verified');
      console.log(
        'cleared the store for delete account----------------------------'.toUpperCase(),
      );
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
