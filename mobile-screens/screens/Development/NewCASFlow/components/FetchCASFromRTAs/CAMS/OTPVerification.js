/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOtpInput} from 'uin';
import useBetaForm from '@reusejs/react-form-hook';
import BackgroundTimer from '../../../../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';

export const OTPVerification = ({route, onSubmit}) => {
  const value = route?.params?.value;
  const type = route?.params?.type;
  const handleLogin = useRef(() => {});
  const theme = useTheme();

  const form = useBetaForm({
    type: type,
    value: value,
    token: '',
  });

  useEffect(() => {
    if (form.value.token.length === 6) {
      handleLogin.current();
      onSubmit();
    }
  }, [form.value.token]);

  handleLogin.current = async () => {
    try {
      console.log('form.value', form.value);
    } catch (error) {}
  };

  const handleResendOTP = async () => {
    try {
    } catch (error) {}
  };

  return (
    <>
      <AuthHeading>CAMS Verification</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>
          CAMS has sent a message with a verification code to registered email
          and phone number
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <CustomOtpInput
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
          tintColor={
            form.errors.get('token')
              ? theme.colors.error
              : theme.colors.primaryBlue
          }
          secureTextEntry={false}
        />
      </View>

      <BackgroundTimer
        wrapperStyles={{paddingTop: 32}}
        callBack={() => handleResendOTP()}
      />
    </>
  );
};
