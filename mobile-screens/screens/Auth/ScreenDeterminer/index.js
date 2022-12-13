/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {getUser, getCASEmails} from 'services';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {View} from 'react-native';
import {setHideIntro} from 'store';
import {useTheme} from 'theme';
import SplashScreen from 'react-native-splash-screen';
import {AnimatedEllipsis} from 'uin';
import {sleep} from 'utils';

export default function ({navigation, route}) {
  const theme = useTheme();

  const redirectionFnRef = useRef(() => {});
  const handleRedirectionsFnRef = useRef(() => {});
  const redirectToNoInternetScreen = useRef(() => {});
  const dispatch = useDispatch();
  const verificationStatus = route?.params?.verificationStatus;

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

  redirectionFnRef.current = () => {
    if (isSessionExpired === true) {
      AsyncStorage.clear();
      dispatch(setHideIntro(true));
      (async () =>
        await AsyncStorage.setItem('@hide_intro', JSON.stringify(true)))();
      navigation.replace('Auth', {screen: 'SigninHome'});
    } else {
      return;
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRedirectionsFnRef.current();
      redirectionFnRef.current();
    }, []),
  );

  useEffect(() => {
    if (networkStatus === 'offline') {
      redirectToNoInternetScreen.current();
    }
  }, [networkStatus]);

  redirectToNoInternetScreen.current = () =>
    navigation.navigate('EmptyStates', {screen: 'NoInternet'});

  handleRedirectionsFnRef.current = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');
      console.log('ScreenDeterminer->tokenFromStorage: ', tokenFromStorage);

      // await AsyncStorage.setItem('@hide_intro', JSON.stringify(true));

      if (tokenFromStorage !== null) {
        let user = await getUser();
        console.log('user: ', user);
        let CASEmailsResponse = await getCASEmails();

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        const isUsernameTypeNonGmail =
          user?.profile?.meta?.username_type === 'non_gmail';

        const isUsernameTypeMobileNumber =
          user?.profile?.meta?.username_type === 'mobile_number';

        const isUsernameTypeGmail =
          user?.profile?.meta?.username_type === 'gmail';

        const isUsernameTypeAppleId =
          user?.profile?.meta?.username_type === 'apple_id';

        const isUserSetMPIN = user?.profile?.meta?.mpin_set === true;
        const isUserSkipMPIN = user?.profile?.meta?.mpin_set === 'skip';
        console.log('isUserSkipMPIN: ', isUserSkipMPIN);

        const isMoreThanOneCASEmailsPresent =
          CASEmailsResponse && CASEmailsResponse?.length > 1;

        const isCASEmailsArePresent =
          CASEmailsResponse && CASEmailsResponse?.length > 0;

        const isCASEmailIsNonGmail =
          isCASEmailsArePresent &&
          CASEmailsResponse?.find(
            item => item['cas_emails*email_type'] === 'non_gmail',
          );

        const isCASEmailIsGmail =
          isCASEmailsArePresent &&
          CASEmailsResponse?.find(
            item => item['cas_emails*email_type'] === 'gmail',
          );

        const isCASEmailVerificationSuccess =
          isCASEmailsArePresent &&
          CASEmailsResponse?.find(
            item => item['cas_emails*verification_status'],
          ) &&
          CASEmailsResponse?.find(
            item => item['cas_emails*verification_status'] === 'success',
          );

        const isNonGmailCASEmailVerified =
          isCASEmailIsNonGmail && isCASEmailVerificationSuccess;

        const isCasEmailVerified =
          isNonGmailCASEmailVerified || isCASEmailIsGmail;

        const isCASEmailRequested =
          CASEmailsResponse?.find(item => item?.latest_cas_request !== null) &&
          CASEmailsResponse?.find(item => item?.latest_cas_request !== null)
            ?.latest_cas_request['cas_requests*uuid'];

        const isUserRequestedCAS =
          isCASEmailsArePresent && isCasEmailVerified && isCASEmailRequested;

        const isOnboardingCasEmailRequestCompleted =
          isUserRequestedCAS &&
          user?.profile?.meta?.onboarding_steps
            ?.consolidate_mutual_funds_linked_to_email?.status === 'completed';

        const isCASEmailVerificationPending =
          isCASEmailsArePresent &&
          CASEmailsResponse[0]?.['cas_emails*verification_status'] &&
          CASEmailsResponse[0]?.['cas_emails*verification_status'] ===
            'pending';

        console.log(
          'isCASEmailVerificationPending',
          isCASEmailVerificationPending,
        );

        // const isCASEmailVerificationSuccess =
        //   isCASEmailsArePresent &&
        //   CASEmailsResponse[0]['cas_emails*verification_status'] === 'success';

        const isRiskProfilingStepCompleted =
          user?.profile?.meta?.onboarding_steps?.risk_profiling?.status ===
            'completed' ||
          user?.profile?.meta?.onboarding_steps?.risk_profiling?.status ===
            'skipped';

        const isInvestmentBehaviorStepSkipped =
          user?.profile?.meta?.onboarding_steps?.investment_behavior?.status ===
          'skipped';

        const isInvestmentBehaviorStepCompleted =
          user?.profile?.meta?.onboarding_steps?.investment_behavior?.status ===
          'completed';

        const isCASEmailVerificationIsPending =
          isCASEmailIsNonGmail && isCASEmailVerificationPending;

        const isCASEmailVerificationIsSuccess =
          isCASEmailIsNonGmail && isCASEmailVerificationSuccess;

        const isUserEnteredMPINForAppServices = isUserLoggedInWithMPIN === true;
        console.log(
          'isUserEnteredMPINForAppServices: ',
          isUserEnteredMPINForAppServices,
        );

        const isCASEmailVerifiedAlready =
          isCASEmailIsGmail || isCASEmailVerificationIsSuccess;

        const isUserAuthenticatedInAppAndCASRequestSuccess =
          isUserEnteredMPINForAppServices && isCASEmailVerifiedAlready;

        const isOnboardingCASApplyStateCompleted =
          (isMobileNumberExists &&
            isUsernameTypeNonGmail &&
            isOnboardingCasEmailRequestCompleted) ||
          (isMobileNumberExists &&
            isUsernameTypeMobileNumber &&
            isOnboardingCasEmailRequestCompleted) ||
          (isMobileNumberExists &&
            isUsernameTypeGmail &&
            isOnboardingCasEmailRequestCompleted) ||
          (isMobileNumberExists &&
            isUsernameTypeAppleId &&
            isOnboardingCasEmailRequestCompleted);

        if (!isMobileNumberExists) {
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
        } else if (isUserSkipMPIN) {
          await sleep(2000);
          console.log('navigation: ', navigation);
          navigation.replace('Protected');
        } else if (isUserSetMPIN) {
          console.log('enter pin screen before check');

          // Reason to comment: To Prevent the Email Verification Link screen show up on Open App
          if (isCASEmailVerificationIsPending) {
            navigation.replace('EmailActivationLinkScreen', {
              email: CASEmailsResponse[0]['cas_emails*email'],
              type: 'auth_flow',
              mpin_set: user?.profile?.meta?.mpin_set,
              verificationStatus: verificationStatus,
            });
          } else {
            console.log('enter pin screen before check');
            if (isUserAuthenticatedInAppAndCASRequestSuccess) {
              console.log(
                'isUserAuthenticatedInAppAndCASRequestSuccess: ',
                isUserAuthenticatedInAppAndCASRequestSuccess,
              );
              if (isMoreThanOneCASEmailsPresent) {
                navigation.replace('Protected', {
                  screen: 'ImportPortfolio',
                });
              } else {
                if (
                  isOnboardingCASApplyStateCompleted &&
                  isRiskProfilingStepCompleted
                ) {
                  navigation.replace('Protected');
                } else if (
                  isOnboardingCASApplyStateCompleted &&
                  (isInvestmentBehaviorStepSkipped ||
                    isInvestmentBehaviorStepCompleted) &&
                  !isRiskProfilingStepCompleted
                ) {
                  navigation.replace('Onboarding', {
                    screen: 'EnterDobScreen',
                  });
                } else {
                  navigation.replace('Onboarding', {
                    screen: 'PermissionsEmailSentScreen',
                  });
                }
              }
            } else {
              console.log('oops, enter pin');
              navigation.replace('PINSetup', {
                screen: 'EnterPINHome',
                params: {
                  verificationStatus: verificationStatus,
                },
              });
            }
          }
        } else {
          console.log('set pin screen before check');
          // Reason to comment: To Prevent the Email Verification Link screen show up on Open App
          if (isCASEmailVerificationIsPending) {
            navigation.replace('EmailActivationLinkScreen', {
              email: CASEmailsResponse[0]['cas_emails*email'],
              type: 'auth_flow',
              mpin_set: user?.profile?.meta?.mpin_set,
              verificationStatus: verificationStatus,
            });
          } else {
            if (isUserAuthenticatedInAppAndCASRequestSuccess) {
              if (isMoreThanOneCASEmailsPresent) {
                navigation.replace('Protected', {
                  screen: 'ImportPortfolio',
                });
              } else {
                if (
                  isOnboardingCASApplyStateCompleted &&
                  isRiskProfilingStepCompleted
                ) {
                  navigation.replace('Protected');
                } else if (
                  isOnboardingCASApplyStateCompleted &&
                  (isInvestmentBehaviorStepSkipped ||
                    isInvestmentBehaviorStepCompleted) &&
                  !isRiskProfilingStepCompleted
                ) {
                  navigation.replace('Onboarding', {
                    screen: 'EnterDobScreen',
                  });
                } else {
                  navigation.replace('Onboarding', {
                    screen: 'PermissionsEmailSentScreen',
                  });
                }
              }
            } else {
              navigation.replace('PINSetup', {
                screen: 'SetPINHome',
                params: {
                  verificationStatus: verificationStatus,
                },
              });
            }
          }
        }
      } else {
        // await sleep(1000)
        let hideIntro = JSON.parse(await AsyncStorage.getItem('@hide_intro'));
        console.log(
          'ScreenDeterminer->when no tokenFromStorage exist->hideIntro',
          hideIntro,
        );

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
        if (hideIntro === null || hideIntro === false) {
          navigation.replace('AppPromo', {screen: 'AppPromo'});
        }
      }

      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    } catch (error) {
      if (networkStatus === 'offline') {
        redirectToNoInternetScreen.current();
      }
      if (isSessionExpired === true) {
        AsyncStorage.clear();
        dispatch(setHideIntro(true));
        (async () =>
          await AsyncStorage.setItem('@hide_intro', JSON.stringify(true)))();
        navigation.replace('Auth', {screen: 'SigninHome'});
      }
      return error;
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
