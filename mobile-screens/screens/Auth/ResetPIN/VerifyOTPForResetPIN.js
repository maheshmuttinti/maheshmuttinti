/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOtpInput} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapper';
import useBetaForm from '@reusejs/react-form-hook';
import {resetPassword, requestResetPassword} from 'services';
import BackgroundTimer from '../../../reusables/BackgroundTimer';
import {prettifyJSON} from 'utils';
import {useTheme} from 'theme';

export default function ({route, navigation}) {
  const [infoText, setInfoText] = useState('');
  const newPin = route?.params?.newPin;
  const userAttributes = route?.params?.userAttributes;
  const handleResetPinVerifyAndUpdatePinFnRef = useRef(() => {});
  const requestResetPasswordFnRef = useRef(() => {});
  const theme = useTheme();

  const form = useBetaForm({
    ...userAttributes,
    password: newPin,
    token: '',
  });

  useEffect(() => {
    if (userAttributes?.type === 'mobile_number') {
      setInfoText(
        `FinEzzy has sent SMS with a verification code to ${userAttributes?.value}`,
      );
    } else {
      setInfoText(
        `FinEzzy has sent an email with a verification code to ${userAttributes?.value}`,
      );
    }
  }, [userAttributes?.type, userAttributes?.value]);

  requestResetPasswordFnRef.current = async () => {
    try {
      const requestResetPasswordPayload = {
        ...userAttributes,
      };
      console.log(
        'requestResetPasswordPayload while reset mpin',
        prettifyJSON(requestResetPasswordPayload),
      );
      const requestResetPasswordResponse = await requestResetPassword(
        requestResetPasswordPayload,
      );
      console.log('response', prettifyJSON(requestResetPasswordResponse));
      if (
        requestResetPasswordResponse?.message ===
        'Request for verification successfully'
      ) {
      }
    } catch (err) {
      console.log('error while request reset password otp', err);
    }
  };

  useEffect(() => {
    if (form.value.token.length === 6) {
      handleResetPinVerifyAndUpdatePinFnRef.current();
    }
  }, [form.value.token]);

  handleResetPinVerifyAndUpdatePinFnRef.current = async () => {
    try {
      console.log('form.value', form.value);
      const payload = {
        type: form.value.type,
        value: form.value.value,
        password: newPin,
        token: form.value.token,
      };
      const response = await resetPassword(payload);
      console.log('response', JSON.stringify(response, null, 2));

      if (response?.message === 'Verification Successful') {
        navigation.replace('Auth', {
          screen: 'EnterPINHome',
        });
      }
    } catch (error) {
      console.log('error', error);
      if (error?.errors?.token[0] === 'Please provide token') {
        form.setErrors({token: 'Please enter verification code'});
      } else if (error?.message === 'Invalid Token') {
        console.log('error', error);
        form.setErrors({token: 'Please enter a valid code.'});
      }
    }
  };

  return (
    <AuthWrapper
      onBackPress={() => navigation.navigate('Auth', {screen: 'ResetPINHome'})}>
      <AuthHeading>Verification Code</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>{infoText}</GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <CustomOtpInput
          defaultValue={''}
          onChangeText={text => {
            form.setField('token', text);
          }}
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
          tintColor={
            form.errors.get('token')
              ? theme.colors.error
              : theme.colors.primaryBlue
          }
          // left={-21}
          // scale={0.9}
          // inputCount={6}
          secureTextEntry={false}
        />
      </View>

      <BackgroundTimer
        wrapperStyles={{paddingTop: 32}}
        callBack={() => requestResetPasswordFnRef.current()}
      />
    </AuthWrapper>
  );
}
