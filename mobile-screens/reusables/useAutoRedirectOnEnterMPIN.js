import {useEffect} from 'react';

export const useAutoRedirectOnEnterMPIN = (mpin, redirectFn = () => {}) => {
  useEffect(() => {
    if (mpin?.length === 4) {
      redirectFn();
    }
  }, [mpin]);
};
