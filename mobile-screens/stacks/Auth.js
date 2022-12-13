import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignupHome from '../screens/Auth/Signup';
import VerifyPhoneNumberDuringRegistration from '../screens/Auth/Signup/VerifyPhoneNumberDuringRegistration';
import SigninHome from '../screens/Auth/Signin';
import SigninUsingOTP from '../screens/Auth/Signin/VerifySiginUsingOTP';
import EnterPhoneNumber from '../screens/Auth/Signup/EnterPhoneNumber';
import VerifyPhoneNumberDuringSocialAuthentication from '../screens/Auth/Signup/VerifyPhoneNumberDuringSocialAuthentication';
import SocialLoginRedirection from '../screens/Auth/SocialAuthentications/SocialLoginRedirection';
import CasEmailVerificationStatus from '../screens/UploadCAS/CasEmailVerificationStatus';

const Auth = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={SignupHome}>
      <Stack.Screen
        name="VerifyPhoneNumberDuringRegistration"
        options={{headerShown: false}}
        component={VerifyPhoneNumberDuringRegistration}
      />

      <Stack.Screen
        name="EnterPhoneNumber"
        options={{headerShown: false}}
        component={EnterPhoneNumber}
      />
      <Stack.Screen
        name="VerifyPhoneNumberDuringSocialAuthentication"
        options={{headerShown: false}}
        component={VerifyPhoneNumberDuringSocialAuthentication}
      />

      <Stack.Screen
        name="SigninHome"
        options={{headerShown: false}}
        component={SigninHome}
      />
      <Stack.Screen
        name="SignupHome"
        options={{headerShown: false}}
        component={SignupHome}
      />

      <Stack.Screen
        name="SigninUsingOTP"
        options={{headerShown: false}}
        component={SigninUsingOTP}
      />
      <Stack.Screen
        name="SocialLoginRedirection"
        options={{headerShown: false}}
        component={SocialLoginRedirection}
      />

      <Stack.Screen
        name="CasEmailVerificationStatus"
        options={{headerShown: false}}
        component={CasEmailVerificationStatus}
      />
    </Stack.Navigator>
  );
};

export default Auth;
