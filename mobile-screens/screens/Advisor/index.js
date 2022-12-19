/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity} from 'react-native';
import * as React from 'react';
import {useRef} from 'react';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {Heading} from 'uin';
import {BackArrow, RiskBot} from 'assets';
import {useTheme} from 'theme';
import {useNavigation} from '@react-navigation/native';
import MoreFunds from '../Dashboard/MoreFunds';

export default function () {
  const theme = useTheme();
  const navigation = useNavigation();

  const goBack = useRef(() => {});
  goBack.current = () => {
    navigation.jumpTo('Home');
  };

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
              Advisor
            </Heading>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 24,
        }}>
        <View style={{alignItems: 'center'}}>
          <RiskBot />
          <Heading
            style={{
              ...theme.fontSizes.heading5,
              color: theme.colors.text,
              paddingTop: 24,
              fontWeight: theme.fontWeights.veryBold,
              textAlign: 'center',
            }}>
            Let’s get to know what kind of investor you are
          </Heading>
          <Heading
            style={{
              ...theme.fontSizes.medium,
              color: theme.colors.text,
              paddingTop: 24,
              textAlign: 'center',
              marginBottom: 24,
            }}>
            You are unique. So are your needs. At FinEzzy, we diagnose your
            needs and advise accordingly. Not only is it stitched to fit you for
            now, but forever!
          </Heading>
        </View>

        <MoreFunds />
        <View style={{marginBottom: 64}} />
      </View>
    </ScreenWrapper>
  );
}
