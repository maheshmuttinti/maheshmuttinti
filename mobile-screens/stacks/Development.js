import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RTAsPortfoliosFetchScreen from '../screens/Development';
// import {OTPVerification as CAMSOTPVerification} from '../screens/Development/CAMSVerification/OTPVerification';

const Development = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={RTAsPortfoliosFetchScreen}>
      <Stack.Screen
        name="RTAsPortfoliosFetchScreen"
        options={{headerShown: false}}
        component={RTAsPortfoliosFetchScreen}
      />
      {/* <Stack.Screen
        name="CAMSOTPVerification"
        options={{headerShown: false}}
        component={CAMSOTPVerification}
      /> */}
    </Stack.Navigator>
  );
};

export default Development;
