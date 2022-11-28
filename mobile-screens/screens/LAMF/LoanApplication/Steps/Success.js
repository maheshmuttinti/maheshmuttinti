/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import ScreenWrapper from '../../../../hocs/screen_wrapper';
import {useTheme} from 'theme';
import {Heading, OutlinedButton} from 'uin';
import {View} from 'react-native';
import {LoanSuccessBanner} from 'assets';
import useLayoutBackButtonAction from '../../../../reusables/useLayoutBackButtonAction';

export default function ({navigation}) {
  const theme = useTheme();
  useLayoutBackButtonAction(null, null, true);

  return (
    <ScreenWrapper>
      <View style={{paddingHorizontal: 24, paddingTop: 70}}>
        <View
          style={{
            paddingHorizontal: 8,
          }}>
          <LoanSuccessBanner />
          <View style={{paddingTop: 40}}>
            <Heading
              style={{
                textAlign: 'center',
                color: theme.colors.text,
                ...theme.fontSizes.heading5,
                fontWeight: theme.fontWeights.moreBold,
              }}>
              You have succesfully completed your loan application. Your
              documents are being verified. Please check notifications for
              futher updates
            </Heading>
          </View>
        </View>
        <View style={{paddingTop: 54}}>
          <OutlinedButton
            onPress={() => {
              navigation.navigate('Protected', {screen: 'LoanDashboard'});
            }}
            outlineColor="#003AC9"
            textStyles={{color: '#003AC9'}}>
            Apply for another Loan
          </OutlinedButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}
