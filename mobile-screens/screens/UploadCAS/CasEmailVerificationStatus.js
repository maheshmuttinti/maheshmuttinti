/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useState} from 'react';
import {View, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'theme';
import {AnimatedEllipsis} from 'uin';
import {requestCAS, updateUserProfile, getUser} from 'services';
import {showToast} from 'utils';
import useOnboardingHandleRedirection from '../../reusables/useOnboardingHandleRedirection';
import {useSelector, shallowEqual} from 'react-redux';

export default function ({navigation, route}) {
  const theme = useTheme();
  const [apiCallStatus, setApiCallStatus] = useState(null);
  const verificationStatus = route?.params?.verification_status;
  let verifiedEmail = route?.params?.email;

  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();
  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );

  const redirectionFnRef = useRef(() => {});

  const handleRequestCAS = async requestCASPayload => {
    try {
      const user = await getUser();
      let updateProfilePayload = {
        meta: {...user?.profile?.meta},
      };
      if (!user?.profile?.meta?.username_type) {
        updateProfilePayload = {
          meta: {...user?.profile?.meta, username_type: 'non_gmail'},
        };
      }

      await updateUserProfile(updateProfilePayload);

      setApiCallStatus('requesting_cas');
      const requestCASResponse = await requestCAS(requestCASPayload);
      setApiCallStatus('success');
      if (
        !user?.profile?.meta?.onboarding_steps
          ?.consolidate_mutual_funds_linked_to_email
      ) {
        await handleUpdateOnboardingStep(user, {
          consolidate_mutual_funds_linked_to_email: {
            status: 'completed',
            data: {
              email: requestCASResponse?.data?.email,
              email_type: requestCASResponse?.data?.email_type,
            },
          },
        });
      }

      return requestCASResponse;
    } catch (error) {
      setApiCallStatus('failed');
      showToast(error?.response?.data || 'Something went wrong');
    }
  };

  redirectionFnRef.current = async () => {
    try {
      if (verificationStatus === 'success') {
        showToast('Email verified successfully');
        verifiedEmail = verifiedEmail.split(' ').join('+');
        const requestCASPayload = {email: verifiedEmail};
        const isUserEnteredMPINForAppServices = isUserLoggedInWithMPIN === true;
        if (isUserEnteredMPINForAppServices) {
          await handleRequestCAS(requestCASPayload);

          navigation.replace('ScreenDeterminer', {
            verificationStatus,
            verifiedEmail,
          });
        } else {
          navigation.replace('ScreenDeterminer', {
            verificationStatus,
            verifiedEmail,
          });
        }
      } else if (verificationStatus === 'failed') {
        showToast('Email verification failed');

        navigation.replace('ScreenDeterminer', {
          verificationStatus,
          verifiedEmail,
        });
      } else if (verificationStatus === 'link_expired') {
        showToast('Email link expired');

        navigation.replace('ScreenDeterminer', {
          verificationStatus,
          verifiedEmail,
        });
      } else if (verificationStatus === 'already_verified_by_other_user') {
        showToast('Email already verified by other user');

        navigation.replace('ScreenDeterminer', {
          verificationStatus,
          verifiedEmail,
        });
      } else {
        navigation.replace('ScreenDeterminer', {
          verificationStatus,
          verifiedEmail,
        });
      }
    } catch (err) {
      navigation.replace('ScreenDeterminer', {
        verificationStatus,
        verifiedEmail,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      redirectionFnRef.current();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <AnimatedEllipsis dotSize={12} dotColor={theme.colors.primaryBlue} />
      {apiCallStatus === 'requesting_cas' && (
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingTop: 16,
            textAlign: 'center',
          }}>
          Requesting CAS Statement...
        </Text>
      )}
    </View>
  );
}
