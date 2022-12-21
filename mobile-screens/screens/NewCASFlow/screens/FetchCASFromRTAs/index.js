/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import {Stepper, useStepper} from 'uin';
import {BlueDotCircle, GreyCircle, GreenTickCircleSmall} from 'assets';
import {useTheme} from 'theme';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import {CollectMobileAndEmail as CollectMobileAndEmailForCAMS} from '../../components/FetchCASFromRTAs/CAMS/CollectMobileAndEmail';
import {CollectMobileAndEmail as CollectMobileAndEmailForKarvy} from '../../components/FetchCASFromRTAs/Karvy/CollectMobileAndEmail';
import {OTPVerification as CAMSOTPVerification} from '../../components/FetchCASFromRTAs/CAMS/OTPVerification';
import {OTPVerification as KarvyOTPVerification} from '../../components/FetchCASFromRTAs/Karvy/OTPVerification';
import OverLayLoader from '../../../../reusables/loader';
import {useHandleCASFetching} from '../../../../reusables/CASFetching/useHandleCASFetching';
import {prettifyJSON} from 'utils';
import {useEffect} from 'react';
import {useState} from 'react';
import useBetaForm from '@reusejs/react-form-hook';
import Config from 'react-native-config';
import {WebViewComponent} from '../../../../reusables/WebView_new';
import {Loader} from '../../../../reusables/TermsAndConditionsModal';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;
const STEPS_COUNT = 2;

const CAMS_REQUEST_TEXT =
  "Initializing CAS Request from CAMS, Please don't close the app";
const KARVY_REQUEST_TEXT =
  "Initializing CAS Request from Karvy, Please don't close the app";

