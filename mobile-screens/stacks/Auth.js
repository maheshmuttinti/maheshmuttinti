import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenDeterminor from '../screens/Auth/ScreenDeterminor';
import IntroScreen from '../screens/Auth/IntroScreen';
import SignupHome from '../screens/Auth/Signup';
import VerifyPhoneNumberDuringRegistration from '../screens/Auth/Signup/VerifyPhoneNumberDuringRegistration';
import SigninHome from '../screens/Auth/Signin';
import SigninUsingOTP from '../screens/Auth/Signin/VerifySiginUsingOTP';
import GmailAuthorizeStatus from '../screens/Auth/Onboarding/GmailAuthorizeStatus';
import SetPINHome from '../screens/Auth/SetPIN';
import ConfirmPIN from '../screens/Auth/SetPIN/ConfirmPIN';
import EnterPINHome from '../screens/Auth/EnterPIN';
import ResetPINHome from '../screens/Auth/ResetPIN';
import ConfirmResetPIN from '../screens/Auth/ResetPIN/ConfirmResetPIN';
import VerifyOTPForResetPIN from '../screens/Auth/ResetPIN/VerifyOTPForResetPIN';
import PermissionsWelcomeScreen from '../screens/Auth/Onboarding/PermissionsWelcomeScreen';
import PermissionsEmailSentScreen from '../screens/Auth/Onboarding/PermissionsEmailSentScreen';
import EnterDobScreen from '../screens/Auth/Onboarding/EnterDobScreen';
import EnterPhoneNumber from '../screens/Auth/Signup/EnterPhoneNumber';
import AddEmailIdScreen from '../screens/Auth/Onboarding/AddEmailIdScreen';
import VerifyPhoneNumberDuringSocialAuthentication from '../screens/Auth/Signup/VerifyPhoneNumberDuringSocialAuthentication';
import SocialLoginRedirection from '../screens/Auth/SocialAuthentications/SocialLoginRedirection';
import EmailActivationLinkScreen from '../screens/VerifyEmailLink';
import CasEmailVerificationStatus from '../screens/UploadCAS/CasEmailVerificationStatus';

const Auth = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={ScreenDeterminor}>
      <Stack.Screen
        name="ScreenDeterminor"
        options={{headerShown: false}}
        component={ScreenDeterminor}
      />

      <Stack.Screen
        name="IntroScreen"
        options={{headerShown: false}}
        component={IntroScreen}
      />
      <Stack.Screen
        name="ConfirmPIN"
        options={{headerShown: false}}
        component={ConfirmPIN}
      />
      <Stack.Screen
        name="EnterDobScreen"
        options={{headerShown: false}}
        component={EnterDobScreen}
      />
      <Stack.Screen
        name="VerifyPhoneNumberDuringRegistration"
        options={{headerShown: false}}
        component={VerifyPhoneNumberDuringRegistration}
      />
      <Stack.Screen
        name="EnterPINHome"
        options={{headerShown: false}}
        component={EnterPINHome}
      />
      <Stack.Screen
        name="PermissionsEmailSentScreen"
        options={{headerShown: false}}
        component={PermissionsEmailSentScreen}
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
        name="PermissionsWelcomeScreen"
        options={{headerShown: false}}
        component={PermissionsWelcomeScreen}
      />
      <Stack.Screen
        name="AddEmailIdScreen"
        options={{headerShown: false}}
        component={AddEmailIdScreen}
      />
      <Stack.Screen
        name="SetPINHome"
        options={{headerShown: false}}
        component={SetPINHome}
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
        name="ResetPINHome"
        options={{headerShown: false}}
        component={ResetPINHome}
      />
      <Stack.Screen
        name="ConfirmResetPIN"
        options={{headerShown: false}}
        component={ConfirmResetPIN}
      />
      <Stack.Screen
        name="VerifyOTPForResetPIN"
        options={{headerShown: false}}
        component={VerifyOTPForResetPIN}
      />
      <Stack.Screen
        name="GmailAuthorizeStatus"
        options={{headerShown: false}}
        component={GmailAuthorizeStatus}
      />
      <Stack.Screen
        name="EmailActivationLinkScreen"
        options={{headerShown: false}}
        component={EmailActivationLinkScreen}
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
