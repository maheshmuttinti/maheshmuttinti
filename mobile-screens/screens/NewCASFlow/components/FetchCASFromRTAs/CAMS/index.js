import React from 'react';
import {CollectMobileAndEmail as CollectMobileAndEmailForCAMS} from './CollectMobileAndEmail';
import {OTPVerification as CAMSOTPVerification} from './OTPVerification';

export const FetchCASFromCAMS = ({
  refreshableCASDataProvidersForNBFC,
  currentStep,
  action,
  setLoadingText,
  CAMS_REQUEST_TEXT,
  initiateCAMSCASForm,
  setAction,
  setSkippedSteps,
  handleNextAfterCompleteCASFetch,
  setFailedSteps,
  setCompletedSteps,
  waitForResponse,
}) => {
  return (
    <>
      {refreshableCASDataProvidersForNBFC?.includes('cams') &&
      currentStep === 0 &&
      action === 'request_using_custom' ? (
        <CollectMobileAndEmailForCAMS
          onLoading={status => {
            if (status === true) {
              setLoadingText(CAMS_REQUEST_TEXT);
            } else {
              setLoadingText(null);
            }
          }}
          errorMsg={initiateCAMSCASForm.errors.get('error')?.[0]}
          onSubmit={async nextAction => {
            if (nextAction === 'ask_for_otp') {
              setAction(nextAction);
            } else if (nextAction === 'skip') {
              setSkippedSteps(prevStep => [...prevStep, 0]);
              await handleNextAfterCompleteCASFetch();
            }
          }}
          onError={async () => {
            await handleNextAfterCompleteCASFetch();
            setFailedSteps(prevStep => [...prevStep, 0]);
          }}
          onSkip={async () => {
            await handleNextAfterCompleteCASFetch();
            setSkippedSteps(prevStep => [...prevStep, 0]);
          }}
        />
      ) : refreshableCASDataProvidersForNBFC?.includes('cams') &&
        currentStep === 0 &&
        action === 'ask_for_otp' ? (
        <CAMSOTPVerification
          payload={initiateCAMSCASForm?.value}
          onSubmit={async nextAction => {
            if (!nextAction) {
              setLoadingText(null);
            } else {
              setCompletedSteps(prevStep => [...prevStep, 0]);
              await handleNextAfterCompleteCASFetch();
            }
          }}
          onError={async () => {
            await handleNextAfterCompleteCASFetch();
            setFailedSteps(prevStep => [...prevStep, 0]);
          }}
          onRequestResendOTP={status => {
            if (status === true) {
              setLoadingText(CAMS_REQUEST_TEXT);
            } else {
              setLoadingText(null);
            }
          }}
          waitForResponse={waitForResponse}
        />
      ) : null}
    </>
  );
};
