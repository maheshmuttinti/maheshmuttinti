/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Keyboard,
  View,
  Pressable,
} from 'react-native';
import {BackArrow} from 'assets';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'theme';
import {useDispatch} from 'react-redux';
import {setNetworkStatus} from 'store';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';

/**
 * @author
 * @function AuthScreenWrapper
 **/
const AuthScreenWrapper = ({children, showBackArrowIcon = true, ...props}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const fnRef1 = useRef(() => {});

  fnRef1.current = state => {
    dispatch(setNetworkStatus(state.isConnected ? 'online' : 'offline'));
    if (!state.isConnected) {
      navigation.navigate('EmptyStates', {screen: 'NoInternet'});
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      fnRef1.current(state);
    });

    return () => unsubscribe();
  }, []);

  const safeAreaViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...props.wrapperStyles,
  };
  const keyboardAvoidingViewStyles = {
    flex: 1,
    paddingHorizontal: 24,
    ...props.keyboardAvoidingViewStyles,
  };
  const touchableWithoutFeedbackStyle = {
    flex: 1,
  };
  const contentContainerStyle = {
    flexGrow: 1,
  };
  const backArrowIconWrapperStyle = {
    paddingBottom: 41.18,
    ...props.backArrowIconWrapperStyle,
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
      <KeyboardAvoidingView
        enabled
        style={{...keyboardAvoidingViewStyles}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{...touchableWithoutFeedbackStyle}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            style={{
              ...{
                flex: 1,
                width: '100%',
                paddingTop: 32,
                ...props.scrollViewStyles,
              },
            }}
            contentContainerStyle={{...contentContainerStyle}}
            keyboardShouldPersistTaps={'handled'}>
            <View
              style={{
                // marginBottom: 32,
                // paddingBottom: 42,
                ...props.childrenWrapperStyles,
              }}>
              <View style={{...backArrowIconWrapperStyle}}>
                {showBackArrowIcon ? (
                  <Pressable
                    hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
                    onPress={() => {
                      props.onBackPress
                        ? props.onBackPress()
                        : navigation.canGoBack() && navigation.pop();
                    }}
                    style={{width: 50}}>
                    <BackArrow />
                  </Pressable>
                ) : (
                  <></>
                  // height = <BackArrow /> icon height
                  // <View style={{height: 24}} />
                )}
              </View>
              {children}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreenWrapper;
