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
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';
import {getMPINStatus} from './mpinFunctions';

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
  const {handleRedirection: handleCheckPANLinkingAndRedirect} =
    useOnboardingHandleRedirection();

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

  const redirectBasedOnMobileNumberVerification = async () => {
    const isMobileNumberVerifiedOnUserSessionExpire = JSON.parse(
      await AsyncStorage.getItem('@is_mobile_number_verified'),
    );
    console.log(
      'isMobileNumberVerifiedOnUserSessionExpire: ',
      isMobileNumberVerifiedOnUserSessionExpire,
    );
    if (isMobileNumberVerifiedOnUserSessionExpire !== null) {
      if (isMobileNumberVerifiedOnUserSessionExpire === true) {
        navigation.replace('Auth', {screen: 'SigninHome'});
      } else {
        navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
      }
    } else {
      navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
    }
  };

  handleExpiredSession.current = async () => {
    if (isSessionExpired === true) {
      await clearStoreForLogout();
      await redirectBasedOnMobileNumberVerification();
    }
  };

  useEffect(() => {
    if (networkStatus === 'offline') {
      redirectToNoInternetScreen.current();
    }
  }, [networkStatus]);

  const handleRedirectionUntilDashboard = async user => {
    const mpinStatus = getMPINStatus(user, isUserLoggedInWithMPIN);
    console.log('handleRedirectionUntilDashboard->mpinStatus: ', mpinStatus);

    const isUserRegisteredWithMobileNumber = user?.attributes
      ?.map(item => item.type)
      ?.includes('mobile_number');

    console.log(
      'isUserRegisteredWithMobileNumber: ',
      isUserRegisteredWithMobileNumber,
    );
    if (!isUserRegisteredWithMobileNumber) {
      navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
    } else if (
      mpinStatus === 'skipped' ||
      mpinStatus === 'redirect_to_dashboard'
    ) {
      if (mpinStatus === 'skipped') {
        await handleCheckPANLinkingAndRedirect();
      } else {
        // Todo: uncomment below code once testing is done
        // navigation.replace('Protected');
        navigation.replace('FetchCAS', {screen: 'FetchCASFromRTAs'});
      }
    } else if (mpinStatus === 'set_pin_pending') {
      navigation.replace('PINSetup', {screen: 'SetPINHome'});
    } else if (mpinStatus === 'set_pin_success') {
      navigation.replace('PINSetup', {screen: 'EnterPINHome'});
    }
  };

  handleRedirections.current = async () => {
    try {
      console.log(
        'redirection started in screen determiner----------------------'.toUpperCase(),
      );
      const tokenFromStorage = await AsyncStorage.getItem('@access_token');

      const showAppPromo = JSON.parse(
        await AsyncStorage.getItem('@show_app_promo'),
      );

      if (showAppPromo === null) {
        navigation.replace('AppPromo', {screen: 'AppPromo'});
        hideSplashScreen(100);
      } else if (accessToken) {
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: accessToken,
          }),
        );
        dispatch(setTokens({access_token: accessToken}));
        const user = await getUser();
        dispatch(setUser(user));
        await handleRedirectionUntilDashboard(user);
        hideSplashScreen();
      } else if (tokenFromStorage !== null) {
        const user = await getUser();
        dispatch(setUser(user));
        await handleRedirectionUntilDashboard(user);
        hideSplashScreen();
      } else {
        await redirectBasedOnMobileNumberVerification();
        hideSplashScreen();
      }

      console.log(
        'redirection done in screen determiner----------------------'.toUpperCase(),
      );
    } catch (error) {
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
