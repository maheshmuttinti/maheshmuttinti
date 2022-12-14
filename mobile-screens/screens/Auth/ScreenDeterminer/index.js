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
import {prettifyJSON} from 'utils';
import {useDispatch} from 'react-redux';
import {setTokens, setUser} from 'store';

const getMpinStatus = (user, isUserLoggedInWithMPIN) => {
  const mpinStatus = user?.profile?.meta?.mpin_set;
  console.log('getMpinStatus->mpinStatus: ', mpinStatus);

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
  console.log('isUserLoggedInWithMPIN: ', isUserLoggedInWithMPIN);
  console.log('isSessionExpired: ', isSessionExpired);

  redirectToNoInternetScreen.current = () =>
    navigation.navigate('EmptyStates', {screen: 'NoInternet'});

  handleExpiredSession.current = async () => {
    console.log(
      'screenDeterminer=>isSessionExpired outside: ',
      isSessionExpired,
    );
    if (isSessionExpired === true) {
      console.log(
        'screenDeterminer=>isSessionExpired inside if: ',
        isSessionExpired,
      );
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

  // const redirectionDeciderByMPINStatus = (user, mpinStatus) => {
  //   const isMobileNumberExists = user?.attributes
  //     ?.map(item => item.type)
  //     ?.includes('mobile_number');

  //   console.log('isMobileNumberExists: ', isMobileNumberExists);
  //   if (!isMobileNumberExists) {
  //     navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
  //   } else if (
  //     mpinStatus === 'skipped' ||
  //     mpinStatus === 'redirect_to_dashboard'
  //   ) {
  //     navigation.replace('Protected');
  //   } else if (mpinStatus === 'set_pin_pending') {
  //     navigation.replace('PINSetup', {screen: 'SetPINHome'});
  //   } else if (mpinStatus === 'set_pin_success') {
  //     navigation.replace('PINSetup', {screen: 'EnterPINHome'});
  //   }
  // };

  // const handleRedirectAfterUserLoggedIn = async user => {
  //   const mpinStatus = getMpinStatus(user);
  //   console.log('handleRedirectAfterUserLoggedIn->mpinStatus: ', mpinStatus);

  //   console.log('user in screen determiner ----------', prettifyJSON(user));

  //   redirectionDeciderByMPINStatus(user, mpinStatus);
  // };

  // Note: The names which starts with "@" are referred to AsyncStorage variables
  // Purpose: 1. To show the Signup after App Promo "@show_intro" is set to false
  // Purpose: 2. If there is no "@access_token" stored in AsyncStorage

  const handleNoAccessTokenInAsyncStorage = async () => {
    console.log('handleNoAccessTokenInAsyncStorage is called?: ');
    const loggedInStatus = JSON.parse(
      await AsyncStorage.getItem('@logged_into_app'),
    );
    if (loggedInStatus !== null) {
      console.log('loggedInStatus inside: ', loggedInStatus);
      if (loggedInStatus === true) {
        navigation.replace('Auth', {screen: 'SigninHome'});
      } else {
        navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
      }
    } else {
      console.log('loggedInStatus outside: ', loggedInStatus);
      navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
    }
  };

  const mpinRedirection = user => {
    const mpinStatus = getMpinStatus(user, isUserLoggedInWithMPIN);
    console.log('getUser callledddddd------: ', getUser);
    dispatch(setUser(user));

    const isMobileNumberExists = user?.attributes
      ?.map(item => item.type)
      ?.includes('mobile_number');

    console.log('isMobileNumberExists: ', isMobileNumberExists);
    if (!isMobileNumberExists) {
      console.log(
        '!isMobileNumberExists redirecting to EnterPhoneNumber: ',
        !isMobileNumberExists,
      );
      navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
      console.log(
        '!isMobileNumberExists redirected to EnterPhoneNumber: ',
        !isMobileNumberExists,
      );
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
      console.log('-------hiding splash screen...-------');
      const tokenFromStorage = await AsyncStorage.getItem('@access_token');
      console.log('ScreenDeterminer->tokenFromStorage: ', tokenFromStorage);

      const showIntro = JSON.parse(await AsyncStorage.getItem('@show_intro'));

      if (showIntro === null) {
        navigation.replace('AppPromo', {screen: 'AppPromo'});
      } else if (accessToken) {
        console.log('social login accessToken:------> ', accessToken);
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: accessToken,
          }),
        );
        dispatch(setTokens({access_token: accessToken}));
        await AsyncStorage.setItem('@logged_into_app', JSON.stringify(true));
        const user = await getUser();
        console.log('getUser callledddddd------: ', user);
        dispatch(setUser(user));

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        console.log('isMobileNumberExists: ', isMobileNumberExists);
        if (!isMobileNumberExists) {
          console.log(
            '!isMobileNumberExists redirecting to EnterPhoneNumber: ',
            !isMobileNumberExists,
          );
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
          console.log(
            '!isMobileNumberExists redirected to EnterPhoneNumber: ',
            !isMobileNumberExists,
          );
        } else {
          mpinRedirection(user);
        }
      } else if (tokenFromStorage !== null) {
        const user = await getUser();
        console.log(
          '****************user in screen determiner screen*******: ',
          prettifyJSON(user),
        );

        const mpinStatus = getMpinStatus(user, isUserLoggedInWithMPIN);
        console.log('getUser callledddddd------: ', getUser);
        dispatch(setUser(user));

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        console.log('isMobileNumberExists: ', isMobileNumberExists);
        if (!isMobileNumberExists) {
          console.log(
            '!isMobileNumberExists redirecting to EnterPhoneNumber: ',
            !isMobileNumberExists,
          );
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
          console.log(
            '!isMobileNumberExists redirected to EnterPhoneNumber: ',
            !isMobileNumberExists,
          );
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
      console.log('-------splash screen hide successfully-------');
    } catch (error) {
      handleNoInternet();
      handleExpiredSession.current();
      hideSplashScreen();
      console.log('-------splash screen hide successfully-------');
      Sentry.captureException(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('-------screen determiner called---------');
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
