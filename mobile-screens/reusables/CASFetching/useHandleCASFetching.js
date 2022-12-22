import {useStepper} from 'uin';
import {prettifyJSON} from 'utils';
import {useCASFetchAPIs} from './useCASFetchAPIs';

export const useHandleCASFetching = incrementCurrentStep => {
  const {handleInitiateRequestCAS, handleSubmitCASRequest} = useCASFetchAPIs();

  // const {incrementCurrentStep} = useStepper();

  const handleInitiateCASRequest = async (initiateCASRequestPayload, rta) => {
    try {
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
    } catch (error) {
      throw error;
    }
  };

  const handleSubmitRequestCASOTPVerification = async (
    submitCASRequestPayload,
    rta,
  ) => {
    try {
      console.log('handleSubmitRequestCASOTPVerification-----------RTA: ', rta);
      const handleSubmitRequestCASOTPVerificationResponse =
        await handleSubmitCASRequest(submitCASRequestPayload);
      console.log(
        'handleSubmitRequestCASOTPVerificationResponse-----------------: ',
        handleSubmitRequestCASOTPVerificationResponse,
      );
      if (rta === 'cams') {
        incrementCurrentStep();
        return handleSubmitRequestCASOTPVerificationResponse;
      } else if (rta === 'karvy') {
        incrementCurrentStep();
        return handleSubmitRequestCASOTPVerificationResponse;
      }
    } catch (error) {
      throw error;
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
