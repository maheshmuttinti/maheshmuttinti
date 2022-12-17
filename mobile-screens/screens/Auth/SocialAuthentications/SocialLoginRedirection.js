/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback} from 'react';
import {View} from 'react-native';
import {getUser} from 'services';
import {setTokens, setUser} from 'store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'theme';
import {AnimatedEllipsis} from 'uin';
import * as Sentry from '@sentry/react-native';

export default function ({navigation, route}) {
  const dispatch = useDispatch();

  const theme = useTheme();

  const accessToken = route?.params?.access_token;

  const getUserFnRef = useRef(() => {});

  getUserFnRef.current = async () => {
    try {
      Sentry.captureMessage(
        `AccessToken in SocialLoginRedirection ${accessToken}`,
      );
      if (accessToken) {
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: accessToken,
          }),
        );
        dispatch(setTokens({access_token: accessToken}));
        const user = await getUser();
        dispatch(setUser(user));

        const isMobileNumberExists = user?.attributes
          ?.map(item => item.type)
          ?.includes('mobile_number');

        console.log('isMobileNumberExists: ', isMobileNumberExists);
        if (!isMobileNumberExists) {
          console.log(
            '!isMobileNumberExists redirecting to EnterPhoneNumber: ',
            !isMobileNumberExists,
          );
          navigation.replace('Auth', {screen: 'EnterPhoneNumber'});
          console.log(
            '!isMobileNumberExists redirected to EnterPhoneNumber: ',
            !isMobileNumberExists,
          );
        } else {
          console.log('else condition of social login redirection.......');
          navigation.replace('General', {screen: 'ScreenDeterminer'});
        }
      }
    } catch (error) {
      console.log('error in getUserFnRef function', error);
      Sentry.captureException(JSON.stringify(error));
      navigation.replace('Auth', {
        screen: 'SigninHome',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserFnRef.current();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <AnimatedEllipsis dotSize={12} dotColor={theme.colors.primaryBlue} />
    </View>
  );
}
