/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOtpInput, useStepper} from 'uin';
import useBetaForm from '@reusejs/react-form-hook';
import BackgroundTimer from '../../../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';
import * as Sentry from '@sentry/react-native';
import {useHandleCASFetching} from '../../../../../reusables/CASFetching/useHandleCASFetching';
import {useState} from 'react';

export const OTPVerification = ({
  payload,
  onSubmit = () => {},
  onRequestResendOTP = () => {},
}) => {
  const theme = useTheme();
  const [isSubmittingCASRequest, setIsSubmittingCASRequest] = useState(false);
  const submitCASRequestOTPForm = useBetaForm({
    data_fetching_provider: 'cams',
    otp: '',
  });
  const {handleSubmitRequestCASOTPVerification, handleInitiateCASRequest} =
    useHandleCASFetching();

  useEffect(() => {
    if (submitCASRequestOTPForm?.value?.otp?.length === 5) {
      (async () => {
        setIsSubmittingCASRequest(true);
        const handleSubmitRequestCASOTPVerificationResponse =
          await handleSubmitRequestCASOTPVerification(
            submitCASRequestOTPForm?.value,
            'cams',
          );
        console.log(
          'handleSubmitRequestCASOTPVerificationResponse: ',
          handleSubmitRequestCASOTPVerificationResponse,
        );
        if (
          handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
            'Invalid OTP' ||
          handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
            'Invalid OTP attempt maximum reached.'
        ) {
          submitCASRequestOTPForm.setErrors({
            otp: handleSubmitRequestCASOTPVerificationResponse?.otp?.[0],
          });
          onSubmit(null);
          setIsSubmittingCASRequest(false);
        } else {
          onSubmit(handleSubmitRequestCASOTPVerificationResponse);
          setIsSubmittingCASRequest(false);
        }
      })();
    }
  }, [submitCASRequestOTPForm.value.otp]);

  const handleResendOTP = async () => {
    try {
      if (isSubmittingCASRequest) {
        return null;
      } else {
        submitCASRequestOTPForm.setField('otp', '');
        submitCASRequestOTPForm.setErrors({});
        onRequestResendOTP(true);
        const handleSubmitRequestCASOTPVerificationResponse =
          await handleInitiateCASRequest(payload, 'cams');
        console.log(
          'handleSubmitRequestCASOTPVerificationResponse: ',
          handleSubmitRequestCASOTPVerificationResponse,
        );
        onRequestResendOTP(handleSubmitRequestCASOTPVerificationResponse);
        return true;
      }
    } catch (error) {
      console.log(
        'handleResendOTP->handleSubmitRequestCASOTPVerification->error: ',
        error,
      );
      Sentry.captureException(error);
      return error;
    }
  };

  const handleChange = text => {
    if (text?.length <= 5) {
      submitCASRequestOTPForm.setErrors({});
      submitCASRequestOTPForm.setField('otp', text);
    }
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
          editable={!isSubmittingCASRequest}
          defaultValue={''}
          onChangeText={text => handleChange(text)}
          value={submitCASRequestOTPForm.getField('otp')}
          error={submitCASRequestOTPForm.errors.get('otp')}
          textInputStyles={
            submitCASRequestOTPForm.errors.get('otp')
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
            submitCASRequestOTPForm.errors.get('otp')
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
        callBack={async () => await handleResendOTP()}
      />
    </>
  );
};
