import {useCallback, useEffect} from 'react';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRemoveMobileVerificationKey = () => {
  const clearMobileNumberVerifiedKeyFromAsyncStore = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@is_mobile_number_verified');
    } catch (err) {
      console.log('err: ', err);
      Sentry.captureException(err);
      return err;
    }
  }, []);

  useEffect(() => {
    clearMobileNumberVerifiedKeyFromAsyncStore();
  }, [clearMobileNumberVerifiedKeyFromAsyncStore]);
};
