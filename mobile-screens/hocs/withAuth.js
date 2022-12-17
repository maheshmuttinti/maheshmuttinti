import React, {useEffect} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {useClearAsyncStorageKeys} from '../reusables/useClearAsyncStorageKeys';

const withAuth = WrappedComponent => {
  return props => {
    const {clearStoreForLogout} = useClearAsyncStorageKeys();

    const {isSessionExpired} = useSelector(
      ({auth}) => ({
        isSessionExpired: auth.isSessionExpired,
      }),
      shallowEqual,
    );

    useEffect(() => {
      (async () => {
        if (isSessionExpired === true) {
          await clearStoreForLogout();
        }
      })();
    }, [isSessionExpired]);

    if (isSessionExpired === true) {
      // If the user is not authenticated, navigate to the login screen
      props.navigation.replace('Auth', {screen: 'SigninHome'});
      return null;
    }

    // If the user is authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
