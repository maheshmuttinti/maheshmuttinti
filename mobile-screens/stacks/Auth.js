import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignupWithEmailAndPhoneNumber from '../screens/Auth/SignupWithEmailAndPhoneNumber';
import EnterPhoneNumber from '../screens/Auth/SignupWithEmailAndPhoneNumber/EnterPhoneNumber';
import VerifyPhoneNumberDuringRegistration from '../screens/Auth/SignupWithEmailAndPhoneNumber/VerifyPhoneNumberDuringRegistration';
import SigninHome from '../screens/Auth/Signin';
import SigninUsingOTP from '../screens/Auth/Signin/VerifySiginUsingOTP';
import VerifyPhoneNumberDuringSocialAuthentication from '../screens/Auth/SignupWithEmailAndPhoneNumber/VerifyPhoneNumberDuringSocialAuthentication';
import SocialLoginRedirection from '../screens/Auth/SocialAuthentications/SocialLoginRedirection';
import SignupWithSocialProviders from '../screens/Auth/SignupWithSocialProviders';

const Auth = () => {
  const Stack = createStackNavigator();

  useEffect(() => {
    console.log('*******Auth Stack Mounted****');
    return () => {
      console.log('*******Auth Stack UnMounted****');
    };
  }, []);

  return (
    <Stack.Navigator initialRouteName={SignupWithSocialProviders}>
      <Stack.Screen
        name="SignupWithSocialProviders"
        options={{headerShown: false}}
        component={SignupWithSocialProviders}
      />
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
        name="SignupWithEmailAndPhoneNumber"
        options={{headerShown: false}}
        component={SignupWithEmailAndPhoneNumber}
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
    </Stack.Navigator>
  );
};

export default Auth;
