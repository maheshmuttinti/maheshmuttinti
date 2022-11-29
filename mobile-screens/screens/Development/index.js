/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import {BaseButton, Stepper, useStepper} from 'uin';
import SplashScreen from 'react-native-splash-screen';
import {RadioCircleFill, RadioCircleOutline} from 'assets';

export default function () {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {incrementCurrentStep, decrementCurrentStep, currentStep} =
    useStepper();

  return (
    <View style={{marginTop: 32, flex: 1, paddingHorizontal: 24}}>
      <Stepper
        headerComponent={() => <RadioCircleOutline />}
        activeHeaderComponent={() => <RadioCircleFill />}
        activeLineColor="blue"
        hideDefaultHeader={true}
        wrapperPadding={24}
        stepLabelStyle={{color: 'green'}}
        activeStep={'second'}>
        <Stepper.Steps>
          <Stepper.Step id="first" name="Step 1" />
          <Stepper.Step id="second" name="Step 2" />
          <Stepper.Step id="third" name="Step 3" />
          <Stepper.Step id="four" name="Step 4" />
        </Stepper.Steps>
      </Stepper>
      <View style={{flexDirection: 'row', marginTop: 24}}>
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
      </View>
    </View>
  );
}
