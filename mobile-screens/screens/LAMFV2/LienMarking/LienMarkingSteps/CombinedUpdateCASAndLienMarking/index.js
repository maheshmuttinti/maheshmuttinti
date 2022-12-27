/* eslint-disable react-native/no-inline-styles */
import {Pressable, View, Text} from 'react-native';
import React from 'react';
import {Stepper} from 'uin';
import {
  BlueDotCircle,
  GreyCircle,
  GreenTickCircleSmall,
  BackArrow,
} from 'assets';
import {useTheme} from 'theme';
import ScreenWrapper from '../../../../../hocs/screenWrapperWithoutBackButton';
import {OTPVerification as UpdateCASCAMSOTPVerification} from '../components/UpdateCASFromRTAs/CAMS/OTPVerification';
import {OTPVerification as UpdateCASKarvyOTPVerification} from '../components/UpdateCASFromRTAs/Karvy/OTPVerification';
import {OTPVerification as CAMSRTALienMarkingOTPVerification} from '../components/RTAsLienMarking/CAMS/OTPVerification';
import {OTPVerification as KarvyRTALienMarkingOTPVerification} from '../components/RTAsLienMarking/Karvy/OTPVerification';
import {useLienMarkingRedirections} from './hooks/useLienMarkingRedirections';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export default function ({navigation, route}) {
  const refreshableCASDataProvidersForNBFC =
    route?.params?.refreshableCASDataProvidersForNBFC;
  const theme = useTheme();
  const {
    incrementCurrentStep,
    completedSteps,
    steps,
    skippedSteps,
    currentStep,
    setActiveStep,
    failedSteps,
    setCompletedSteps,
  } = useLienMarkingRedirections(refreshableCASDataProvidersForNBFC);
  const backArrowIconWrapperStyle = {
    paddingTop: 32,
  };

  const handleGoBack = () => {
    navigation.pop();
  };

  return (
    <ScreenWrapper style={{backgroundColor: SCREEN_BACKGROUND_COLOR}}>
      <View style={{paddingHorizontal: 24, flex: 1}}>
        <View style={{...backArrowIconWrapperStyle}}>
          <Pressable
            hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
            onPress={() => {
              handleGoBack();
            }}
            style={{width: 50}}>
            <BackArrow />
          </Pressable>
        </View>

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
          {currentStep === 0 ? (
            <UpdateCASCAMSOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
                setCompletedSteps(prevStep => [...prevStep, 0]);
              }}
            />
          ) : null}
          {currentStep === 1 ? (
            <UpdateCASKarvyOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
                setCompletedSteps(prevStep => [...prevStep, 1]);
              }}
            />
          ) : null}
          {currentStep === 2 ? (
            <CAMSRTALienMarkingOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
                setCompletedSteps(prevStep => [...prevStep, 2]);
              }}
            />
          ) : null}
          {currentStep === 3 ? (
            <KarvyRTALienMarkingOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
                setCompletedSteps(prevStep => [...prevStep, 3]);
              }}
            />
          ) : null}
        </View>
      </View>
    </ScreenWrapper>
  );
}
