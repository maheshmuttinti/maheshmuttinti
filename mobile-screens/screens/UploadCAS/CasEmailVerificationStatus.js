/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useState} from 'react';
import {View, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'theme';
import {AnimatedEllipsis, BaseButton} from 'uin';
import {updateUserProfile, getUser} from 'services';
import {showToast} from 'utils';
import * as Sentry from '@sentry/react-native';
import {useHideSplashScreen} from '../../reusables/useHideSplashScreen';
import {EmailActivation} from 'assets';

export default function ({navigation, route}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(null);
  const verificationStatus = route?.params?.verification_status;
  console.log(
    'verificationStatus in CasEmailVerificationStatus: ',
    verificationStatus,
  );
  let verifiedEmail = route?.params?.email;
  const {hideSplashScreen} = useHideSplashScreen();

  const handleRedirection = useRef(() => {});

  const updateUserMetaDataWithVerifiedEmail = async email => {
    try {
      const user = await getUser();
      let updateProfilePayload = {
        meta: {...user?.profile?.meta, email: email},
      };
      if (!user?.profile?.meta?.username_type) {
        updateProfilePayload = {
          meta: {
            ...user?.profile?.meta,
            username_type: 'non_gmail',
            email: email,
          },
        };
      }

      await updateUserProfile(updateProfilePayload);
    } catch (error) {
      Sentry.captureException(error);
      showToast(error?.response?.data || 'Something went wrong');
    }
  };

  const handleRedirect = () => {
    verifiedEmail = verifiedEmail.split(' ').join('+');

    navigation.reset({
      index: 0,
      routes: [{name: 'EmailActivationLinkScreen'}],
    });
    navigation.replace(
      'General',
      {screen: 'ScreenDeterminer'},
      {
        verificationStatus,
        verifiedEmail,
      },
    );
  };

  handleRedirection.current = async () => {
    try {
      setLoading(true);
      if (verificationStatus === 'success') {
        await updateUserMetaDataWithVerifiedEmail(verifiedEmail);
        setLoading(false);
        handleRedirect();
      } else {
        setLoading(false);
        handleRedirect();
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleRedirect();
      Sentry.captureException(err);
      return err;
    }
  };

  useFocusEffect(
    useCallback(() => {
      hideSplashScreen();
      // handleRedirection.current();
    }, []),
  );

  const getEmailVerificationStatus = () => {
    if (verificationStatus === 'success') {
      return 'Email is Verified Successfully';
    }
    if (verificationStatus === 'already_verified') {
      return 'Email is Already Verified';
    }
    if (verificationStatus === 'failed') {
      return 'Email verification failed';
    }
    if (verificationStatus === 'already_verified_by_other_user') {
      return 'Email is Already Verified by other user';
    }
    if (verificationStatus === 'link_expired') {
      return 'Email verification link is expired';
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
      }}>
      {loading === true ? (
        <>
          <AnimatedEllipsis dotSize={12} dotColor={theme.colors.primaryBlue} />
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.regular,
              paddingTop: 16,
              textAlign: 'center',
            }}>
            Please Wait, Adding Email to the User Profile...
          </Text>
        </>
      ) : (
        <>
          <View style={{paddingTop: 20}}>
            <EmailActivation />
          </View>
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.bold,
              paddingTop: 16,
              ...theme.fontSizes.heading4,
              textAlign: 'center',
            }}>
            {getEmailVerificationStatus()}
          </Text>
          <View style={{paddingTop: 32, width: '100%'}}>
            <BaseButton onPress={() => handleRedirection.current()}>
              Go Back to App
            </BaseButton>
          </View>
        </>
      )}
    </View>
  );
}
