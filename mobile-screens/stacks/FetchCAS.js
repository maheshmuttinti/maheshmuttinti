import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FetchCASFromRTAs from '../screens/NewCASFlow/screens/FetchCASFromRTAs';

const FetchCAS = () => {
  const Stack = createStackNavigator();

  useEffect(() => {
    console.log('*******FetchCAS Stack Mounted****');
    return () => {
      console.log('*******FetchCAS Stack UnMounted****');
    };
  }, []);

  return (
    <Stack.Navigator initialRouteName={FetchCASFromRTAs}>
      <Stack.Screen
        name="FetchCASFromRTAs"
        options={{headerShown: false}}
        component={FetchCASFromRTAs}
      />
    </Stack.Navigator>
  );
};

export default FetchCAS;
