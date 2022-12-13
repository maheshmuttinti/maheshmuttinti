import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CollectPAN from '../screens/Development/NewCASFlow/screens/CollectPAN';

const PANSetup = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={CollectPAN}>
      <Stack.Screen
        name="CollectPAN"
        options={{headerShown: false}}
        component={CollectPAN}
      />
    </Stack.Navigator>
  );
};

export default PANSetup;
