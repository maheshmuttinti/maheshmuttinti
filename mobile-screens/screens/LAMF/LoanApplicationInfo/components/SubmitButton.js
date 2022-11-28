/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {BaseButton} from 'uin';
import {useTheme} from 'theme';

export const SubmitButton = ({navigation, loanData, navigateStep}) => {
  const theme = useTheme();
  const handleSubmit = () => {
    navigation.navigate('NextSteps', {
      applicationId: loanData?.uuid,
      step: navigateStep(loanData?.loan_application_step),
    });
  };
  return (
    <View
      style={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        paddingTop: 26,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: theme.colors.background,
      }}>
      <BaseButton onPress={handleSubmit}>Complete Application</BaseButton>
    </View>
  );
};
