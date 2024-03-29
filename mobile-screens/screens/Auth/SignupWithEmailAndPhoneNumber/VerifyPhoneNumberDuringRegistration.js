/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOTPInputWithAutoFill} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import useBetaForm from '@reusejs/react-form-hook';
import {
  verifyRegistration,
  requestVerifyRegistration,
  getUser,
  addCASEmail,
  saveEmail,
} from 'services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setTokens} from 'store';
import BackgroundTimer from '../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';
import {prettifyJSON, showNativeAlert} from 'utils';
import * as Sentry from '@sentry/react-native';

export default function ({route, navigation}) {
  const value = route?.params?.value;
  const type = route?.params?.type;
  const casEmail = route?.params?.casEmail;
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  console.log('casEmail', casEmail);

  const handleRedirect = async () => {
    try {
      const tokenFromStorage = await AsyncStorage.getItem('@access_token');
      dispatch(setTokens(JSON.parse(tokenFromStorage)));

      if (tokenFromStorage !== null) {
        const user = await getUser();
        console.log(
          'handleRedirect on verify phone number -> user: --------'.toUpperCase(),
          user,
        );

        const saveEmailResponse = await saveEmail();

        console.log(
          '--------------------saveEmailResponse----------: ',
          prettifyJSON(saveEmailResponse),
        );
        if (saveEmailResponse?.email_verified === false) {
          navigation.replace('General', {
            screen: 'EmailVerificationStatus',
            params: {
              email: saveEmailResponse?.email,
              type: 'auth_flow',
              verificationStatus: saveEmailResponse?.email_verified,
            },
          });
          setVerifyingOTP(false);
        } else {
          navigation.replace('General', {
            screen: 'EmailVerificationStatus',
            params: {
              email: saveEmailResponse?.email,
              type: 'auth_flow',
              verificationStatus: saveEmailResponse?.email_verified,
            },
          });
          setVerifyingOTP(false);
        }
      } else {
        setVerifyingOTP(false);
        showNativeAlert('Unable to Logged into the App, Please try again!');
      }
    } catch (err) {
      console.log('error', err);
      setVerifyingOTP(false);
      Sentry.captureException(err);
      throw err;
    }
  };

  const form = useBetaForm({
    type: type,
    value: value,
    token: '',
  });

  useEffect(() => {
    if (form.value.token.length === 6) {
      handleVerifyOTP();
    }
  }, [form.value.token]);

  const handleVerifyOTP = async () => {
    try {
      setVerifyingOTP(true);
      form.setErrors({token: ''});
      const payload = {
        type: form.value.type,
        value: form.value.value,
        token: form.value.token,
        after_verification: 'respond_with_token',
      };

      const response = await verifyRegistration(payload);
      console.log('response of verify registration: '.toUpperCase(), response);

      if (response?.access_token) {
        form.setErrors({});
        await storeTheTokenInAsyncStorage(response?.access_token);
        setVerifyingOTP(false);
      }
    } catch (error) {
      setVerifyingOTP(false);

      console.log('error while verifying otp', prettifyJSON(error));
      if (error?.message === 'Invalid Token') {
        form.setErrors({token: 'Please enter a valid code.'});
      } else {
        form.setErrors(error);
      }
    }
  };

  const handleAddCASEmail = async accessMetaEmail => {
    try {
      const addCASEmailPayload = {
        email: accessMetaEmail || casEmail,
        email_type: 'non_gmail',
      };

      console.log('addCASEmailPayload', addCASEmailPayload);

      const addCASEmailResponse = await addCASEmail(addCASEmailPayload);
      return addCASEmailResponse;
    } catch (error) {
      showNativeAlert('Something went wrong while adding CAS Email');
      console.log('error', error);
      Sentry.captureException(error);
      return error;
    }
  };

  const storeTheTokenInAsyncStorage = async accessToken => {
    console.log('storeTheTokenInAsyncStorage->accessToken: ', accessToken);
    try {
      if (accessToken) {
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: accessToken,
          }),
        );
        console.log(
          'email&phone: setting the is_mobile_number_verified to true---------------------------------',
        );
        await AsyncStorage.setItem(
          '@is_mobile_number_verified',
          JSON.stringify(true),
        );
        console.log(
          'email&phone: done the is_mobile_number_verified to true---------------------------------',
        );

        await handleRedirect();
        setVerifyingOTP(false);
      }
    } catch (error) {
      setVerifyingOTP(false);
      console.log('storeTheTokenInAsyncStorage-error', error);
      Sentry.captureException(error);
    }
  };
  const handleResendOTP = async () => {
    try {
      console.log('handleResendOTP called');
      form.setField('token', '');
      form.setErrors({token: ''});
      const resendPayload = {
        type: form.value.type,
        value: form.value.value,
      };
      console.log('resendPayload', resendPayload);
      await requestVerifyRegistration(resendPayload);
      return true;
    } catch (error) {
      console.log('error', error.response.data);
    }
  };

  return (
    <AuthWrapper>
      <AuthHeading>Phone Verification</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>{`FinEzzy has sent SMS with a verification code to ${value}`}</GrayBodyText>
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
        {/* <VerifyOTPLoader verifyingOTP={verifyingOTP} /> */}
      </View>

      <BackgroundTimer
        wrapperStyles={{paddingTop: 32}}
        callBack={() => handleResendOTP()}
      />
    </AuthWrapper>
  );
}
