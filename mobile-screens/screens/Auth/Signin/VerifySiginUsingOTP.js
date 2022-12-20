/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOTPInputWithAutoFill} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import useBetaForm from '@reusejs/react-form-hook';
import {loginWithOTP, getUser, requestForLoginOTP} from 'services';
import {setTokens, setUser} from 'store';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from '../../../reusables/BackgroundTimer';
import {VerifyOTPLoader} from '../../../reusables/VerifyOTPLoader';
import {useTheme} from 'theme';
import * as Sentry from '@sentry/react-native';

export default function ({route, navigation}) {
  const [infoText, setInfoText] = useState('');
  const [checkLoginStatus, setCheckLoginStatus] = useState('not_logged_in');
  const value = route?.params?.value;
  const type = route?.params?.type;
  const dispatch = useDispatch();
  const handleLogin = useRef(() => {});
  const persistLogin = useRef(() => {});
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const theme = useTheme();

  const form = useBetaForm({
    type: type,
    value: value,
    token: '',
  });

  useEffect(() => {
    if (type === 'mobile_number') {
      setInfoText(`FinEzzy has sent SMS with a verification code to ${value}`);
    } else {
      setInfoText(
        `FinEzzy has sent an email with a verification code to ${value}`,
      );
    }
  }, [type, value]);

  persistLogin.current = async () => {
    try {
      const tokenFromStorage = await AsyncStorage.getItem('@access_token');
      if (checkLoginStatus === 'logged_in') {
        if (tokenFromStorage !== null) {
          dispatch(setTokens(JSON.parse(tokenFromStorage)));
          let user = await getUser();
          console.log('user', JSON.stringify(user, null, 2));
          dispatch(setUser(user));
          navigation.replace('General', {screen: 'ScreenDeterminer'});
        }
      }
    } catch (error) {
      console.log('error', error);
      navigation.replace('Auth', {screen: 'SigninHome'});
    }
  };

  useEffect(() => {
    persistLogin.current();
  }, [checkLoginStatus]);

  useEffect(() => {
    if (form.value.token.length === 6) {
      handleLogin.current();
    }
  }, [form.value.token]);

  handleLogin.current = async () => {
    try {
      setVerifyingOTP(true);
      form.setErrors({token: ''});
      console.log('form.value', form.value);
      const payload = {
        type: form.value.type,
        value: form.value.value,
        token: form.value.token,
      };

      console.log('login with otp payload', payload);
      const response = await loginWithOTP(payload);
      console.log(
        'access_token response in verify signin using otp',
        JSON.stringify(response, null, 2),
      );

      if (response?.access_token) {
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: response?.access_token,
          }),
        );
        console.log(
          'signin with mobile number: setting the is_mobile_number_verified to true---------------------------------',
        );
        await AsyncStorage.setItem(
          '@is_mobile_number_verified',
          JSON.stringify(true),
        );
        console.log(
          'signin with mobile number: done the is_mobile_number_verified to true---------------------------------',
        );
        setCheckLoginStatus('logged_in');
      }
    } catch (error) {
      console.log('error', error);
      setVerifyingOTP(false);
      if (error?.errors?.token[0] === 'Please provide token') {
        form.setErrors({token: 'Please enter verification code'});
      } else if (error?.message === 'Invalid Token') {
        console.log('error', error);
        form.setErrors({token: 'Please enter a valid code.'});
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      form.setField('token', '');
      form.setErrors({token: ''});
      console.log('form.value', form.value);
      const payload = {
        type: form.value.type,
        value:
          form.value.type === 'mobile_number'
            ? form.value.value.slice(3)
            : form.value.value,
        token: form.value.token,
      };
      console.log('payload for resend otp -login', payload);
      const resendOTPResponse = await requestForLoginOTP(payload);
      console.log('response', JSON.stringify(resendOTPResponse, null, 2));
      return true;
    } catch (error) {
      console.log('error', error);
      if (error?.message === 'Invalid Token') {
        console.log('error', error);
        form.setErrors({token: 'Please enter a valid code.'});
      } else {
        form.setErrors(error);
      }
    }
  };

  return (
    <AuthWrapper>
      <AuthHeading>Verification Code</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>{infoText}</GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <CustomOTPInputWithAutoFill
          defaultValue={''}
          onChangeText={text => form.setField('token', text)}
          value={form.getField('token')}
          error={form.errors.get('token')}
          textInputStyles={
            form.errors.get('token')
              ? {
                  borderColor: theme.colors.error,
                  backgroundColor: theme.colors.greyscale50,
                }
              : {
                  backgroundColor: theme.colors.greyscale50,
                  borderColor: 'transparent',
                }
          }
          otpLength={6}
          onSubmit={async otp => {
            form.setField('token', otp);
          }}
          onGetHashSuccess={hash => {
            Sentry.captureMessage(`hash code of the finezzy app: ${hash}`);
          }}
          onGetHashError={error => {
            Sentry.captureException(error);
          }}
          onOTPRetrieveError={message => {
            Sentry.captureException(`OTP Retrieve Error: ${message}`);
          }}
          tintColor={
            form.errors.get('token')
              ? theme.colors.error
              : theme.colors.primaryBlue
          }
          secureTextEntry={false}
          overlappingIcon={() =>
            verifyingOTP ? (
              <View style={{position: 'absolute', right: 13.24}}>
                <ActivityIndicator color={theme.colors.primaryBlue} />
              </View>
            ) : null
          }
        />
        {/* <VerifyOTPLoader loading={verifyingOTP} /> */}
      </View>

      <BackgroundTimer
        wrapperStyles={{paddingTop: 32}}
        callBack={() => handleResendOTP()}
      />
    </AuthWrapper>
  );
}
