/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {TextButton, BaseButton} from 'uin';
import {BackArrow, RecheckPortfolio} from 'assets';

export default function ({navigation}) {
  const theme = useTheme();

  const wrapperStyle = {
    paddingHorizontal: 24,
    alignItems: 'center',
  };

  const recheckPortfolioWrapperStyle = {
    paddingTop: 68,
  };

  const headingStyle = {
    ...theme.fontSizes.heading4,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryBlue,
    paddingTop: 32,
    textAlign: 'justify',
  };

  const descriptionTextStyle = {
    ...theme.fontSizes.medium,
    fontFamily: theme.fonts.regular,
    color: theme.colors.greyscale750,
    paddingTop: 24,
    textAlign: 'justify',
  };

  const textWrapperStyle = {
    marginTop: 37.85,
    alignItems: 'center',
  };

  const actionsWrapperStyle = {
    paddingTop: 47,
    width: '100%',
  };

  const orangeButtonWrapperStyle = {marginBottom: 16, height: 48};

  return (
    <ScreenWrapper backgroundColor={theme.colors.background}>
      <View style={{padding: 24}}>
        <TouchableOpacity
          hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
          onPress={() => navigation.canGoBack() && navigation.pop()}
          style={{flex: 0.3 / 4}}>
          <BackArrow />
        </TouchableOpacity>
      </View>
      <View style={{...wrapperStyle}}>
        <View style={{...recheckPortfolioWrapperStyle}}>
          <RecheckPortfolio />
        </View>

        <View style={{...textWrapperStyle}}>
          <Text style={{...headingStyle}}>Your Portfolio is Needed</Text>
          <Text style={{...descriptionTextStyle}}>
            Import Funds you’ve already invested in, so you can manage and track
            them on FinEzzy
          </Text>
        </View>

        <View style={{...actionsWrapperStyle}}>
          <BaseButton
            gradientColors={[
              theme.colors.primaryOrange,
              theme.colors.primaryOrange700,
            ]}
            wrapperStyles={{...orangeButtonWrapperStyle}}
            textStyles={{}}
            onPress={() => {
              navigation.navigate('FetchCAS', {
                screen: 'FetchCASFromRTAs',
                params: {
                  refreshableCASDataProvidersForNBFC: ['cams', 'karvy'],
                },
              });
            }}
            gradientReverse={true}
            bgColor={theme.colors.primaryOrange}
            textColor={theme.colors.primary}>
            Fetch CAS
          </BaseButton>
          <View
            style={{
              alignItems: 'center',
              paddingTop: 8,
              paddingBottom: 32,
            }}>
            <TextButton
              onPress={() => navigation.replace('Protected')}
              style={{
                ...theme.fontSizes.medium,
                fontWeight: theme.fontWeights.moreBold,
                fontFamily: theme.fonts.regular,
              }}>
              Explore Funds Now. I will import Later
            </TextButton>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
