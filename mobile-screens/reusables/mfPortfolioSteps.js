/* eslint-disable react-native/no-inline-styles */
import {View, Text, Pressable, Alert, Platform} from 'react-native';
import React from 'react';
import {
  Forward,
  Fax,
  HorizontalOrangeLineLong,
  Report,
  HorizontalOrangeLineShort,
  Copy,
} from 'assets';
import {useTheme} from 'theme';
import Clipboard from '@react-native-clipboard/clipboard';
import {showAndroidToast} from 'utils';
import Config from 'react-native-config';

export default function ({...props}) {
  const theme = useTheme();

  const greyTextColorStyle = {
    color: theme.colors.greyscale750,
    ...theme.fontSizes.medium,
    fontFamily: theme.fonts.regular,
  };

  const handleCopy = () => {
    Clipboard.setString(Config.RADICAL_SUPPORT_URL);
    Platform.OS === 'ios'
      ? Alert.alert('Copied Successfully')
      : showAndroidToast('Copied Successfully');
  };

  return (
    <View style={{marginTop: 24, marginRight: 24, ...props.wrapperStyles}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{paddingRight: 16}}>
          <View
            style={{
              backgroundColor: theme.colors.primaryYellow100,
              padding: 4,
              borderRadius: 100,
            }}>
            <Fax />
          </View>
          <View style={{alignItems: 'center', marginTop: 8}}>
            <HorizontalOrangeLineLong />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={{...greyTextColorStyle}}>
            You will receive the MF statements on your E-Mail{' '}
            <Text
              style={{
                ...greyTextColorStyle,
                color: theme.colors.text,
                fontFamily: theme.fonts.bold,
              }}>
              donotreply@camsonline.com
            </Text>{' '}
            from with subject Consolidated Account Statement- CAMS Mailback
            Request
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{paddingRight: 16}}>
          <View
            style={{
              backgroundColor: theme.colors.primaryYellow100,
              padding: 4,
              borderRadius: 100,
            }}>
            <Forward />
          </View>
          <View style={{alignItems: 'center', marginTop: 8}}>
            <HorizontalOrangeLineShort />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={{...greyTextColorStyle}}>
            Please forward the statements to{' '}
            <Text
              style={{
                ...greyTextColorStyle,
                color: theme.colors.text,
                fontFamily: theme.fonts.bold,
              }}>
              {Config.RADICAL_SUPPORT_URL}
            </Text>
          </Text>
          <View
            style={{
              paddingTop: 5.25,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Pressable onPress={() => handleCopy()}>
              <Copy />
            </Pressable>
            <Text style={{...greyTextColorStyle, paddingLeft: 9.5}}>
              Copy Email Id
            </Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={{paddingRight: 16}}>
          <View
            style={{
              backgroundColor: theme.colors.primaryYellow100,
              padding: 4,
              borderRadius: 100,
            }}>
            <Report />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={{...greyTextColorStyle}}>
            Track and analyse your portfolio on FinEzzy.
          </Text>
        </View>
      </View>
    </View>
  );
}
