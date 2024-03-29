/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  OnboardingSVGFour,
  OnboardingSVGOne,
  OnboardingSVGThree,
  OnboardingSVGTwo,
} from 'assets';
import {useTheme} from 'theme';
import PromoSlider from './PromoSlider';
import {View, Text, Dimensions} from 'react-native';
import {RoundedFilledButton} from 'uin';
import {Arrow} from 'assets';
import * as Sentry from '@sentry/react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setShowIntro} from 'store';

const {width} = Dimensions.get('window');

export default function ({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('*******AppPromo Stack Mounted****');
    return () => {
      console.log('*******AppPromo Stack UnMounted****');
    };
  }, []);

  const theme = useTheme();
  const propData = {
    sourceType: 'SVG',
    navigateTo: 'SignupWithEmailAndPhoneNumber',
    defaultTint: 'white',
    selectedTint: 'white',
    buttonStyle: {
      fontSize: 15,
      color: 'red',
      textAlign: 'right',
    },
    DATA: [
      {
        id: 0,
        bannerImage: <OnboardingSVGOne />,
        text: (
          <Text
            style={{
              color: theme.colors.background,
              fontWeight: '800',
              width: 287,
              fontFamily: theme.fonts.regular,

              // marginLeft: width >= 360 ? 24 : 0,
              marginTop: 16,
              ...theme.fontSizes.heading3,
              // transform: [{scale: width >= 360 ? 0.95 : 0.85}],
            }}>
            Personal Finance will now be truly personal{' '}
          </Text>
        ),
      },
      // {
      //   id: 1,
      //   bannerImage: <OnboardingSVGTwo />,
      //   text: (
      //     <Text
      //       style={{
      //         color: theme.colors.background,
      //         fontWeight: '800',
      //         width: 287,
      //         fontFamily: theme.fonts.regular,
      //         marginTop: 16,
      //         ...theme.fontSizes.heading3,
      //       }}>
      //       Personal Finance will now be truly personal{' '}
      //     </Text>
      //   ),
      // },
      // {
      //   id: 2,
      //   bannerImage: <OnboardingSVGThree />,
      //   text: (
      //     <Text
      //       style={{
      //         color: theme.colors.background,
      //         fontWeight: '800',
      //         width: 287,
      //         fontFamily: theme.fonts.regular,
      //         marginTop: 16,
      //         ...theme.fontSizes.heading3,
      //       }}>
      //       Personal Finance will now be truly personal{' '}
      //     </Text>
      //   ),
      // },
      // {
      //   id: 3,
      //   bannerImage: <OnboardingSVGFour />,
      //   text: (
      //     <Text
      //       style={{
      //         color: theme.colors.background,
      //         fontWeight: '800',
      //         width: 287,
      //         fontFamily: theme.fonts.regular,
      //         marginTop: 16,
      //         ...theme.fontSizes.heading3,
      //       }}>
      //       Personal Finance will now be truly personal{' '}
      //     </Text>
      //   ),
      // },
    ],
  };

  const handleSubmit = async () => {
    try {
      dispatch(setShowIntro(false));
      await AsyncStorage.setItem('@show_app_promo', JSON.stringify(false));
      return navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
    } catch (error) {
      Sentry.captureException(error);
    }
  };
  return (
    <View
      style={{
        paddingTop: 59,
        flex: 1,
        backgroundColor: theme.colors.primaryBlue,
        justifyContent: 'center',
      }}>
      <PromoSlider
        extraData={propData}
        navigation={navigation}
        onSkipTapped={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
        dotsContainerStyle={{
          flex: 1,
          width: '100%',
        }}
        footerStyle={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        pageControlStyle={{
          flex: 1 / 2,
          alignSelf: 'center',
          width: '100%',
          paddingLeft: 24,
          top: -24,
        }}
        skipSlideShowStyle={{
          flex: 1 / 2,
          justifyContent: 'center',
          width: '100%',
          left: width <= 320 ? 34 : 44,
          top: -42,
        }}
        footerButton={
          <RoundedFilledButton
            onPress={async () => {
              await handleSubmit();
            }}
            bgColor="#FF5500"
            textColor="#ffffff">
            <Arrow stroke="#fff" />
          </RoundedFilledButton>
        }
      />
    </View>
  );
}
