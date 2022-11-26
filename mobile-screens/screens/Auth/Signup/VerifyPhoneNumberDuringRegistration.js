/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {GrayBodyText, AuthHeading, CustomOtpInput} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapper';
import useBetaForm from '@reusejs/react-form-hook';
import {
  verifyRegistration,
  login,
  requestVerifyRegistration,
  updateUserProfile,
  getUser,
  addCASEmail,
} from 'services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setTokens} from 'store';
import BackgroundTimer from '../../../reusables/BackgroundTimer';
import {useTheme} from 'theme';
import {getUserPassword, prettifyJSON, showToast} from 'utils';

export default function ({route, navigation}) {
  const value = route?.params?.value;
  const type = route?.params?.type;
  const casEmail = route?.params?.casEmail;
  const dispatch = useDispatch();
  const theme = useTheme();

  console.log('casEmail', casEmail);

  const handleUpdateUserProfile = async () => {
    try {
      const user = await getUser();
      console.log('verifySignupUsingOtp - user', JSON.stringify(user, null, 2));

      let usernameType = null;
      if (type === 'email') {
        usernameType = 'non_gmail';
      }
      if (type === 'mobile_number') {
        usernameType = 'mobile_number';
      }
      const meta = {
        meta: {...user?.profile?.meta, username_type: usernameType},
      };

      const updateProfilePayload = {
        ...meta,
      };
      const updateProfileResponse = await updateUserProfile(
        updateProfilePayload,
      );

      await handleAddCASEmail();
      if (updateProfileResponse) {
        navigation.replace('Auth', {
          screen: 'ScreenDeterminor',
        });
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const form = useBetaForm({
    type: type,
    value: value,
    token: '',
  });

  useEffect(() => {
    if (form.value.token.length === 6) {
      handleVerifyOTP();
    }
  }, [form.value.token]);

  const handleVerifyOTP = async () => {
    try {
      const payload = {
        type: form.value.type,
        value: form.value.value,
        token: form.value.token,
      };

      const response = await verifyRegistration(payload);

      if (response?.message === 'Verification Successful') {
        form.setErrors({});

        await loginUserAfterVerification();
      }
    } catch (error) {
      console.log('error while verifying otp', prettifyJSON(error));
      if (error?.message === 'Invalid Token') {
        form.setErrors({token: 'Please enter a valid code.'});
      } else {
        form.setErrors(error);
      }
    }
  };

  const handleAddCASEmail = async () => {
    try {
      const addCASEmailPayload = {
        email: casEmail,
        email_type: 'non_gmail',
      };

      console.log('addCASEmailPayload', addCASEmailPayload);

      await addCASEmail(addCASEmailPayload);
    } catch (error) {
      showToast(
        "Something went wrong while adding CAS Email, Can't Request CAS Statement with email that you have entered",
      );
      console.log('error', error);
      return error;
    }
  };

  const loginUserAfterVerification = async () => {
    try {
      const loginPayload = {
        type: form.value.type,
        value: form.value.value,
        password: await getUserPassword(form.value.value),
      };

      console.log('loginPayload-1234', loginPayload);

      const loginResponse = await login(loginPayload);

      if (loginResponse) {
        await AsyncStorage.setItem(
          '@access_token',
          JSON.stringify({
            accessToken: loginResponse?.access_token,
          }),
        );
        dispatch(setTokens(loginResponse));
        await AsyncStorage.setItem('@loggedin_status', JSON.stringify(true));
        await handleUpdateUserProfile();
      }
    } catch (error) {
      console.log('loginUserAfterVerification-error', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const resendPayload = {
        type: form.value.type,
        value: form.value.value,
      };
      console.log('resendPayload', resendPayload);
      await requestVerifyRegistration(resendPayload);
    } catch (error) {
      console.log('error', error.response.data);
    }
  };

  return (
    <AuthWrapper>
      <AuthHeading>Phone Verification</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>{`FinEzzy has sent SMS with a verification code to ${value}`}</GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <CustomOtpInput
          defaultValue={''}
          onChangeText={text => form.setField('token', text)}
          value={form.getField('token')}
          error={form.errors.get('token')}
          textInputStyles={
            form.errors.get('token')
              ? {
                  borderColor: theme.colors.error,
                  backgroundColor: theme.colors.greyscale50,
                }
              : {
                  backgroundColor: theme.colors.greyscale50,
                  borderColor: 'transparent',
                }
          }
          tintColor={
            form.errors.get('token')
              ? theme.colors.error
              : theme.colors.primaryBlue
          }
          left={-21}
          scale={0.9}
          inputCount={6}
          secureTextEntry={false}
        />
      </View>

      <BackgroundTimer
        wrapperStyles={{paddingTop: 32}}
        callBack={() => handleResendOTP()}
      />
    </AuthWrapper>
  );
}
