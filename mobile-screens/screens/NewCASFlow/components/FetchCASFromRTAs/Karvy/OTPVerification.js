/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOtpInput} from 'uin';
import useBetaForm from '@reusejs/react-form-hook';
import BackgroundTimer from '../../../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';
import * as Sentry from '@sentry/react-native';
import {useHandleCASFetching} from '../../../../../reusables/CASFetching/useHandleCASFetching';

export const OTPVerification = () => {
  const theme = useTheme();
  const submitCASRequestOTPForm = useBetaForm({
    data_fetching_provider: 'cams',
    otp: '',
  });
  const {handleSubmitRequestCASOTPVerification, isSubmittingCASRequest} =
    useHandleCASFetching();

  useEffect(() => {
    if (submitCASRequestOTPForm.value.otp.length === 6) {
      handleSubmitRequestCASOTPVerification(submitCASRequestOTPForm?.value);
    }
  }, [submitCASRequestOTPForm.value.otp]);

  const handleResendOTP = async () => {
    try {
      const handleSubmitRequestCASOTPVerificationResponse =
        handleSubmitRequestCASOTPVerification(submitCASRequestOTPForm?.value);
      console.log(
        'handleSubmitRequestCASOTPVerificationResponse: ',
        handleSubmitRequestCASOTPVerificationResponse,
      );
    } catch (error) {
      console.log(
        'handleResendOTP->handleSubmitRequestCASOTPVerification->error: ',
        error,
      );
      Sentry.captureException(error);
      return error;
    }
  };

  return (
    <>
      <AuthHeading>KARVY Verification</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>
          KARVY has sent a message with a verification code to registered email
          and phone number
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <CustomOtpInput
          defaultValue={''}
          onChangeText={text => submitCASRequestOTPForm.setField('token', text)}
          value={submitCASRequestOTPForm.getField('token')}
          error={submitCASRequestOTPForm.errors.get('token')}
          textInputStyles={
            submitCASRequestOTPForm.errors.get('token')
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
            submitCASRequestOTPForm.errors.get('token')
              ? theme.colors.error
              : theme.colors.primaryBlue
          }
          overlappingIcon={() =>
            isSubmittingCASRequest ? (
              <View style={{position: 'absolute', right: 13.24}}>
                <ActivityIndicator color={theme.colors.primaryBlue} />
              </View>
            ) : null
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
