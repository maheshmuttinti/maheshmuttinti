/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {getUser, getCASEmails} from 'services';
import {useSelector, shallowEqual} from 'react-redux';
import {View} from 'react-native';
import {useTheme} from 'theme';
import SplashScreen from 'react-native-splash-screen';
import {AnimatedEllipsis} from 'uin';
import {useClearAsyncStorageKeys} from '../../../reusables/useClearAsyncStorageKeys';
import * as Sentry from '@sentry/react-native';

export default function ({navigation, route}) {
  const theme = useTheme();

  const handleExpiredSession = useRef(() => {});
  const handleRedirections = useRef(() => {});
  const redirectToNoInternetScreen = useRef(() => {});
  const verificationStatus = route?.params?.verificationStatus;
  console.log('verificationStatus in screenDeterminer: ', verificationStatus);

  const {clearStoreForLogout} = useClearAsyncStorageKeys();

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
    if (isSessionExpired === true) {
      await clearStoreForLogout();
      navigation.replace('Auth', {screen: 'SigninHome'});
    }
  };

  const handleNoInternet = () => {
    if (networkStatus === 'offline') {
      redirectToNoInternetScreen.current();
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRedirections.current();
      handleExpiredSession.current();
    }, []),
  );

  useEffect(() => {
    if (networkStatus === 'offline') {
      redirectToNoInternetScreen.current();
    }
  }, [networkStatus]);

  const getNonSocialEmailsVerificationStatus = async () => {
    try {
      const CASEmailsResponse = await getCASEmails();

      const isCASEmailsArePresent =
        CASEmailsResponse && CASEmailsResponse?.length > 0;

      const isCASEmailIsNonGmail =
        isCASEmailsArePresent &&
        CASEmailsResponse?.find(
          item => item['cas_emails*email_type'] === 'non_gmail',
        );

      const isCASEmailVerificationSuccess =
        CASEmailsResponse?.find(
          item => item['cas_emails*verification_status'],
        ) &&
        CASEmailsResponse?.find(
          item => item['cas_emails*verification_status'] === 'success',
        );

      const isNonGmailCASEmailVerified =
        isCASEmailIsNonGmail && isCASEmailVerificationSuccess;

      const isCASEmailVerificationPending =
        CASEmailsResponse[0]?.['cas_emails*verification_status'] &&
        CASEmailsResponse[0]?.['cas_emails*verification_status'] === 'pending';

      console.log(
        'isCASEmailVerificationPending',
        isCASEmailVerificationPending,
      );

      console.log('verificationStatus: ', verificationStatus);
      const isCASEmailVerificationIsSuccess =
        verificationStatus === 'success' || isNonGmailCASEmailVerified;
      console.log(
        'isCASEmailVerificationIsSuccess: ',
        isCASEmailVerificationIsSuccess,
      );
      console.log('casEmail', CASEmailsResponse[0]['cas_emails*email']);

      return isCASEmailVerificationIsSuccess
        ? {status: 'success', email: CASEmailsResponse[0]['cas_emails*email']}
        : {status: 'pending', email: CASEmailsResponse[0]['cas_emails*email']};
    } catch (error) {
      Sentry.captureException(error);
      return false;
    }
  };

  const getMpinStatus = user => {
    const mpinStatus = user?.profile?.meta?.mpin_set;
    console.log('getMpinStatus->mpinStatus: ', mpinStatus);

    switch (mpinStatus) {
      case 'skip':
        return 'skipped';
      case true:
        return 'set_pin_success';
      default:
        return 'set_pin_pending';
    }
  };

  const getEmailType = user => {
    const emailType = user?.profile?.meta?.username_type;
    console.log('getEmailType->emailType: ', emailType);

    switch (emailType) {
      case 'gmail':
        return 'gmail';
      case 'apple_id':
        return 'apple_id';
      case 'non_gmail':
        return 'non_gmail';
      case 'mobile_number':
        return 'mobile_number';
      default:
        return 'non_gmail';
    }
  };

  const redirectionDeciderByMPINStatus = mpinStatus => {
    if (mpinStatus === 'skipped') {
      navigation.replace('Protected');
    }
    if (mpinStatus === 'set_pin_pending') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });
      navigation.replace('PINSetup', {screen: 'SetPINHome'});
    }
    if (mpinStatus === 'set_pin_success') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });
      navigation.replace('PINSetup', {screen: 'EnterPINHome'});
    }
  };
  const handleRedirectionBasedOnEmail = async user => {
    const mpinStatus = getMpinStatus(user);
    console.log('handleRedirectionBasedOnEmail->mpinStatus: ', mpinStatus);
    const emailType = getEmailType(user);
    console.log('handleRedirectionBasedOnEmail->emailType: ', emailType);

    if (emailType === 'gmail' || emailType === 'apple_id') {
      console.log('emailType social emails: ', emailType);
      redirectionDeciderByMPINStatus(mpinStatus);
    }
    if (emailType === 'non_gmail' || emailType === 'mobile_number') {
      console.log('emailType non social emails: ', emailType);
      // Todo: get the email from cas email or from meta
      // Todo: verify or not verified
      const response = await getNonSocialEmailsVerificationStatus();
      console.log('response--->: ', response);

      const {status, email} = response;
      console.log('email----->: ', email);
      console.log('status------>: ', status);
      if (status === 'success') {
        redirectionDeciderByMPINStatus(mpinStatus);
      } else {
        navigation.replace('VerifyEmail', {
          screen: 'EmailActivationLinkScreen',
          params: {
            email: email,
            type: 'auth_flow',
            mpin_set: user?.profile?.meta?.mpin_set,
            verificationStatus: verificationStatus,
          },
        });
      }
    }
  };

  const handleLogoutRedirection = async () => {
    const loggedInStatus = JSON.parse(
      await AsyncStorage.getItem('@loggedin_status'),
    );
    if (loggedInStatus !== null) {
      console.log('loggedInStatus inside: ', loggedInStatus);
      if (loggedInStatus === true) {
        navigation.replace('Auth', {screen: 'SigninHome'});
      } else {
        navigation.replace('Auth', {screen: 'SignupHome'});
      }
    } else {
      console.log('loggedInStatus outside: ', loggedInStatus);
      navigation.replace('Auth', {screen: 'SignupHome'});
    }
  };

  const hideSplashScreen = () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  };

  handleRedirections.current = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');
      console.log('ScreenDeterminer->tokenFromStorage: ', tokenFromStorage);

      let showIntro = JSON.parse(await AsyncStorage.getItem('@show_intro'));

      if (showIntro === null) {
        navigation.reset({
          index: 0,
          routes: [{name: 'AppPromo'}],
        });
      } else if (tokenFromStorage !== null) {
        let user = await getUser();
        console.log('user: ', user);

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        await handleRedirectionBasedOnEmail(user);

        if (!isMobileNumberExists) {
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
        }
      } else {
        await handleLogoutRedirection();
      }

      hideSplashScreen();
    } catch (error) {
      handleNoInternet();
      handleExpiredSession.current();
      Sentry.captureException(error);
    }
  };

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
