/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import {Stepper, useStepper} from 'uin';
import SplashScreen from 'react-native-splash-screen';
import {BlueDotCircle, GreyCircle, GreenTickCircleSmall} from 'assets';
import {useTheme} from 'theme';
import {CollectMobileAndEmail} from './CAMSVerification/CollectMobileAndEmail';
import ScreenWrapper from '../../hocs/screen_wrapper';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 16;
const ICON_WIDTH = 16;

export default function () {
  const theme = useTheme();
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {incrementCurrentStep, decrementCurrentStep, currentStep} =
    useStepper();

  return (
    <ScreenWrapper style={{backgroundColor: SCREEN_BACKGROUND_COLOR}}>
      <View style={{paddingHorizontal: 24, flex: 1}}>
        <View style={{marginTop: 40}}>
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
          <CollectMobileAndEmail onSubmit={() => incrementCurrentStep()} />
        </View>
      </View>
    </ScreenWrapper>
  );
}
