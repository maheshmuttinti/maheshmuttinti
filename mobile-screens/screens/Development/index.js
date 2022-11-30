/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import {BaseButton, Stepper, useStepper} from 'uin';
import SplashScreen from 'react-native-splash-screen';
import {RadioCircleFill, RadioCircleOutline, TickCircle} from 'assets';
import Test from './Test';
import {useTheme} from 'theme';

const SCREEN_BACKGROUND_COLOR = 'white';
const ICON_HEIGHT = 30;
const ICON_WIDTH = 30;

export default function () {
  const theme = useTheme();
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {incrementCurrentStep, decrementCurrentStep, currentStep} =
    useStepper();

  return (
    <View style={{backgroundColor: SCREEN_BACKGROUND_COLOR, flex: 1}}>
      <Test />
      <View style={{marginTop: 40}}>
        <Stepper
          iconHeight={ICON_HEIGHT}
          iconWidth={ICON_WIDTH}
          iconBackgroundColor={SCREEN_BACKGROUND_COLOR}
          notSelectedComponent={() => <RadioCircleOutline />}
          checkedComponent={() => <TickCircle />}
          selectedComponent={() => <RadioCircleFill />}
          activeLineColor="blue"
          checkedLabelColor={theme.colors.primaryBlue}
          selectedLabelColor="black"
          notSelectedLabelColor="grey"
          hideDefaultHeader={false}
          wrapperPadding={24}
          activeStep={2}
          capitalizeLabel={true}>
          <Stepper.Steps>
            <Stepper.Step id="first" name="Holdings- Cams" />
            <Stepper.Step id="second" name="Holdings- Karvy" />
            <Stepper.Step id="third" name="LIEN MARK- CAMS" />
            <Stepper.Step id="four" name="LIEN MARK- Karvy" />
          </Stepper.Steps>
        </Stepper>
        {/* <View style={{flexDirection: 'row', marginTop: 64}}>
          <BaseButton
            onPress={() => {
              decrementCurrentStep(currentStep - 1);
            }}
            style={{flex: 1 / 2, marginRight: 12}}>
            Previous Step
          </BaseButton>
          <BaseButton
            onPress={() => {
              incrementCurrentStep(currentStep + 1);
            }}
            style={{flex: 1 / 2}}>
            Next Step
          </BaseButton>
        </View> */}
      </View>
    </View>
  );
}
