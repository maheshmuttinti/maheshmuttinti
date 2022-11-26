/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {CustomKeyboard} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {requestResetPassword} from 'services';
import {prettifyJSON} from 'utils';
import {useTheme} from 'theme';
import {KeyboardDoneIcon, KeyboardDeleteIcon} from 'assets';
import useUser from '../../../reusables/useUser';

export default function ({navigation, route}) {
  const [confirmMpin, setConfirmMpin] = useState('');
  const [confirmMpinError, setConfirmMpinError] = useState('');
  const theme = useTheme();
  const pinScreenRef = React.useRef(null);
  const mpin = route?.params?.mpin;

  const user = useUser();

  const requestResetPasswordCallback = async () => {
    try {
      setConfirmMpinError('');
      if (confirmMpin === mpin) {
        console.log('user', user);
        const mobileNumberAttribute = user?.attributes?.find(
          item => item.type === 'mobile_number',
        );
        console.log(
          'mobileNumberAttribute',
          prettifyJSON(mobileNumberAttribute),
        );
        const requestResetPasswordPayload = {
          ...mobileNumberAttribute,
        };
        console.log(
          'requestResetPasswordPayload while logged in user enters the pin',
          prettifyJSON(requestResetPasswordPayload),
        );
        const requestResetPasswordResponse = await requestResetPassword(
          requestResetPasswordPayload,
        );
        console.log('response', prettifyJSON(requestResetPasswordResponse));
        if (
          requestResetPasswordResponse?.message ===
          'Request for verification successfully'
        ) {
          console.log('success');
          navigation.navigate('Auth', {
            screen: 'VerifyOTPForResetPIN',
            params: {
              userAttributes: {...mobileNumberAttribute},
              newPin: confirmMpin,
            },
          });
        }
      } else {
        console.log('got it mannnnn', mpin, confirmMpin);
        setConfirmMpinError('Pin should match');
      }
    } catch (err) {
      console.log('error while calling reset request otp', err);
    }
  };

  console.log('confirmMpinError', confirmMpinError);

  return (
    <AuthWrapper>
      <View>
        <CustomKeyboard
          onRef={() => pinScreenRef}
          keyDown={pin => setConfirmMpin(pin)}
          numberOfPins={4}
          numberOfPinsActive={2}
          taglineStyle={{
            fontFamily: theme.fonts.regular,
            color: theme.colors.text,
            fontSize: theme.fontSizes.heading4.fontSize,
          }}
          theme={theme}
          keyTextStyle={{
            backgroundColor: theme.colors.greyscale25,
            width: 60,
            height: 60,
            borderRadius: 60 / 2,
            paddingTop: 30,
            fontFamily: theme.fonts.semibold,
            fontWeight: theme.fontWeights.moreBold,
            fontSize: 30,
            lineHeight: 18,
          }}
          tagline="Confirm 4-digit pin"
          pinActiveStyle={{
            backgroundColor: theme.colors.primaryOrange,
            borderWidth: 0,
          }}
          errorStyle={{
            backgroundColor: 'transparent',
            bottom: 16,
            fontFamily: theme.fonts.regular,
          }}
          errorTextStyle={{
            color: theme.colors.error,
            fontFamily: theme.fonts.regular,
          }}
          errorText={confirmMpinError}
          keyStyle={{
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: 50,
          }}
          keyboardRowStyle={{marginBottom: 16}}
          keyboard={[
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [
              <View
                style={
                  Platform.OS === 'ios' && {
                    transform: [{translateY: 2.5}, {scale: 0.98}],
                  }
                }>
                <KeyboardDeleteIcon />
              </View>,
              0,
              <View
                style={
                  Platform.OS === 'ios' && {
                    transform: [{translateY: 2.5}, {scale: 0.98}],
                  }
                }>
                <KeyboardDoneIcon />
              </View>,
            ],
          ]}
          rippleContainerBorderRadius={50}
          onEnterPress={() => requestResetPasswordCallback()}
        />
      </View>
    </AuthWrapper>
  );
}
