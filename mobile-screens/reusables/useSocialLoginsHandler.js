import {openBrowser} from 'utils';
import {appleLogin, googleLogin} from 'services';
import {useCallback} from 'react';

export const useSocialLoginsHandler = () => {
  const handleGoogleLogin = useCallback(async () => {
    try {
      const data = await googleLogin();
      const url = data?.redirect_to;
      console.log('Google Authentication URL: ', url);
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  }, []);

  const handleAppleLogin = useCallback(async () => {
    try {
      const data = await appleLogin();
      const url = data?.redirect_to;
      console.log('Apple Authentication URL: ', url);
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  }, []);
  return {handleGoogleLogin, handleAppleLogin};
};