export default function ({navigation}) {
  const theme = useTheme();
  const [initialStep, setInitialStep] = useState(0);
  const {incrementCurrentStep, currentStep, steps} = useStepper();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [nextStep, setNextStep] = useState(null);
  const [loadingText, setLoadingText] = useState(null);

  const initiateCAMSCASForm = useBetaForm({
    credentials: 'user',
    data_fetching_provider: 'cams',
    fi_code: `${Config.FI_CODE}`,
  });
  const initiateKarvyCASForm = useBetaForm({
    credentials: 'user',
    data_fetching_provider: 'karvy',
    fi_code: `${Config.FI_CODE}`,
  });

  const {handleInitiateCASRequest} = useHandleCASFetching();

  useEffect(() => {
    (async () => {
      setLoadingText(CAMS_REQUEST_TEXT);
      const handleInitiateCASRequestResponse = await handleInitiateCASRequest(
        initiateCAMSCASForm?.value,
        'cams',
      );
      console.log(
        'handleInitiateCASRequestResponse in email and phone: ',
        prettifyJSON(handleInitiateCASRequestResponse),
      );
      setLoadingText(null);

      setNextStep(handleInitiateCASRequestResponse);
    })();
  }, [initiateCAMSCASForm?.value]);

  useEffect(() => {
    (async () => {
      if (nextStep === 'karvy_auto_check' || nextStep === 'skip_cams') {
        setLoadingText(KARVY_REQUEST_TEXT);
        const handleInitiateCASRequestResponse = await handleInitiateCASRequest(
          initiateKarvyCASForm?.value,
          'karvy',
        );
        console.log(
          'handleInitiateCASRequestResponse in email and phone: ',
          prettifyJSON(handleInitiateCASRequestResponse),
        );
        setLoadingText(null);

        setNextStep(handleInitiateCASRequestResponse);
      }
    })();
  }, [initiateKarvyCASForm?.value, nextStep]);

  console.log('nextStep in index file: ', nextStep);

  const currentStepToShow = useMemo(
    () => (currentStep + 1 > steps?.length ? steps.length : currentStep + 1),
    [currentStep, steps],
  );
  console.log('currentStepToShow: ', currentStepToShow);

  return (
    <ScreenWrapper style={{backgroundColor: SCREEN_BACKGROUND_COLOR}}>
      <OverLayLoader
        loading={!!loadingText}
        backdropOpacity={0.5}
        text={loadingText || ''}
      />

      <View style={{paddingHorizontal: 24, paddingTop: 24, flex: 1}}>
        <View style={{marginTop: 16}}>
          <Stepper
            iconHeight={ICON_HEIGHT}
            iconWidth={ICON_WIDTH}
            iconBackgroundColor={SCREEN_BACKGROUND_COLOR}
            notSelectedComponent={() => <GreyCircle />}
            checkedComponent={() => <GreenTickCircleSmall />}
            selectedComponent={() => <BlueDotCircle />}
            activeLineColor="blue"
            checkedLabelColor={theme.colors.primaryBlue}
            selectedLabelColor="black"
            notSelectedLabelColor="grey"
            hideDefaultHeader={true}
            activeStep={initialStep}
            skippedSteps={skippedSteps}
            completedSteps={completedSteps}
            capitalizeLabel={true}
            labelTopSpace={10}>
            <Stepper.Steps>
              <Stepper.Step id="first" name="CAMS" />
              <Stepper.Step id="second" name="KARVY" />
            </Stepper.Steps>
          </Stepper>
        </View>
        {nextStep?.message?.includes('html') ? (
          <WebViewComponent
            url={{html: nextStep?.message}}
            containerStyle={{height: '100%', marginTop: 24}}
            loaderComponent={() => <Loader />}
          />
        ) : null}
        <View style={{marginTop: 64, flex: 1}}>
          <Text
            style={{
              ...theme.fontSizes.small,
              fontWeight: theme.fontWeights.moreBold,
              color: theme.colors.primaryOrange,
              fontFamily: theme.fonts.regular,
              paddingBottom: 8,
            }}>
            {`VERIFICATION ${currentStepToShow} of ${steps?.length}`}
          </Text>

          {currentStepToShow === 1 && nextStep === 'request_using_custom' ? (
            <CollectMobileAndEmailForCAMS
              onLoading={status => {
                if (status === true) {
                  setLoadingText(CAMS_REQUEST_TEXT);
                } else {
                  setLoadingText(null);
                }
              }}
              onSubmit={step => {
                console.log('step: ', step);
                if (step === 'ask_for_otp') {
                  setNextStep(step);
                } else {
                  incrementCurrentStep();
                  setNextStep('skip_cams');
                  setSkippedSteps(prevStep => [...prevStep, 0]);
                }
              }}
              onSkip={() => {
                console.log('onSkip called in CAMS 1st screen: ');
                setNextStep('skip_cams');
                // incrementCurrentStep();
                setSkippedSteps(prevStep => [...prevStep, 0]);
              }}
            />
          ) : currentStepToShow === 1 && nextStep === 'ask_for_otp' ? (
            <CAMSOTPVerification
              onSubmit={step => {
                if (!step) {
                  console.log('CAMSOTPVerification->!step: ', step);
                } else {
                  console.log('CAMSOTPVerification->step', step);
                  setNextStep('karvy_auto_check');
                  // incrementCurrentStep();
                  setCompletedSteps(prevStep => [...prevStep, 0]);
                }
              }}
              payload={initiateCAMSCASForm?.value}
              onRequestResendOTP={status => {
                console.log('onRequestResendOTP->status: ', status);
                if (status === true) {
                  setLoadingText(CAMS_REQUEST_TEXT);
                } else {
                  setLoadingText(null);
                }
              }}
            />
          ) : null}

          {(currentStepToShow === STEPS_COUNT &&
            nextStep === 'request_using_custom') ||
          (currentStepToShow === STEPS_COUNT && nextStep === 'skip_cams') ? (
            <CollectMobileAndEmailForKarvy
              onLoading={status => {
                if (status === true) {
                  setLoadingText(KARVY_REQUEST_TEXT);
                } else {
                  setLoadingText(null);
                }
              }}
              onSubmit={step => {
                console.log('step: ', step);
                if (step === 'ask_for_otp') {
                  setNextStep(step);
                } else {
                  incrementCurrentStep();
                  setNextStep('skip_karvy');
                  setSkippedSteps(prevStep => [...prevStep, 1]);
                  navigation.replace('Protected');
                }
              }}
              onSkip={() => {
                setSkippedSteps(prevStep => [...prevStep, 1]);
                navigation.replace('Protected');
              }}
            />
          ) : currentStepToShow === STEPS_COUNT &&
            nextStep === 'ask_for_otp' ? (
            <KarvyOTPVerification
              onSubmit={step => {
                if (!step) {
                  console.log('KarvyOTPVerification->!step: ', step);
                } else {
                  console.log('KarvyOTPVerification->step', step);
                  setCompletedSteps(prevStep => [...prevStep, 1]);
                  navigation.replace('Protected');
                }
              }}
              payload={initiateKarvyCASForm?.value}
              onRequestResendOTP={status => {
                console.log('onRequestResendOTP->status: ', status);
                if (status === true) {
                  setLoadingText(KARVY_REQUEST_TEXT);
                } else {
                  setLoadingText(null);
                }
              }}
            />
          ) : null}
        </View>
      </View>
    </ScreenWrapper>
  );
}
