import * as Sentry from '@sentry/react-native';
import {initialCASRequest, submitCASRequest} from 'services';
import axios from 'axios';
const source = axios.CancelToken.source();
const timeout = setTimeout(() => {
  console.log('Cancelling Request....');
  source.cancel();
  console.log('Cancelled Request.');
}, 1000);

export const useCASFetchAPIs = () => {
  const handleInitiateRequestCAS = async initialCASRequestPayload => {
    try {
      if (!initialCASRequestPayload) {
        return null;
      }

      const responseOfInitiateCASFromCAMS = await initialCASRequest(
        initialCASRequestPayload,
      );

      return responseOfInitiateCASFromCAMS?.next_step;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };
  const handleSubmitCASRequest = async submitCASRequestPayload => {
    try {
      if (!submitCASRequestPayload) {
        return null;
      }
      submitCASRequest;

      const submitCASRequestResponse = await submitCASRequest(
        submitCASRequestPayload,
        {cancelToken: source.token},
        timeout,
      );
      return submitCASRequestResponse;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  return {
    handleInitiateRequestCAS,
    handleSubmitCASRequest,
  };
};
