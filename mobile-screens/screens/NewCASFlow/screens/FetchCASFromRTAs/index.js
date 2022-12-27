/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Stepper} from 'uin';
import {
  BlueDotCircle,
  GreyCircle,
  GreenTickCircleSmall,
  BackArrow,
} from 'assets';
import {useTheme} from 'theme';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import {CollectMobileAndEmail as CollectMobileAndEmailForCAMS} from '../../components/FetchCASFromRTAs/CAMS/CollectMobileAndEmail';
import {CollectMobileAndEmail as CollectMobileAndEmailForKarvy} from '../../components/FetchCASFromRTAs/Karvy/CollectMobileAndEmail';
import {OTPVerification as CAMSOTPVerification} from '../../components/FetchCASFromRTAs/CAMS/OTPVerification';
import {OTPVerification as KarvyOTPVerification} from '../../components/FetchCASFromRTAs/Karvy/OTPVerification';
import OverLayLoader from '../../../../reusables/loader';
import {useAutoFlowRTACASFetchingRedirections} from './hooks/useAutoFlowRTACASFetchingRedirections';
import {RTA_LOADING_MESSAGES} from './constants/index';
import {
  generateUserPortfolio,
  getNBFCs,
  getUserPreApprovedLoanAmount,
} from 'services';
import {debugLog, prettifyJSON} from 'utils';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export default function ({navigation, route}) {
  const refreshableCASDataProvidersForNBFC =
    route?.params?.refreshableCASDataProvidersForNBFC;
  const flowFromOnboarding = route?.params?.flowFromOnboarding;
  const waitForResponse = route?.params?.waitForResponse || false;
  const {CAMS_REQUEST_TEXT, KARVY_REQUEST_TEXT} = RTA_LOADING_MESSAGES;
  const theme = useTheme();
  const {
    incrementCurrentStep,
    completedSteps,
    setCompletedSteps,
    steps,
    skippedSteps,
    action,
    loadingText,
    currentStep,
    setActiveStep,
    setLoadingText,
    setAction,
    setSkippedSteps,
    setFailedSteps,
    failedSteps,
    initiateCAMSCASForm,
    initiateKarvyCASForm,
  } = useAutoFlowRTACASFetchingRedirections(refreshableCASDataProvidersForNBFC);

  const handleGeneratePortfolio = async () => {
    try {
      const generateUserPortfolioResponse = await generateUserPortfolio();
      debugLog(
        'generateUserPortfolioResponse: ',
        prettifyJSON(generateUserPortfolioResponse),
      );

      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleGetUserPreApprovedLoanAmount = async () => {
    try {
      const getUserPreApprovedLoanAmountResponse =
        await getUserPreApprovedLoanAmount();
      debugLog(
        'getUserPreApprovedLoanAmountResponse: ',
        prettifyJSON(getUserPreApprovedLoanAmountResponse),
      );

      return getUserPreApprovedLoanAmountResponse;
    } catch (error) {
      throw error;
    }
  };
  const handleGetNBFCs = async () => {
    try {
      const getNBFCsResponse = await getNBFCs();
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      throw error;
    }
  };
  const handleNextAfterCompleteCASFetch = async () => {
    try {
      if (flowFromOnboarding === true) {
        navigation.replace('Protected');
      } else {
        await handleGeneratePortfolio();
        const minMaxPreApprovedLoanAmount =
          await handleGetUserPreApprovedLoanAmount();
        const nbfcs = await handleGetNBFCs();
        debugLog('handleGetNBFCs->nbfcs: ', nbfcs);
        debugLog(
          'minMaxPreApprovedLoanAmount----------: ',
          minMaxPreApprovedLoanAmount,
        );
        navigation.navigate('LAMFV2', {
          screen: 'LoanAmountSelection',
          params: {
            loanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
            minLoanAmount: minMaxPreApprovedLoanAmount?.min_eligible_loan,
            maxLoanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
            availableFilterOptions: nbfcs?.available_filter_options,
          },
        });
      }
    } catch (error) {
      console.log('handleNextAfterCompleteCASFetch->error: ', error);
      if (error?.response?.data?.errorCode === 'INVESTOR_NOT_FOUND') {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
        });
        throw error;
      }
    }
  };
  return (
    <ScreenWrapper style={{backgroundColor: SCREEN_BACKGROUND_COLOR}}>
      <View style={{paddingHorizontal: 24, paddingTop: 24, flex: 1}}>
        {navigation.canGoBack() ? (
          <View style={{}}>
            <TouchableOpacity
              hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
              onPress={() => navigation.canGoBack() && navigation.pop()}
              style={{flex: 0.3 / 4}}>
              <BackArrow />
            </TouchableOpacity>
          </View>
        ) : null}

        {refreshableCASDataProvidersForNBFC?.length > 1 &&
        refreshableCASDataProvidersForNBFC?.includes('cams') &&
        refreshableCASDataProvidersForNBFC?.includes('karvy') ? (
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
        ) : (
          <View style={{marginTop: 32, flex: 1}}>
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
          </View>
        )}
      </View>
      <OverLayLoader
        loading={loadingText !== null}
        backdropOpacity={0.5}
        text={loadingText || ''}
      />
    </ScreenWrapper>
  );
}
