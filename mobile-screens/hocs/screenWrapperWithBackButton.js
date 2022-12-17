/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useRef, useCallback} from 'react';
import {
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {useTheme} from 'theme';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {setNetworkStatus} from 'store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {useClearAsyncStorageKeys} from '../reusables/useClearAsyncStorageKeys';

export default function ({
  scrollView = true,
  footer = false,
  backgroundColor = null,
  ...props
}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleSessionExpired = useRef(() => {});
  const handleNoInternet = useRef(() => {});
  const {clearStoreForLogout} = useClearAsyncStorageKeys();

  const {isSessionExpired} = useSelector(
    ({auth}) => ({
      isSessionExpired: auth.isSessionExpired,
    }),
    shallowEqual,
  );

  handleNoInternet.current = state => {
    dispatch(setNetworkStatus(state.isConnected ? 'online' : 'offline'));
    if (!state.isConnected) {
      navigation.navigate('EmptyStates', {screen: 'NoInternet'});
    }
  };

  handleSessionExpired.current = async () => {
    if (isSessionExpired === true) {
      await clearStoreForLogout();
      await redirectBasedOnMobileNumberVerification();
    }
  };

  const redirectBasedOnMobileNumberVerification = async () => {
    const isMobileNumberVerifiedOnUserSessionExpire = JSON.parse(
      await AsyncStorage.getItem('@is_mobile_number_verified'),
    );
    console.log(
      'isMobileNumberVerifiedOnUserSessionExpire: ',
      isMobileNumberVerifiedOnUserSessionExpire,
    );
    if (isMobileNumberVerifiedOnUserSessionExpire !== null) {
      if (isMobileNumberVerifiedOnUserSessionExpire === true) {
        navigation.replace('Auth', {screen: 'SigninHome'});
      } else {
        navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
      }
    } else {
      navigation.replace('Auth', {screen: 'SignupWithSocialProviders'});
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        handleNoInternet.current(state);
      });

      return () => unsubscribe();
    }, []),
  );

  useEffect(() => {
    if (isSessionExpired === true) {
      handleSessionExpired.current();
    }
  }, [isSessionExpired]);

  const safeAreaViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...props.wrapperStyles,
  };

  return (
    <SafeAreaView
      style={
        Config.MOCK_ENVIRONMENT === 'STAGING' &&
        Config.ENVIRONMENT === 'PRODUCTION'
          ? {...safeAreaViewStyle, borderTopWidth: 10, borderTopColor: 'lime'}
          : Config.ENVIRONMENT === 'STAGING'
          ? {...safeAreaViewStyle, borderTopWidth: 10, borderTopColor: 'red'}
          : {...safeAreaViewStyle}
      }>
      <StatusBar barStyle={theme.barStyle} />
      <KeyboardAvoidingView
        enabled
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={0}>
        {scrollView ? (
          <ScrollView
            scrollIndicatorInsets={{
              right: 1,
            }}
            nestedScrollEnabled={true}
            contentInsetAdjustmentBehavior="automatic"
            style={{
              ...{
                flex: 1,
                backgroundColor: !backgroundColor
                  ? theme.colors.primary
                  : backgroundColor,
                width: '100%',
                borderColor: !backgroundColor
                  ? theme.colors.primary
                  : backgroundColor,
              },
              ...Platform.select({
                ios: {
                  shadowOffset: {width: 2, height: 2},
                  shadowColor: 'black',
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                },
              }),
            }}
            contentContainerStyle={{
              flexGrow: 1,
              marginBottom: 40,
              borderColor: theme.colors.primary,
            }}
            keyboardShouldPersistTaps={'handled'}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                borderColor: theme.colors.primary,
              }}>
              <>{props.children}</>
            </TouchableWithoutFeedback>
          </ScrollView>
        ) : !footer ? (
          <>
            <View>{props.children}</View>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {props.children}
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
