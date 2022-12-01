import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RTAsPortfoliosFetchScreen from '../screens/Development';

const Development = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={RTAsPortfoliosFetchScreen}>
      <Stack.Screen
        name="RTAsPortfoliosFetchScreen"
        options={{headerShown: false}}
        component={RTAsPortfoliosFetchScreen}
      />
    </Stack.Navigator>
  );
};

export default Development;
