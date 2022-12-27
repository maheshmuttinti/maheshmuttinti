/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {Stepper} from 'uin';
import {BlueDotCircle, GreyCircle, GreenTickCircleSmall} from 'assets';
import {CollectMobileAndEmail as CollectMobileAndEmailForCAMS} from '../CAMS/CollectMobileAndEmail';
import {CollectMobileAndEmail as CollectMobileAndEmailForKarvy} from '../Karvy/CollectMobileAndEmail';
import {OTPVerification as CAMSOTPVerification} from '../CAMS/OTPVerification';
import {OTPVerification as KarvyOTPVerification} from '../Karvy/OTPVerification';
import {useTheme} from 'theme';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export const FetchCASFromAllRTAs = ({
  currentStep,
  steps,
  refreshableCASDataProvidersForNBFC,
  action,
  setLoadingText,
  CAMS_REQUEST_TEXT,
  initiateCAMSCASForm,
  setAction,
  incrementCurrentStep,
  setSkippedSteps,
  KARVY_REQUEST_TEXT,
  setCompletedSteps,
  setFailedSteps,
  waitForResponse,
  initiateKarvyCASForm,
  handleNextAfterCompleteCASFetch,
  skippedSteps,
  completedSteps,
  failedSteps,
  setActiveStep,
}) => {
  const theme = useTheme();
  return (
    <>
      <View style={{marginTop: 16}}>
        <Stepper
          iconHeight={ICON_HEIGHT}
          iconWidth={ICON_WIDTH}
          iconBackgroundColor={SCREEN_BACKGROUND_COLOR}
          notSelectedComponent={() => <GreyCircle />}
          checkedComponent={() => <GreenTickCircleSmall />}
          selectedComponent={() => <BlueDotCircle />}
          failedComponent={() => (
            <GreenTickCircleSmall fill={theme.colors.error} />
          )}
          activeLineColor="blue"
          checkedLabelColor={theme.colors.primaryBlue}
          selectedLabelColor="black"
          notSelectedLabelColor="grey"
          hideDefaultHeader={true}
          activeStep={currentStep}
          skippedSteps={skippedSteps}
          completedSteps={completedSteps}
          failedSteps={failedSteps}
          capitalizeLabel={true}
          labelTopSpace={10}
          incrementCurrentStep={incrementCurrentStep}
          setActiveStep={setActiveStep}
          currentStep={currentStep}
          steps={steps}
        />
      </View>
      <View style={{marginTop: 64, flex: 1}}>
        <Text
          style={{
            ...theme.fontSizes.small,
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.primaryOrange,
            fontFamily: theme.fonts.regular,
            paddingBottom: 8,
          }}>
          {`VERIFICATION ${currentStep + 1} of ${steps?.length}`}
        </Text>
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
            onSubmit={nextAction => {
              if (nextAction === 'ask_for_otp') {
                setAction(nextAction);
              } else if (nextAction === 'skip') {
                incrementCurrentStep();
                setAction('skip_cams');
                setSkippedSteps(prevStep => [...prevStep, 0]);
                setLoadingText(KARVY_REQUEST_TEXT);
              }
            }}
            onError={() => {
              incrementCurrentStep();
              setLoadingText(KARVY_REQUEST_TEXT);
              setAction('skip_cams');
              setFailedSteps(prevStep => [...prevStep, 0]);
            }}
            onSkip={() => {
              incrementCurrentStep();
              setLoadingText(KARVY_REQUEST_TEXT);
              setAction('skip_cams');
              setSkippedSteps(prevStep => [...prevStep, 0]);
            }}
          />
        ) : refreshableCASDataProvidersForNBFC?.includes('cams') &&
          currentStep === 0 &&
          action === 'ask_for_otp' ? (
          <CAMSOTPVerification
            payload={initiateCAMSCASForm?.value}
            onSubmit={nextAction => {
              if (!nextAction) {
                setLoadingText(null);
              } else {
                incrementCurrentStep();
                setAction('karvy_auto_check');
                setCompletedSteps(prevStep => [...prevStep, 0]);
                setLoadingText(KARVY_REQUEST_TEXT);
              }
            }}
            onError={() => {
              incrementCurrentStep();
              setAction('karvy_auto_check');
              setFailedSteps(prevStep => [...prevStep, 0]);
              setLoadingText(KARVY_REQUEST_TEXT);
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
                setAction(null);
                setSkippedSteps(prevStep => [...prevStep, 1]);
                await handleNextAfterCompleteCASFetch();
              }
            }}
            onError={async () => {
              setLoadingText(null);
              setAction(null);
              setFailedSteps(prevStep => [...prevStep, 1]);
              await handleNextAfterCompleteCASFetch();
            }}
            onSkip={async () => {
              setLoadingText(null);
              setAction(null);
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
      </View>
    </>
  );
};
