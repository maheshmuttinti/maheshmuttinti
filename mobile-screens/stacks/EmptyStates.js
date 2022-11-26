import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NoInternet from '../screens/EmptyStates/NoInternet';
import NotFound404Screen from '../screens/EmptyStates/NotFound404Screen';
import EmptyCart from '../screens/EmptyStates/EmptyCart';

const Auth = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={NoInternet}>
      <Stack.Screen
        name="NoInternet"
        options={{headerShown: false}}
        component={NoInternet}
      />
      <Stack.Screen
        name="NotFound404Screen"
        options={{headerShown: false}}
        component={NotFound404Screen}
      />
      <Stack.Screen
        name="EmptyCart"
        options={{headerShown: false}}
        component={EmptyCart}
      />
    </Stack.Navigator>
  );
};

export default Auth;
