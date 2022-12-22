/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Stepper, useStepper} from 'uin';
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
import {useHandleCASFetching} from '../../../../reusables/CASFetching/useHandleCASFetching';
import {prettifyJSON} from 'utils';
import {useEffect} from 'react';
import {useState} from 'react';
import useBetaForm from '@reusejs/react-form-hook';
import Config from 'react-native-config';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

const CAMS_REQUEST_TEXT =
  "Initializing CAS Request from CAMS, Please don't close the app";
const KARVY_REQUEST_TEXT =
  "Initializing CAS Request from Karvy, Please don't close the app";

const showStepCount = (provider = 'cams') => {
  switch (provider) {
    case 'cams':
      return 0;
    case 'karvy':
      return 1;
    default:
      return 0;
  }
};


export default function ({navigation, route}) {
  const theme = useTheme();
  const defaultSelectedStep = route?.params?.dataProvider || 'cams';

  const [initialStep] = useState(showStepCount(defaultSelectedStep));
  const {incrementCurrentStep, currentStep, setActiveStep, steps} = useStepper(
    0,
    [
      {id: 'first', name: 'CAMS'},
      {id: 'second', name: 'KARVY'},
    ],
    [],
  );
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [action, setAction] = useState(null);
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
    setActiveStep(initialStep);
    if (initialStep === 1) {
      setSkippedSteps(prevStep => [...prevStep, 0]);
    }
  }, [initialStep]);

  useEffect(() => {
    (async () => {
      try {
        if (currentStep === 0) {
          setLoadingText(CAMS_REQUEST_TEXT);
          const handleInitiateCASRequestResponse =
            await handleInitiateCASRequest(initiateCAMSCASForm?.value, 'cams');

          setLoadingText(null);
          setAction(handleInitiateCASRequestResponse);
        }
      } catch (error) {
        initiateCAMSCASForm.setErrors({
          error: [`${error?.message?.errors?.error}`],
        });
        setLoadingText(null);
        setAction('request_using_custom');
        throw error;
      }
    })();
  }, [initiateCAMSCASForm?.value, currentStep]);

  console.log(
    'initiateCAMSCASForm',
    prettifyJSON(initiateCAMSCASForm.errors.get('error')),
  );

  useEffect(() => {
    (async () => {
      try {
        if (currentStep === 1) {
          setLoadingText(KARVY_REQUEST_TEXT);
          const handleInitiateCASRequestResponse =
            await handleInitiateCASRequest(
              initiateKarvyCASForm?.value,
              'karvy',
            );

          console.log(
            'handleInitiateCASRequestResponse in email and phone------Karvy: ',
            prettifyJSON(handleInitiateCASRequestResponse),
          );
          setLoadingText(null);
          setAction(handleInitiateCASRequestResponse);
        }
      } catch (error) {
        initiateKarvyCASForm.setErrors({
          error: [`${error?.message?.errors?.error}`],
        });
        setAction('request_using_custom');
        setLoadingText(null);
        throw error;
      }
    })();
  }, [initiateKarvyCASForm?.value, currentStep]);

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
            activeStep={currentStep}
            skippedSteps={skippedSteps}
            completedSteps={completedSteps}
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
          {/* {action?.message?.includes('html') ? (
            <WebViewComponent
              html={action?.message}
              containerStyle={{height: '100%', marginTop: 24}}
              loaderComponent={() => <Loader />}
            />
          ) : null} */}

          {currentStep === 0 && action === 'request_using_custom' ? (
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
                  setAction('skip_cams');
                  setSkippedSteps(prevStep => [...prevStep, 0]);
                  setLoadingText(KARVY_REQUEST_TEXT);
                  incrementCurrentStep();
                }
              }}
              onError={nextAction => {
                setLoadingText(KARVY_REQUEST_TEXT);
                incrementCurrentStep();
                setAction('skip_cams');
                setSkippedSteps(prevStep => [...prevStep, 0]);
              }}
              onSkip={() => {
                setAction('skip_cams');
                setSkippedSteps(prevStep => [...prevStep, 0]);
              }}
            />
          ) : currentStep === 0 && action === 'ask_for_otp' ? (
            <CAMSOTPVerification
              onSubmit={nextAction => {
                if (!nextAction) {
                  setLoadingText(null);
                } else {
                  setAction('karvy_auto_check');
                  setLoadingText(KARVY_REQUEST_TEXT);
                  setCompletedSteps(prevStep => [...prevStep, 0]);
                }
              }}
              onError={nextAction => {
                incrementCurrentStep();
                setAction('karvy_auto_check');
                setLoadingText(KARVY_REQUEST_TEXT);
                setSkippedSteps(prevStep => [...prevStep, 0]);
              }}
              payload={initiateCAMSCASForm?.value}
              onRequestResendOTP={status => {
                if (status === true) {
                  setLoadingText(CAMS_REQUEST_TEXT);
                } else {
                  setLoadingText(null);
                }
              }}
            />
          ) : null}

          {currentStep === 1 && action === 'request_using_custom' ? (
            <CollectMobileAndEmailForKarvy
              onLoading={status => {
                console.log(
                  'CollectMobileAndEmailForKarvy->onLoading->status: ',
                  status,
                );
                if (status === true) {
                  setLoadingText(KARVY_REQUEST_TEXT);
                } else {
                  setLoadingText(null);
                }
              }}
              errorMsg={initiateKarvyCASForm.errors.get('error')?.[0]}
              onSubmit={nextAction => {
                if (nextAction === 'ask_for_otp') {
                  setAction(nextAction);
                  setLoadingText(null);
                } else if (nextAction === 'skip') {
                  setLoadingText(null);
                  incrementCurrentStep();
                  setAction('skip_karvy');
                  setSkippedSteps(prevStep => [...prevStep, 1]);
                  navigation.replace('Protected');
                }
              }}
              onError={nextAction => {
                setLoadingText(null);
                incrementCurrentStep();
                setSkippedSteps(prevStep => [...prevStep, 1]);
                setAction('skip_karvy');
                navigation.replace('Protected');
              }}
              onSkip={() => {
                setSkippedSteps(prevStep => [...prevStep, 1]);
                setLoadingText(null);
                setAction('skip_karvy');
                navigation.replace('Protected');
              }}
            />
          ) : currentStep === 1 && action === 'ask_for_otp' ? (
            <KarvyOTPVerification
              onSubmit={nextAction => {
                setAction(null);
                if (!nextAction) {
                  console.log(
                    'KarvyOTPVerification->!nextAction: ',
                    nextAction,
                  );
                  setLoadingText(null);
                } else {
                  setCompletedSteps(prevStep => [...prevStep, 1]);
                  setLoadingText(null);
                  navigation.replace('Protected');
                }
              }}
              onError={nextAction => {
                incrementCurrentStep();
                setAction(null);
                setLoadingText(null);
                setSkippedSteps(prevStep => [...prevStep, 1]);
                navigation.replace('Protected');
              }}
              payload={initiateKarvyCASForm?.value}
              onRequestResendOTP={status => {
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
      <OverLayLoader
        loading={loadingText !== null}
        backdropOpacity={0.5}
        text={loadingText || ''}
      />
    </ScreenWrapper>
  );
}
