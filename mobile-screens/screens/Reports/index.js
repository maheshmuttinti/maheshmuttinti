/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, BackHandler} from 'react-native';
import * as React from 'react';
import {useCallback, useRef} from 'react';
import ScreenWrapper from '../../hocs/screenWrapper';
import {Heading, LabelValue} from 'uin';
import {BackArrow} from 'assets';
import {useTheme} from 'theme';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import DummyGraphSection from './DummyGraphSection';
import ExtraAddons from '../Dashboard/ExtraAddons';

export default function () {
  const theme = useTheme();
  const navigation = useNavigation();

  const goBack = useRef(() => {});
  goBack.current = () => {
    navigation.jumpTo('Home');
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', goBack.current);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', goBack.current);
      };
    }, []),
  );

  return (
    <ScreenWrapper backgroundColor={theme.colors.primaryBlue}>
      <View
        style={{
          paddingTop: 24,
          marginBottom: 30,
          paddingHorizontal: 19,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0.5 / 3,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.jumpTo('Home');
              }}
              hitSlop={{top: 5, left: 5, right: 5, bottom: 10}}>
              <BackArrow fill={theme.colors.background} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'center',
              flex: 2 / 3,
            }}>
            <Heading
              style={{
                textAlign: 'center',
                fontWeight: theme.fontWeights.veryBold,
              }}>
              Reports
            </Heading>
          </View>
        </View>
      </View>

      <View style={{alignItems: 'center'}}>
        <DummyGraphSection />
      </View>

      <View
        style={{
          marginTop: 35,
          flex: 1,
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 24,
        }}>
        <Heading
          style={{
            color: theme.colors.text,
            fontWeight: theme.fontWeights.veryBold,
            paddingTop: 24,
          }}>
          Let’s get to know your Portfolio a little more
        </Heading>
        <LabelValue
          title="Risk Score"
          titleStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.heading5,
          }}
          value={
            'An investor’s risk is represented by a number between 1 (low risk) and 10 (high risk) on their user page. This is their Risk Score.'
          }
          valueStyle={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            marginTop: 8,
          }}
          style={{
            marginTop: 34,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: theme.colors.greyscale600,
          }}
        />
        <LabelValue
          title="Max Dropdown %"
          titleStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.heading5,
          }}
          value={
            'A maximum drawdown (MDD) is the maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained. Maximum drawdown is an indicator of downside risk over a specified time period.'
          }
          valueStyle={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            marginTop: 8,
          }}
          style={{
            marginTop: 34,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: theme.colors.greyscale600,
          }}
        />
        <LabelValue
          title="Overlap %"
          titleStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.heading5,
          }}
          value={
            'Fund overlap can reduce portfolio diversification and create concentrated positions, often with the investor largely unaware.'
          }
          valueStyle={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            marginTop: 8,
          }}
          style={{
            marginTop: 34,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: theme.colors.greyscale600,
          }}
        />
        <ExtraAddons wrapperStyles={{paddingTop: 24}} />

        <View style={{marginBottom: 74}} />
      </View>
    </ScreenWrapper>
  );
}
