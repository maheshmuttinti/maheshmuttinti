import {useCASFetchAPIs} from './useCASFetchAPIs';

export const useHandleCASFetching = () => {
  const {handleInitiateRequestCAS, handleSubmitCASRequest} = useCASFetchAPIs();

  const handleInitiateCASRequest = async (initiateCASRequestPayload, rta) => {
    try {
      const handleInitiateCASRequestResponse = await handleInitiateRequestCAS(
        initiateCASRequestPayload,
      );
      if (rta === 'cams') {
        return handleInitiateCASRequestResponse;
      }
      if (rta === 'karvy') {
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
      const handleSubmitRequestCASOTPVerificationResponse =
        await handleSubmitCASRequest(submitCASRequestPayload);
      if (rta === 'cams') {
        return handleSubmitRequestCASOTPVerificationResponse;
      } else if (rta === 'karvy') {
        return handleSubmitRequestCASOTPVerificationResponse;
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    handleInitiateCASRequest,
    handleSubmitRequestCASOTPVerification,
  };
};
