/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {BackArrow} from 'assets';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import OverLayLoader from '../../../../reusables/loader';
import {useAutoFlowRTACASFetchingRedirections} from './hooks/useAutoFlowRTACASFetchingRedirections';
import {RTA_LOADING_MESSAGES} from './constants/index';
import {FetchCASFromCAMS} from '../../components/FetchCASFromRTAs/CAMS';
import {FetchCASFromKarvy} from '../../components/FetchCASFromRTAs/Karvy';
import {FetchCASFromAllRTAs} from '../../components/FetchCASFromRTAs/AllRTAs';

const SCREEN_BACKGROUND_COLOR = 'white';

export default function ({navigation, route}) {
  const refreshableCASDataProvidersForNBFC =
    route?.params?.refreshableCASDataProvidersForNBFC;
  const flowFromOnboarding = route?.params?.flowFromOnboarding;
  const waitForResponse = route?.params?.waitForResponse || false;
  const {CAMS_REQUEST_TEXT, KARVY_REQUEST_TEXT} = RTA_LOADING_MESSAGES;
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
    handleNextAfterCompleteCASFetch,
  } = useAutoFlowRTACASFetchingRedirections(
    refreshableCASDataProvidersForNBFC,
    navigation,
    flowFromOnboarding,
  );

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
          <FetchCASFromAllRTAs
            currentStep={currentStep}
            steps={steps}
            refreshableCASDataProvidersForNBFC={
              refreshableCASDataProvidersForNBFC
            }
            action={action}
            setLoadingText={setLoadingText}
            CAMS_REQUEST_TEXT={CAMS_REQUEST_TEXT}
            initiateCAMSCASForm={initiateCAMSCASForm}
            setAction={setAction}
            incrementCurrentStep={incrementCurrentStep}
            setSkippedSteps={setSkippedSteps}
            KARVY_REQUEST_TEXT={KARVY_REQUEST_TEXT}
            setCompletedSteps={setCompletedSteps}
            setFailedSteps={setFailedSteps}
            waitForResponse={waitForResponse}
            initiateKarvyCASForm={initiateKarvyCASForm}
            handleNextAfterCompleteCASFetch={handleNextAfterCompleteCASFetch}
            skippedSteps={skippedSteps}
            completedSteps={completedSteps}
            failedSteps={failedSteps}
            setActiveStep={setActiveStep}
          />
        ) : (
          <View style={{marginTop: 32, flex: 1}}>
            <FetchCASFromCAMS
              refreshableCASDataProvidersForNBFC={
                refreshableCASDataProvidersForNBFC
              }
              currentStep={currentStep}
              action={action}
              setLoadingText={setLoadingText}
              CAMS_REQUEST_TEXT={CAMS_REQUEST_TEXT}
              initiateCAMSCASForm={initiateCAMSCASForm}
              setAction={setAction}
              setSkippedSteps={setSkippedSteps}
              handleNextAfterCompleteCASFetch={handleNextAfterCompleteCASFetch}
              setFailedSteps={setFailedSteps}
              setCompletedSteps={setCompletedSteps}
              waitForResponse={waitForResponse}
            />

            <FetchCASFromKarvy
              refreshableCASDataProvidersForNBFC={
                refreshableCASDataProvidersForNBFC
              }
              currentStep={currentStep}
              action={action}
              setLoadingText={setLoadingText}
              KARVY_REQUEST_TEXT={KARVY_REQUEST_TEXT}
              initiateKarvyCASForm={initiateKarvyCASForm}
              setAction={setAction}
              setSkippedSteps={setSkippedSteps}
              handleNextAfterCompleteCASFetch={handleNextAfterCompleteCASFetch}
              setFailedSteps={setFailedSteps}
              setCompletedSteps={setCompletedSteps}
              waitForResponse={waitForResponse}
            />
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
