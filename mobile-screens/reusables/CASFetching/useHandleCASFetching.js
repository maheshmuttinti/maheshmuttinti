import {useStepper} from 'uin';
import {prettifyJSON} from 'utils';
import {useCASFetchAPIs} from './useCASFetchAPIs';

export const useHandleCASFetching = () => {
  const {handleInitiateRequestCAS, handleSubmitCASRequest} = useCASFetchAPIs();

  const {incrementCurrentStep} = useStepper();

  const handleInitiateCASRequest = async (initiateCASRequestPayload, rta) => {
    console.log(
      'initiateCASRequestPayload: ',
      prettifyJSON(initiateCASRequestPayload),
    );
    console.log('handleInitiateCASRequest-----------RTA:', rta);
    const handleInitiateCASRequestResponse = await handleInitiateRequestCAS(
      initiateCASRequestPayload,
    );
    console.log(
      'handleInitiateCASRequestResponse-------------: ',
      handleInitiateCASRequestResponse,
    );
    if (rta === 'cams') {
      console.log('handleInitiateCASRequest-----------------CAMS: ', rta);
      return handleInitiateCASRequestResponse;
    }
    if (rta === 'karvy') {
      console.log('handleInitiateCASRequest-----------KARVY: ', rta);
      return handleInitiateCASRequestResponse;
    }
  };

  const handleSubmitRequestCASOTPVerification = async (
    submitCASRequestPayload,
    rta,
  ) => {
    console.log('handleSubmitRequestCASOTPVerification-----------RTA: ', rta);
    const handleSubmitRequestCASOTPVerificationResponse =
      await handleSubmitCASRequest(submitCASRequestPayload);
    console.log(
      'handleSubmitRequestCASOTPVerificationResponse-----------------: ',
      handleSubmitRequestCASOTPVerificationResponse,
    );
    if (rta === 'cams') {
      if (
        handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
          'Invalid OTP' ||
        handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
          'Invalid OTP attempt maximum reached.'
      ) {
        return handleSubmitRequestCASOTPVerificationResponse;
      } else {
        incrementCurrentStep();
        return handleSubmitRequestCASOTPVerificationResponse;
      }
    } else if (rta === 'karvy') {
      if (
        handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
          'Invalid OTP' ||
        handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
          'Invalid OTP attempt maximum reached.' ||
        handleSubmitRequestCASOTPVerificationResponse?.otp?.[0] ===
          'Authentication Failed'
      ) {
        return handleSubmitRequestCASOTPVerificationResponse;
      } else {
        incrementCurrentStep();
        return handleSubmitRequestCASOTPVerificationResponse;
      }
    }
  };

  const handleSkipInitiateCASRequest = rta => {
    console.log('handleSkipInitiateCASRequest-------------RTA: ', rta);
    if (rta === 'cams') {
      console.log(
        'handleSkipInitiateCASRequest called condition--------CAMS: ',
        rta,
      );
      incrementCurrentStep();
    } else if ((rta = 'karvy')) {
      console.log(
        'handleSkipInitiateCASRequest called condition---------KARVY: ',
        rta,
      );
      incrementCurrentStep();
    }
  };

  return {
    handleInitiateCASRequest,
    handleSkipInitiateCASRequest,
    handleSubmitRequestCASOTPVerification,
  };
};
