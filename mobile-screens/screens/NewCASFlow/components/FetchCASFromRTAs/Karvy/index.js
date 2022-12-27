import React from 'react';
import {CollectMobileAndEmail as CollectMobileAndEmailForKarvy} from './CollectMobileAndEmail';
import {OTPVerification as KarvyOTPVerification} from './OTPVerification';

export const FetchCASFromKarvy = ({
  refreshableCASDataProvidersForNBFC,
  currentStep,
  action,
  setLoadingText,
  KARVY_REQUEST_TEXT,
  initiateKarvyCASForm,
  setAction,
  setSkippedSteps,
  handleNextAfterCompleteCASFetch,
  setFailedSteps,
  setCompletedSteps,
  waitForResponse,
}) => {
  return (
    <>
      {refreshableCASDataProvidersForNBFC?.includes('karvy') &&
      currentStep === 1 &&
      action === 'request_using_custom' ? (
        <CollectMobileAndEmailForKarvy
          onLoading={status => {
            if (status === true) {
              setLoadingText(KARVY_REQUEST_TEXT);
            } else {
              setLoadingText(null);
            }
          }}
          errorMsg={initiateKarvyCASForm.errors.get('error')?.[0]}
          onSubmit={async nextAction => {
            if (nextAction === 'ask_for_otp') {
              setAction(nextAction);
              setLoadingText(null);
            } else if (nextAction === 'skip') {
              setLoadingText(null);
              setSkippedSteps(prevStep => [...prevStep, 1]);
              await handleNextAfterCompleteCASFetch();
            }
          }}
          onError={async () => {
            setLoadingText(null);
            setFailedSteps(prevStep => [...prevStep, 1]);
            await handleNextAfterCompleteCASFetch();
          }}
          onSkip={async () => {
            setLoadingText(null);
            setSkippedSteps(prevStep => [...prevStep, 1]);
            await handleNextAfterCompleteCASFetch();
          }}
        />
      ) : refreshableCASDataProvidersForNBFC?.includes('karvy') &&
        currentStep === 1 &&
        action === 'ask_for_otp' ? (
        <KarvyOTPVerification
          payload={initiateKarvyCASForm?.value}
          onSubmit={async nextAction => {
            setAction(null);
            if (!nextAction) {
              setLoadingText(null);
              await handleNextAfterCompleteCASFetch();
            } else {
              setLoadingText(null);
              setCompletedSteps(prevStep => [...prevStep, 1]);
              await handleNextAfterCompleteCASFetch();
            }
          }}
          onError={async () => {
            setAction(null);
            setLoadingText(null);
            setFailedSteps(prevStep => [...prevStep, 1]);
            await handleNextAfterCompleteCASFetch();
          }}
          onRequestResendOTP={status => {
            if (status === true) {
              setLoadingText(KARVY_REQUEST_TEXT);
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
