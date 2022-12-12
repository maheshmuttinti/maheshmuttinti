/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOTPInputWithAutoFill} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapper';
import useBetaForm from '@reusejs/react-form-hook';
import {
  updateUserProfile,
  verifyAttribute,
  // requestVerifyAttribute,
  updateAttribute,
} from 'services';
import BackgroundTimer from '../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';
import {prettifyJSON} from 'utils';
import useUser from '../../../reusables/useUser';
import * as Sentry from '@sentry/react-native';
import {VerifyOTPLoader} from '../../../reusables/VerifyOTPLoader';

export default function ({route, navigation}) {
  const [infoText, setInfoText] = useState('');
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const value = route?.params?.value;
  const type = route?.params?.type;
  const handleVerifyPhoneNumberOTP = useRef(() => {});
  const updateUserProfileFnRef = useRef(() => {});
  const theme = useTheme();

  const user = useUser();

  const form = useBetaForm({
    type: type,
    value: value,
    token: '',
  });

  useEffect(() => {
    setInfoText(`FinEzzy has sent SMS with a verification code to ${value}`);
  }, [value]);

  updateUserProfileFnRef.current = async () => {
    try {
      console.log(
        'verifyPhoneNumberduring onboarding - user',
        JSON.stringify(user, null, 2),
      );

      const payload = {
        meta: {...user?.profile?.meta, phone_number: value},
      };

      const updatedProfile = await updateUserProfile(payload);
      console.log(
        'update the phone number in meta here',
        prettifyJSON(updatedProfile),
      );
      if (updatedProfile) {
        navigation.replace('Auth', {
          screen: 'ScreenDeterminor',
        });
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  useEffect(() => {
    if (form.value.token.length === 6) {
      setVerifyingOTP(true);
      handleVerifyPhoneNumberOTP.current();
      setVerifyingOTP(false);
    }
  }, [form.value.token]);

  handleVerifyPhoneNumberOTP.current = async () => {
    try {
      form.setErrors({token: ''});
      const verifyOtpPayload = {
        ...form.value,
      };
      const verificationResponse = await verifyAttribute(verifyOtpPayload);

      if (verificationResponse) {
        setVerifyingOTP(false);
        console.log('verificationResponse', prettifyJSON(verificationResponse));
        navigation.replace('Auth', {
          screen: 'ScreenDeterminor',
        });
      }
    } catch (error) {
      setVerifyingOTP(false);
      console.log('error', error);
      if (error?.errors?.token[0] === 'Please provide token') {
        form.setErrors({token: 'Please enter verification code'});
      } else if (
        error?.message === 'Invalid OTP' ||
        error?.value[0] === 'Invalid Token' ||
        error?.value[0] === 'No verification requested'
      ) {
        console.log('error', error);
        form.setErrors({token: 'Please enter a valid code.'});
      } else {
        form.setErrors({token: 'Something went wrong'});
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      console.log('form.value for resend otp', form.value);
      form.setField('token', '');
      form.setErrors({token: ''});
      const payload = {
        type: form.value.type,
        value: form.value.value,
      };
      console.log('payload for resend otp -login', payload);

      const updateAttributeResponse = await updateAttribute(payload);
      console.log('response', JSON.stringify(updateAttributeResponse, null, 2));
      // const resendOTPAttributeResponse = await requestVerifyAttribute(payload);
      // console.log(
      //   'response',
      //   JSON.stringify(resendOTPAttributeResponse, null, 2),
      // );
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
      <AuthHeading>Phone Verification</AuthHeading>

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
        />
        <VerifyOTPLoader loading={verifyingOTP} />
      </View>

      <BackgroundTimer
        wrapperStyles={{paddingTop: 32}}
        callBack={() => handleResendOTP()}
      />
    </AuthWrapper>
  );
}
