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

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;
const STEPS_COUNT = 2;

export default function ({navigation}) {
  const theme = useTheme();
  const [initialStep, setInitialStep] = useState(0);
  const {currentStep, steps} = useStepper();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [nextStep, setNextStep] = useState(null);
  const [loadingText, setLoadingText] = useState(null);

  const initiateCAMSCASForm = useBetaForm({
    credentials: 'user',
    data_fetching_provider: 'cams',
  });
  const initiateKarvyCASForm = useBetaForm({
    credentials: 'user',
    data_fetching_provider: 'karvy',
  });

  const {handleInitiateCASRequest} = useHandleCASFetching();

  useEffect(() => {
    (async () => {
      setLoadingText(
        "Initializing CAS Request from CAMS, Please don't close the app",
      );
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
      if (nextStep === 'karvy_auto_check') {
        setLoadingText(
          "Initializing CAS Request from Karvy, Please don't close the app",
        );
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
          {currentStepToShow === 1 &&
          (!nextStep || nextStep === 'request_using_custom') ? (
            <CollectMobileAndEmailForCAMS
              onLoading={status => {
                if (status === true) {
                  setLoadingText(
                    "Initializing CAS Request from CAMS, Please don't close the app",
                  );
                } else {
                  setLoadingText(null);
                }
              }}
              onSubmit={step => {
                console.log('step: ', step);
                setNextStep(step);
              }}
              onSkip={() => setSkippedSteps(prevStep => [...prevStep, 0])}
            />
          ) : currentStepToShow === 1 && nextStep === 'ask_cams_otp' ? (
            <CAMSOTPVerification
              onSubmit={step => {
                if (!step) {
                  console.log('CAMSOTPVerification->!step: ', step);
                } else {
                  console.log('CAMSOTPVerification->step', step);
                  setNextStep('karvy_auto_check');
                  setCompletedSteps(prevStep => [...prevStep, 0]);
                }
              }}
              payload={initiateCAMSCASForm?.value}
              onRequestResendOTP={status => {
                console.log('onRequestResendOTP->status: ', status);
                if (status === true) {
                  setLoadingText(
                    "Initializing CAS Request from Karvy, Please don't close the app",
                  );
                } else {
                  setLoadingText(null);
                }
              }}
            />
          ) : null}

          {currentStepToShow === STEPS_COUNT &&
          nextStep === 'request_using_custom' ? (
            <CollectMobileAndEmailForKarvy
              onLoading={status => {
                if (status === true) {
                  setLoadingText(
                    "Initializing CAS Request from Karvy, Please don't close the app",
                  );
                } else {
                  setLoadingText(null);
                }
              }}
              onSubmit={step => {
                console.log('step: ', step);
                setNextStep(step);
              }}
              onSkip={() => setSkippedSteps(prevStep => [...prevStep, 1])}
            />
          ) : currentStepToShow === STEPS_COUNT &&
            nextStep === 'ask_karvy_otp' ? (
            <KarvyOTPVerification
              onSubmit={step => {
                if (!step) {
                  console.log('KarvyOTPVerification->!step: ', step);
                } else {
                  console.log('KarvyOTPVerification->step', step);
                  setNextStep('karvy_auto_check');
                  setCompletedSteps(prevStep => [...prevStep, 1]);
                  navigation.replace('Protected');
                }
              }}
              payload={initiateKarvyCASForm?.value}
              onRequestResendOTP={status => {
                console.log('onRequestResendOTP->status: ', status);
                if (status === true) {
                  setLoadingText(
                    "Initializing CAS Request from Karvy, Please don't close the app",
                  );
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
