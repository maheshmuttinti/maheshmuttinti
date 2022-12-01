/* eslint-disable react-native/no-inline-styles */
import {Pressable, View} from 'react-native';
import React from 'react';
import {Stepper, useStepper} from 'uin';
import SplashScreen from 'react-native-splash-screen';
import {
  BlueDotCircle,
  GreyCircle,
  GreenTickCircleSmall,
  BackArrow,
} from 'assets';
import {useTheme} from 'theme';
import {CollectMobileAndEmail} from './CAMSVerification/CollectMobileAndEmail';
import ScreenWrapper from '../../hocs/screen_wrapper';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export default function ({navigation}) {
  const theme = useTheme();
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {incrementCurrentStep, decrementCurrentStep, currentStep, steps} =
    useStepper();
  const backArrowIconWrapperStyle = {
    // paddingBottom: 41.18,
    paddingTop: 48,
  };
  return (
    <ScreenWrapper style={{backgroundColor: SCREEN_BACKGROUND_COLOR}}>
      <View style={{paddingHorizontal: 24, flex: 1}}>
        <View style={{...backArrowIconWrapperStyle}}>
          <Pressable
            hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
            onPress={() => {
              navigation.canGoBack() && navigation.pop();
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
            hideDefaultHeader={false}
            activeStep={0}
            capitalizeLabel={true}>
            <Stepper.Steps>
              <Stepper.Step id="first" name="CAMS" />
              <Stepper.Step id="second" name="KARVY" />
            </Stepper.Steps>
          </Stepper>
        </View>
        <View style={{marginTop: 64, flex: 1}}>
          <CollectMobileAndEmail
            onSubmit={() => incrementCurrentStep()}
            currentStep={
              currentStep + 1 > steps?.length ? steps.length : currentStep + 1
            }
            totalSteps={steps?.length}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
