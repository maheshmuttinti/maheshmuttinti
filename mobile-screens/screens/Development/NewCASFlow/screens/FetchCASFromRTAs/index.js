/* eslint-disable react-native/no-inline-styles */
import {Pressable, View, Text} from 'react-native';
import React, {useState, useMemo} from 'react';
import {Stepper, useStepper} from 'uin';
import {
  BlueDotCircle,
  GreyCircle,
  GreenTickCircleSmall,
  BackArrow,
} from 'assets';
import {useTheme} from 'theme';
import ScreenWrapper from '../../../../../hocs/screen_wrapper';
import {CollectMobileAndEmail} from '../../components/FetchCASFromRTAs/CAMS/CollectMobileAndEmail';
import {OTPVerification as CAMSOTPVerification} from '../../components/FetchCASFromRTAs/CAMS/OTPVerification';
import {OTPVerification as KarvyOTPVerification} from '../../components/FetchCASFromRTAs/Karvy/OTPVerification';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export default function ({navigation}) {
  const [redirectToCAMSOTPVerification, setRedirectToCAMSOTPVerification] =
    useState(false);
  const theme = useTheme();

  const {incrementCurrentStep, decrementCurrentStep, currentStep, steps} =
    useStepper();
  const backArrowIconWrapperStyle = {
    paddingTop: 48,
  };

  const handleGoBack = () => {
    navigation.pop();
    // if (redirectToCAMSOTPVerification === true) {
    //   setRedirectToCAMSOTPVerification(false);
    // } else if (!redirectToCAMSOTPVerification && currentStepToShow === 2) {
    //   setRedirectToCAMSOTPVerification(true);
    //   decrementCurrentStep();
    // }
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
            (redirectToCAMSOTPVerification === false ? (
              <CollectMobileAndEmail
                onSubmit={() => {
                  setRedirectToCAMSOTPVerification(true);
                }}
              />
            ) : (
              <CAMSOTPVerification
                onSubmit={() => {
                  setRedirectToCAMSOTPVerification(false);
                  incrementCurrentStep();
                }}
              />
            ))}

          {!redirectToCAMSOTPVerification && currentStepToShow === 2 && (
            <KarvyOTPVerification onSubmit={() => incrementCurrentStep()} />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
