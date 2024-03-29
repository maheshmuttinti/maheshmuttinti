/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {Heading, BaseButton, Card} from 'uin';
import {View, Text} from 'react-native';
import {InfoIcon, RecheckPortfolio} from 'assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLinkedPAN} from 'services';

const UpdatePortfolio = ({navigation, route}) => {
  const theme = useTheme();
  const refreshableCASDataProvidersForNBFC = route?.params?.providers;
  console.log(
    'refreshableCASDataProvidersForNBFC in update portfolio screen: ',
    refreshableCASDataProvidersForNBFC,
  );

  const handleRedirect = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        const panResponse = await getLinkedPAN();

        const isPANLinked = panResponse?.pan && panResponse?.name;

        if (isPANLinked) {
          navigation.navigate('FetchCAS', {
            screen: 'FetchCASFromRTAs',
            params: {
              refreshableCASDataProvidersForNBFC,
              waitForResponse: true,
            },
          });
        } else {
          navigation.navigate('PANSetup', {
            screen: 'CollectPAN',
            params: {
              waitForResponse: true,
            },
          });
        }
      }
    } catch (err) {
      if (err?.error === 'PAN not linked') {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
      } else {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
      }
      throw err;
    }
  };

  return (
    <ScreenWrapper>
      <View style={{paddingHorizontal: 24, paddingTop: 40}}>
        <Heading
          style={{
            color: theme.colors.text,
            ...theme.fontSizes.heading4,
            fontWeight: theme.fontWeights.veryBold,
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
          <View style={{paddingTop: 16}}>
            <Heading
              style={{
                textAlign: 'center',
                color: theme.colors.text,
                ...theme.fontSizes.medium,
                lineHeight: 24.51,
                fontWeight: theme.fontWeights.bold,
              }}>
              You can now update your portfolio within seconds with just a OTP
              verification
            </Heading>
          </View>
        </View>
        <Card
          style={{
            backgroundColor: theme.colors.primaryBlue100,
            marginTop: 32,
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <InfoIcon fill={theme.colors.background} />
          </View>
          <View
            style={{
              paddingLeft: 17.25,
              marginRight: 16,
            }}>
            <Text
              style={{
                ...theme.fontSizes.small,
                fontWeight: theme.fontWeights.moreBold,
                color: theme.colors.background,
                fontFamily: theme.fonts.regular,
              }}>
              Please Note that you will be redirected to OTP Verification Page
            </Text>
          </View>
        </Card>

        <View style={{paddingTop: 24, paddingBottom: 56}}>
          <BaseButton
            onPress={() => {
              handleRedirect();
            }}
            gradientColors={[
              theme.colors.primaryOrange800,
              theme.colors.primaryOrange,
            ]}>
            Continue
          </BaseButton>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default UpdatePortfolio;
