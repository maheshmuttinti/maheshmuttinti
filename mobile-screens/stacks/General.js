import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenDeterminer from '../screens/Auth/ScreenDeterminer';
import EmailActivationLinkScreen from '../screens/VerifyEmailLink';
import CasEmailVerificationStatus from '../screens/UploadCAS/CasEmailVerificationStatus';

const General = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={ScreenDeterminer}>
      <Stack.Screen
        name="ScreenDeterminer"
        options={{headerShown: false}}
        component={ScreenDeterminer}
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

export default General;
