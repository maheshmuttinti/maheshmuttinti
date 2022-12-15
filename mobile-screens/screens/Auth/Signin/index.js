/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useCallback, useRef, useEffect, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import {
  AuthHeading,
  BaseTextInput,
  BaseButton,
  TextButton,
  GoogleButton,
  GoogleAppleButton,
} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import {Separator, WarningIcon1, TickCircle} from 'assets';
import {NUMBER_MATCH_REGEX} from 'utils';
import {requestForLoginOTP, requestVerifyRegistration} from 'services';
import useBetaForm from '@reusejs/react-form-hook';
import {useTheme} from 'theme';
import {useFocusEffect} from '@react-navigation/native';
import Config from 'react-native-config';
import {useSocialLoginsHandler} from '../../../reusables/useSocialLoginsHandler';

export default function SignInScreen({navigation}) {
  const form = useBetaForm({
    type: 'email',
    value: '',
  });
  const theme = useTheme();
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [apiCallStatus, setApiCallStatus] = useState(null);

  const clearForm = useRef(() => {});
  const clearFormErrors = useRef(() => {});
  const setPhoneNumberTo10Digit = useRef(() => {});
  const showGreenTickCircleIcon = useRef(() => {});

  setPhoneNumberTo10Digit.current = () =>
    form.value.type === 'mobile_number' &&
    form.value.value.length >= 10 &&
    form.setField('value', form.value.value.slice(0, 10));

  showGreenTickCircleIcon.current = () =>
    form.value.type === 'mobile_number' &&
    form.value.value.length === 10 &&
    !isNaN(form.value.value)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  clearFormErrors.current = () => (form.value ? form.setErrors({}) : null);

  const {handleAppleLogin, handleGoogleLogin} = useSocialLoginsHandler();

  clearForm.current = () => {
    if (form.value) {
      form.setField('type', '');
      form.setField('value', '');
    } else {
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      clearFormErrors.current();
      return () => {
        clearForm.current();
        clearFormErrors.current();
      };
    }, []),
  );

  const handleChangeText = text => {
    clearFormErrors.current();
    let numberMatch = NUMBER_MATCH_REGEX.test(text.trim());
    if (!numberMatch) {
      form.setField('type', 'mobile_number');
      form.setField('value', text.trim());
    }
  };

  useEffect(() => {
    setPhoneNumberTo10Digit.current();
    showGreenTickCircleIcon.current();
  }, [form.value.value, form.value.type]);

  const handleRegisteredUserVerifyOTP = async () => {
    try {
      const requestOtpPayload = {
        type: form.value.type,
        value:
          form.value.type === 'mobile_number'
            ? '+91' + form.value.value
            : form?.value?.value,
      };

      await requestVerifyRegistration(requestOtpPayload);

      clearFormErrors.current();
      navigation.navigate('VerifyPhoneNumberDuringRegistration', {
        value:
          form.value.type === 'mobile_number'
            ? '+91' + form.value.value
            : form.value.value,
        type: form.value.type,
      });
    } catch (error) {
      setApiCallStatus('failed');
      if (error?.errors?.value[0] === 'Value should be unique') {
        form.setErrors({value: 'Already registered'});
      } else {
        form.setErrors(error);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      clearFormErrors.current();

      const payload = {
        type: form.value.type,
        value: form.value.value,
      };

      setApiCallStatus('loading');
      const response = await requestForLoginOTP(payload);
      if (response.message === 'Request for login with otp successfully') {
        clearFormErrors.current();

        navigation.navigate('Auth', {
          screen: 'SigninUsingOTP',
          params: {
            value:
              form.value.type === 'mobile_number'
                ? '+91' + form.value.value
                : form.value.value,
            type: form.value.type,
          },
        });
        setApiCallStatus('success');
      }
    } catch (error) {
      setApiCallStatus('failed');
      if (error?.errors?.value[0] === 'Please enter a value') {
        form.setErrors({value: 'Please enter valid phone number'});
      } else if (error?.message === 'AttributeNotVerified') {
        await handleRegisteredUserVerifyOTP();
      } else if (error?.message === 'AttributeNotRegistered') {
        form.setErrors({value: 'Phone number is not registered'});
      } else {
        form.setErrors(error);
      }
    }
  };

  return (
    <AuthWrapper showBackArrowIcon={navigation.canGoBack()}>
      <AuthHeading>Welcome Back!</AuthHeading>

      <View style={{paddingTop: 24}}>
        <BaseTextInput
          placeholder="Phone number"
          onChangeText={text => handleChangeText(text)}
          keyboardType="numeric"
          extraTextStyle={
            form.value.type === 'mobile_number'
              ? {paddingLeft: 50}
              : {paddingLeft: 24}
          }
          value={form.getField('value')}
          error={form.errors.get('value')}
          prefixComponent={() =>
            form.value.type === 'mobile_number' && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  left: 24,
                }}>
                <Text
                  style={{
                    color: '#212121',
                  }}>
                  +91
                </Text>
              </View>
            )
          }
          overlappingIcon={() =>
            (form.errors.get('value') && (
              <View style={{position: 'absolute', right: 13.24}}>
                <WarningIcon1 />
              </View>
            )) ||
            (showGreenCircleIcon && (
              <View style={{position: 'absolute', right: 13.24}}>
                <TickCircle />
              </View>
            ))
          }
        />
      </View>

      <View style={{paddingTop: 24}}>
        <BaseButton
          loading={apiCallStatus === 'loading'}
          onPress={() => {
            handleSignIn();
          }}
          disable={!showGreenCircleIcon}>
          Sign In
        </BaseButton>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 24,
        }}>
        <Separator />
        <Text style={{marginHorizontal: 8, color: theme.colors.bodyGray}}>
          or
        </Text>
        <Separator />
      </View>

      {Platform.OS === 'android' &&
      Config.ENABLE_APPLE_LOGIN_FOR_ANDROID === 'true' ? (
        <GoogleAppleButton
          type="row"
          onGoogleLogin={() => handleGoogleLogin()}
          onAppleLogin={() => handleAppleLogin()}
        />
      ) : (
        Platform.OS === 'android' && (
          <View style={{paddingTop: 24}}>
            <GoogleButton
              isSingleButton={true}
              onPress={() => handleGoogleLogin()}>
              Continue with Google
            </GoogleButton>
          </View>
        )
      )}

      {Platform.OS === 'ios' && (
        <GoogleAppleButton
          type="row"
          onGoogleLogin={() => handleGoogleLogin()}
          onAppleLogin={() => handleAppleLogin()}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 169,
        }}>
        <TextButton
          onPress={() =>
            navigation.navigate('Auth', {screen: 'SignupWithSocialProviders'})
          }>
          Create Account
        </TextButton>
      </View>
    </AuthWrapper>
  );
}
