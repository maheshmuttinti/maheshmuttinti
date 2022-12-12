/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback} from 'react';
import {View} from 'react-native';
import {getUser, updateUserProfile} from 'services';
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
  const platform = route?.params?.platform;

  const getUserFnRef = useRef(() => {});

  const handleUpdateUser = async user => {
    try {
      let usernameType = 'non_gmail';
      if (platform === 'apple' || platform.includes('apple')) {
        usernameType = 'apple_id';
      } else if (platform === 'google' || platform.includes('google')) {
        usernameType = 'gmail';
      }
      const meta = {
        meta: {...user?.profile?.meta, username_type: usernameType},
      };
      const updateProfilePayload = {
        ...meta,
      };
      console.log(
        'social login redirection screen update profile payload',
        meta,
      );
      const updateProfileResponse = await updateUserProfile(
        updateProfilePayload,
      );
      if (updateProfileResponse) {
        console.log(
          'social login redirection screen update profile response',
          updateProfileResponse,
        );

        navigation.replace('Auth', {
          screen: 'ScreenDeterminor',
        });
      }
    } catch (err) {
      console.log('error', err);
    }
  };

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
        await AsyncStorage.setItem('@loggedin_status', JSON.stringify(true));
        const user = await getUser();
        dispatch(setUser(user));
        await handleUpdateUser(user);
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
