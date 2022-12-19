import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenDeterminer from '../screens/Auth/ScreenDeterminer';
import EmailVerificationStatus from '../screens/EmailVerification';
import CheckEmailVerification from '../screens/EmailVerification/CheckEmailVerification';

const General = () => {
  const Stack = createStackNavigator();

  useEffect(() => {
    console.log('*******General Stack Mounted****');
    return () => {
      console.log('*******General Stack UnMounted****');
    };
  }, []);

  return (
    <Stack.Navigator initialRouteName={ScreenDeterminer}>
      <Stack.Screen
        name="ScreenDeterminer"
        options={{headerShown: false}}
        component={ScreenDeterminer}
      />
      <Stack.Screen
        name="CheckEmailVerification"
        options={{headerShown: false}}
        component={CheckEmailVerification}
      />
      <Stack.Screen
        name="EmailVerificationStatus"
        options={{headerShown: false}}
        component={EmailVerificationStatus}
      />
    </Stack.Navigator>
  );
};

export default General;
