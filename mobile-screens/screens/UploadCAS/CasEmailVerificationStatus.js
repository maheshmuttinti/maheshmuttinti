/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useCallback} from 'react';
import {View, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'theme';
import {BaseButton} from 'uin';

import {useHideSplashScreen} from '../../reusables/useHideSplashScreen';
import {EmailActivation} from 'assets';

export default function ({navigation, route}) {
  const theme = useTheme();
  const verificationStatus = route?.params?.verification_status;
  console.log(
    'verificationStatus in CasEmailVerificationStatus: ',
    verificationStatus,
  );
  const {hideSplashScreen} = useHideSplashScreen();

  const handleSubmit = () => {
    navigation.replace('General', {screen: 'ScreenDeterminer'});
  };

  useFocusEffect(
    useCallback(() => {
      hideSplashScreen();
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
        <BaseButton onPress={() => handleSubmit()}>Go Back to App</BaseButton>
      </View>
    </View>
  );
}
