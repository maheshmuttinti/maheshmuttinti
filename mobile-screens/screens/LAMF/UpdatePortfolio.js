/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import ScreenWrapper from '../../hocs/screenWrapper';
import {useTheme} from 'theme';
import {Heading, BaseButton, TextButton} from 'uin';
import {View} from 'react-native';
import {RecheckPortfolio} from 'assets';
import MFPortfolioSteps from '../../reusables/mfPortfolioSteps';

const UpdatePortfolio = ({navigation}) => {
  const theme = useTheme();
  return (
    <ScreenWrapper>
      <View style={{paddingHorizontal: 24}}>
        <Heading
          style={{
            color: theme.colors.text,
            ...theme.fontSizes.heading4,
            fontWeight: theme.fontWeights.veryBold,
            paddingTop: 56,
          }}>
          Update Portfolio
        </Heading>

        <View
          style={{
            paddingHorizontal: 8,
            paddingTop: 32,
          }}>
          <RecheckPortfolio />
          <View style={{paddingTop: 24}}>
            <Heading
              style={{
                textAlign: 'center',
                color: theme.colors.text,
                fontSize: theme.fontSizes.heading6.fontSize,
                lineHeight: 24.51,
                fontWeight: theme.fontWeights.moreBold,
              }}>
              To ensure that you get the accurate loan amount, we need your
              updated MF portfolio.
            </Heading>
          </View>
        </View>

        <MFPortfolioSteps
          wrapperStyles={{
            marginRight: 0,
            paddingTop: 32,
          }}
        />

        <View style={{paddingTop: 32, paddingBottom: 56}}>
          <BaseButton
            onPress={() => {}}
            gradientColors={[
              theme.colors.primaryOrange800,
              theme.colors.primaryOrange,
            ]}>
            Open Email
          </BaseButton>
          <View style={{paddingTop: 16, alignItems: 'center'}}>
            <TextButton
              onPress={() => {
                navigation.navigate('Protected', {screen: 'UploadPortfolio'});
              }}
              textStyles={{
                ...theme.fontSizes.medium,
                fontWeight: theme.fontWeights.moreBold,
              }}>
              Upload Portfolio Manually
            </TextButton>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default UpdatePortfolio;
