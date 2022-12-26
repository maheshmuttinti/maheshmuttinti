/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOtpInput} from 'uin';
import useBetaForm from '@reusejs/react-form-hook';
import BackgroundTimer from '../../../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';
import * as Sentry from '@sentry/react-native';
import {useHandleCASFetching} from '../../../../../reusables/CASFetching/useHandleCASFetching';
import Config from 'react-native-config';
import {debugLog} from 'utils';

export const OTPVerification = ({
  payload,
  onSubmit = () => {},
  onRequestResendOTP = () => {},
  onError = () => {},
  waitForResponse = false,
}) => {
  const theme = useTheme();
  const [isSubmittingCASRequest, setIsSubmittingCASRequest] = useState(false);

  const submitCASRequestOTPForm = useBetaForm({
    data_fetching_provider: 'karvy',
    otp: '',
    fi_code: `${Config.DEFAULT_NBFC_CODE}`,
  });
  const {handleSubmitCASRequest, handleInitiateCASRequest} =
    useHandleCASFetching();

  useEffect(() => {
    if (submitCASRequestOTPForm?.value?.otp?.length === 6) {
      (async () => {
        try {
          setIsSubmittingCASRequest(true);

          const handleSubmitCASRequestResponse = await handleSubmitCASRequest(
            submitCASRequestOTPForm?.value,
            waitForResponse,
          );
          debugLog(
            'handleSubmitCASRequestResponse: ',
            handleSubmitCASRequestResponse,
          );

          onSubmit(handleSubmitCASRequestResponse);
          setIsSubmittingCASRequest(false);
        } catch (error) {
          setIsSubmittingCASRequest(false);
          debugLog(
            'handleInitiateCASRequestForRedirection-error',
            error,
            error?.response?.status,
          );
          if (error?.response?.status === 422) {
            setIsSubmittingCASRequest(false);
            submitCASRequestOTPForm.setErrors(error?.response?.data?.errors);
            Sentry.captureException(error);
            throw error;
          } else {
            onError(error);
            throw error;
          }
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
        const handleSubmitCASRequestResponse = await handleInitiateCASRequest(
          payload,
        );
        debugLog(
          'handleSubmitCASRequestResponse: ',
          handleSubmitCASRequestResponse,
        );
        onRequestResendOTP(handleSubmitCASRequestResponse);
        return true;
      }
    } catch (error) {
      debugLog('handleResendOTP->handleSubmitCASRequest->error: ', error);
      Sentry.captureException(error);
      submitCASRequestOTPForm.setErrors(error);
      throw error;
    }
  };

  const handleChange = text => {
    if (text?.length <= 6) {
      submitCASRequestOTPForm.setErrors({});
      submitCASRequestOTPForm.setField('otp', text);
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
