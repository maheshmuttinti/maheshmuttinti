import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PermissionsWelcomeScreen from '../screens/Auth/Onboarding/PermissionsWelcomeScreen';
import PermissionsEmailSentScreen from '../screens/Auth/Onboarding/PermissionsEmailSentScreen';
import EnterPhoneNumber from '../screens/Auth/Signup/EnterPhoneNumber';
import AddEmailIdScreen from '../screens/Auth/Onboarding/AddEmailIdScreen';
import VerifyPhoneNumberDuringSocialAuthentication from '../screens/Auth/Signup/VerifyPhoneNumberDuringSocialAuthentication';
import CasEmailVerificationStatus from '../screens/UploadCAS/CasEmailVerificationStatus';

const Onboarding = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={PermissionsWelcomeScreen}>
      <Stack.Screen
        name="PermissionsWelcomeScreen"
        options={{headerShown: false}}
        component={PermissionsWelcomeScreen}
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
        name="AddEmailIdScreen"
        options={{headerShown: false}}
        component={AddEmailIdScreen}
      />

      <Stack.Screen
        name="CasEmailVerificationStatus"
        options={{headerShown: false}}
        component={CasEmailVerificationStatus}
      />
    </Stack.Navigator>
  );
};

export default Onboarding;
