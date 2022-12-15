/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {getUser} from 'services';
import {useSelector, shallowEqual} from 'react-redux';
import {View} from 'react-native';
import {useTheme} from 'theme';
import {AnimatedEllipsis} from 'uin';
import {useClearAsyncStorageKeys} from '../../../reusables/useClearAsyncStorageKeys';
import * as Sentry from '@sentry/react-native';
import {useHideSplashScreen} from '../../../reusables/useHideSplashScreen';
import {useDispatch} from 'react-redux';
import {setTokens, setUser} from 'store';

const getMpinStatus = (user, isUserLoggedInWithMPIN) => {
  const mpinStatus = user?.profile?.meta?.mpin_set;

  switch (mpinStatus) {
    case 'skip':
      return 'skipped';
    case true:
      if (isUserLoggedInWithMPIN !== null) {
        if (isUserLoggedInWithMPIN === true) {
          return 'redirect_to_dashboard';
        } else {
          return 'set_pin_success';
        }
      } else {
        return 'set_pin_success';
      }
    default:
      if (isUserLoggedInWithMPIN !== null) {
        if (isUserLoggedInWithMPIN === true) {
          return 'redirect_to_dashboard';
        } else {
          return 'set_pin_pending';
        }
      } else {
        return 'set_pin_pending';
      }
  }
};

export default function ({navigation, route}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const accessToken = route?.params?.access_token;
  console.log('accessToken in screen Determiner: ', accessToken);
  const handleExpiredSession = useRef(() => {});
  const handleRedirections = useRef(() => {});
  const redirectToNoInternetScreen = useRef(() => {});

  const {clearStoreForLogout} = useClearAsyncStorageKeys();
  const {hideSplashScreen} = useHideSplashScreen();

  const {networkStatus} = useSelector(
    ({network}) => ({
      networkStatus: network.networkStatus,
    }),
    shallowEqual,
  );

  const {isSessionExpired} = useSelector(
    ({auth}) => ({
      isSessionExpired: auth.isSessionExpired,
    }),
    shallowEqual,
  );

  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );

  redirectToNoInternetScreen.current = () =>
    navigation.navigate('EmptyStates', {screen: 'NoInternet'});

  handleExpiredSession.current = async () => {
    if (isSessionExpired === true) {
      await clearStoreForLogout();
      navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
    }
  };

  const handleNoInternet = () => {
    if (networkStatus === 'offline') {
      redirectToNoInternetScreen.current();
    }
  };

  useEffect(() => {
    if (networkStatus === 'offline') {
      redirectToNoInternetScreen.current();
    }
  }, [networkStatus]);

  // Note: The names which starts with "@" are referred to AsyncStorage variables
  // Purpose: 1. To show the Signup after App Promo "@show_intro" is set to false
  // Purpose: 2. If there is no "@access_token" stored in AsyncStorage

  const handleNoAccessTokenInAsyncStorage = async () => {
    const loggedInStatus = JSON.parse(
      await AsyncStorage.getItem('@logged_into_app'),
    );
    if (loggedInStatus !== null) {
      if (loggedInStatus === true) {
        navigation.replace('Auth', {screen: 'SigninHome'});
      } else {
        navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
      }
    } else {
      navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
    }
  };

  const mpinRedirection = user => {
    const mpinStatus = getMpinStatus(user, isUserLoggedInWithMPIN);
    dispatch(setUser(user));

    const isMobileNumberExists = user?.attributes
      ?.map(item => item.type)
      ?.includes('mobile_number');

    if (!isMobileNumberExists) {
      navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
    } else if (
      mpinStatus === 'skipped' ||
      mpinStatus === 'redirect_to_dashboard'
    ) {
      navigation.replace('Protected');
    } else if (mpinStatus === 'set_pin_pending') {
      navigation.replace('PINSetup', {screen: 'SetPINHome'});
    } else if (mpinStatus === 'set_pin_success') {
      navigation.replace('PINSetup', {screen: 'EnterPINHome'});
    }
  };

  handleRedirections.current = async () => {
    try {
      const tokenFromStorage = await AsyncStorage.getItem('@access_token');

      const showIntro = JSON.parse(await AsyncStorage.getItem('@show_intro'));

      if (showIntro === null) {
        navigation.replace('AppPromo', {screen: 'AppPromo'});
      } else if (accessToken) {
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: accessToken,
          }),
        );
        dispatch(setTokens({access_token: accessToken}));
        await AsyncStorage.setItem('@logged_into_app', JSON.stringify(true));
        const user = await getUser();
        dispatch(setUser(user));

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        if (!isMobileNumberExists) {
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
        } else {
          mpinRedirection(user);
        }
      } else if (tokenFromStorage !== null) {
        const user = await getUser();

        const mpinStatus = getMpinStatus(user, isUserLoggedInWithMPIN);
        dispatch(setUser(user));

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        if (!isMobileNumberExists) {
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
        } else if (
          mpinStatus === 'skipped' ||
          mpinStatus === 'redirect_to_dashboard'
        ) {
          navigation.replace('Protected');
        } else if (mpinStatus === 'set_pin_pending') {
          navigation.replace('PINSetup', {screen: 'SetPINHome'});
        } else if (mpinStatus === 'set_pin_success') {
          navigation.replace('PINSetup', {screen: 'EnterPINHome'});
        }
      } else {
        await handleNoAccessTokenInAsyncStorage();
      }

      hideSplashScreen();
    } catch (error) {
      handleNoInternet();
      handleExpiredSession.current();
      hideSplashScreen();
      Sentry.captureException(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRedirections.current();
      handleExpiredSession.current();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <AnimatedEllipsis dotSize={12} dotColor={theme.colors.primaryBlue} />
    </View>
  );
}
