/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useRef} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {setNetworkStatus, setHideIntro} from 'store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export default function ({
  scrollView = true,
  footer = false,
  backgroundColor = null,
  ...props
}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const redirectionFnRef = useRef(() => {});

  const fnRef1 = useRef(() => {});

  const {isSessionExpired} = useSelector(
    ({auth}) => ({
      isSessionExpired: auth.isSessionExpired,
    }),
    shallowEqual,
  );

  fnRef1.current = state => {
    dispatch(setNetworkStatus(state.isConnected ? 'online' : 'offline'));
    if (!state.isConnected) {
      navigation.navigate('EmptyStates', {screen: 'NoInternet'});
    }
  };

  redirectionFnRef.current = () => {
    if (isSessionExpired === true) {
      AsyncStorage.clear();
      dispatch(setHideIntro(true));
      (async () =>
        await AsyncStorage.setItem('@hide_intro', JSON.stringify(true)))();
      navigation.replace('Auth', {screen: 'SigninHome'});
    } else {
      return;
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      fnRef1.current(state);
    });
    redirectionFnRef.current();

    return () => unsubscribe();
  }, []);
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
