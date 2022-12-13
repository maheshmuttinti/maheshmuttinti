import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SetPINHome from '../screens/Auth/SetPIN';
import ConfirmPIN from '../screens/Auth/SetPIN/ConfirmPIN';
import EnterPINHome from '../screens/Auth/EnterPIN';
import ResetPINHome from '../screens/Auth/ResetPIN';
import ConfirmResetPIN from '../screens/Auth/ResetPIN/ConfirmResetPIN';
import VerifyOTPForResetPIN from '../screens/Auth/ResetPIN/VerifyOTPForResetPIN';

const PINSetup = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={SetPINHome}>
      <Stack.Screen
        name="ConfirmPIN"
        options={{headerShown: false}}
        component={ConfirmPIN}
      />

      <Stack.Screen
        name="EnterPINHome"
        options={{headerShown: false}}
        component={EnterPINHome}
      />

      <Stack.Screen
        name="SetPINHome"
        options={{headerShown: false}}
        component={SetPINHome}
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
    </Stack.Navigator>
  );
};

export default PINSetup;
