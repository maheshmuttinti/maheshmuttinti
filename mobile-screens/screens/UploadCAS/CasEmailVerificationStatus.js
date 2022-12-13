/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useState} from 'react';
import {View, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'theme';
import {AnimatedEllipsis} from 'uin';
import {updateUserProfile, getUser} from 'services';
import {showToast} from 'utils';
import * as Sentry from '@sentry/react-native';

export default function ({navigation, route}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(null);
  const verificationStatus = route?.params?.verification_status;
  let verifiedEmail = route?.params?.email;

  const handleRedirection = useRef(() => {});

  const updateUserMetaDataWithVerifiedEmail = async email => {
    try {
      setLoading(true);
      const user = await getUser();
      let updateProfilePayload = {
        meta: {...user?.profile?.meta},
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Sentry.captureException(error);
      showToast(error?.response?.data || 'Something went wrong');
    }
  };

  const handleRedirect = () => {
    verifiedEmail = verifiedEmail.split(' ').join('+');

    navigation.reset({
      index: 0,
      routes: [{name: 'VerifyEmail'}],
    });
    navigation.replace('ScreenDeterminer', {
      verificationStatus,
      verifiedEmail,
    });
  };

  handleRedirection.current = async () => {
    try {
      if (verificationStatus === 'success') {
        showToast('Email verified successfully');
        await updateUserMetaDataWithVerifiedEmail(verifiedEmail);
        handleRedirect();
      } else {
        handleRedirect();
      }
    } catch (err) {
      handleRedirect();
      Sentry.captureException(err);
      return err;
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRedirection.current();
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
      {loading === true && (
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingTop: 16,
            textAlign: 'center',
          }}>
          Verifying Email...
        </Text>
      )}
    </View>
  );
}
