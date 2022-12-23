import * as Sentry from '@sentry/react-native';
import {initialCASRequest, submitCASRequest} from 'services';

export const useHandleCASFetching = () => {
  const handleInitiateCASRequest = async initialCASRequestPayload => {
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
      const submitCASRequestResponse = await submitCASRequest(
        submitCASRequestPayload,
      );
      return submitCASRequestResponse;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  return {
    handleInitiateCASRequest,
    handleSubmitCASRequest,
  };
};
