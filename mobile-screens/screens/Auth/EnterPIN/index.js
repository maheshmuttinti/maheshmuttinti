/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {View, BackHandler, Platform} from 'react-native';
import {TextButton, CustomKeyboard} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, getUser} from 'services';
import {useDispatch} from 'react-redux';
import {setTokens, setIsUserLoggedInWithMPIN} from 'store';
import {useTheme} from 'theme';
import {KeyboardDeleteIcon, KeyboardDoneIcon} from 'assets';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';
import OverLayLoader from '../../../reusables/loader';
import {sleep} from 'utils';

export default function ({navigation, route}) {
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  const goBack = () => {
    BackHandler.exitApp();
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', goBack);
    };
  }, []);

  const {handleRedirection} = useOnboardingHandleRedirection();

  const handleValidateMPIN = async () => {
    try {
      setLoading(true);
      const userProfile = await getUser();
      setError('');
      if (mpin?.length === 4) {
        const loginPayload = {
          ...userProfile?.attributes[0],
          password: mpin,
        };

        const loginResponse = await login(loginPayload);
        if (loginResponse) {
          await AsyncStorage.setItem(
            '@access_token',
            JSON.stringify({
              accessToken: loginResponse?.access_token,
            }),
          );
          dispatch(setTokens(loginResponse));
          dispatch(setIsUserLoggedInWithMPIN(true));
          await handleRedirection(userProfile);
          setError('');
          await sleep(1000);
          setLoading(false);
        } else {
          setLoading(false);
          setError('Invalid PIN');
        }
      } else {
        setLoading(false);
        setError('Enter 4 Digits to Continue');
      }
    } catch (err) {
      setLoading(false);
      setError('Invalid PIN');
      console.log('error', err);
    }
  };

  useEffect(() => {
    if (mpin?.length === 4) {
      handleValidateMPIN();
    }
  }, [mpin]);

  const pinScreenRef = useRef(null);

  return (
    <AuthWrapper showBackArrowIcon={false}>
      <OverLayLoader loading={loading} backdropOpacity={0.5} />
      <View>
        <CustomKeyboard
          onRef={() => pinScreenRef?.current}
          keyDown={pin => setMpin(pin)}
          numberOfPins={4}
          numberOfPinsActive={2}
          taglineStyle={{
            fontFamily: theme.fonts.bold,
            color: theme.colors.text,
            fontSize: theme.fontSizes.heading4.fontSize,
          }}
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
          tagline="Enter 4-digit pin"
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
                <KeyboardDoneIcon
                  fill={mpin?.length === 4 && theme.colors.primaryBlue}
                />
              </View>,
            ],
          ]}
          rippleContainerBorderRadius={50}
          navigation={navigation}
          errorText={error}
          pinErrorStyle={{borderColor: theme.colors.error}}
          ItemFooter={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 48,
              }}>
              <TextButton
                onPress={() => {
                  navigation.navigate('PINSetup', {screen: 'ResetPINHome'});
                }}>
                Reset Pin
              </TextButton>
            </View>
          }
          // onEnterPress={() => handleValidateMPIN()}
        />
      </View>
    </AuthWrapper>
  );
}
