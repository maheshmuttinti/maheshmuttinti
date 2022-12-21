import * as Sentry from '@sentry/react-native';
import {prettifyJSON, sleep} from 'utils';
import {initialCASRequest, submitCASRequest} from 'services';

export const useCASFetchAPIs = () => {
  const handleInitiateRequestCAS = async initialCASRequestPayload => {
    try {
      if (!initialCASRequestPayload) {
        return null;
      }

      const responseOfInitiateCASFromCAMS = await initialCASRequest(
        initialCASRequestPayload,
      );
      console.log(
        'handleInitiateRequestCAS Response-------------: ',
        prettifyJSON(responseOfInitiateCASFromCAMS),
      );

      return responseOfInitiateCASFromCAMS?.next_step;
    } catch (error) {
      console.log('handleInitiateRequestCAS------------->error: ', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  const handleSubmitCASRequest = async submitCASRequestPayload => {
    try {
      if (!submitCASRequestPayload) {
        return null;
      }
      console.log(
        'Awaiting 10 seconds to Submit the RTA CAS Request OTP for Verification...',
      );
      console.log('Calling the Submit RTA CAS Request OTP API...');
      const submitCASRequestResponse = await submitCASRequest(
        submitCASRequestPayload,
      );
      console.log(
        'submitCASRequestResponse---------------: ',
        submitCASRequestResponse,
      );
      return submitCASRequestResponse;
    } catch (error) {
      console.log('handleInitiateRequestCAS---------->error: ', error);
      Sentry.captureException(error);
      throw error;
    }
  };

  return {
    handleInitiateRequestCAS,
    handleSubmitCASRequest,
  };
};
