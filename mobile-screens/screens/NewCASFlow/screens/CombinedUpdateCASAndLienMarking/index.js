/* eslint-disable react-native/no-inline-styles */
import {Pressable, View, Text} from 'react-native';
import React, {useMemo} from 'react';
import {Stepper, useStepper} from 'uin';
import {
  BlueDotCircle,
  GreyCircle,
  GreenTickCircleSmall,
  BackArrow,
} from 'assets';
import {useTheme} from 'theme';
import ScreenWrapper from '../../../../hocs/screen_wrapper';
import {OTPVerification as UpdateCASCAMSOTPVerification} from '../../components/UpdateCASFromRTAs/CAMS/OTPVerification';
import {OTPVerification as UpdateCASKarvyOTPVerification} from '../../components/UpdateCASFromRTAs/Karvy/OTPVerification';
import {OTPVerification as CAMSRTALienMarkingOTPVerification} from '../../components/RTAsLienMarking/CAMS/OTPVerification';
import {OTPVerification as KarvyRTALienMarkingOTPVerification} from '../../components/RTAsLienMarking/Karvy/OTPVerification';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export default function ({navigation}) {
  const theme = useTheme();

  const {incrementCurrentStep, decrementCurrentStep, currentStep, steps} =
    useStepper();
  const backArrowIconWrapperStyle = {
    paddingTop: 48,
  };

  const handleGoBack = () => {
    navigation.pop();
  };

  const currentStepToShow = useMemo(
    () => (currentStep + 1 > steps?.length ? steps.length : currentStep + 1),
    [currentStep, steps],
  );

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
            activeLineColor="blue"
            checkedLabelColor={theme.colors.primaryBlue}
            selectedLabelColor="black"
            notSelectedLabelColor="grey"
            hideDefaultHeader={true}
            activeStep={0}
            capitalizeLabel={true}
            labelTopSpace={10}>
            <Stepper.Steps>
              <Stepper.Step id="first" name="Holdings- Cams" />
              <Stepper.Step id="second" name="Holdings- Karvy" />
              <Stepper.Step id="third" name="LIEN MARK- CAMS" />
              <Stepper.Step id="four" name="LIEN MARK- Karvy" />
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
          {currentStepToShow === 1 && (
            <UpdateCASCAMSOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
              }}
            />
          )}
          {currentStepToShow === 2 && (
            <UpdateCASKarvyOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
              }}
            />
          )}
          {currentStepToShow === 3 && (
            <CAMSRTALienMarkingOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
              }}
            />
          )}
          {currentStepToShow === 4 && (
            <KarvyRTALienMarkingOTPVerification
              onSubmit={() => {
                incrementCurrentStep();
              }}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
