import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DevelopmentList from '../screens/Development';
import FetchCASFromRTAsForm from '../screens/Development/NewCASFlow/screens/FetchCASFromRTAs';
import CombinedUpdateCASAndLienMarking from '../screens/Development/NewCASFlow/screens/CombinedUpdateCASAndLienMarking';

const Development = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={DevelopmentList}>
      <Stack.Screen
        name="DevelopmentList"
        options={{headerShown: false}}
        component={DevelopmentList}
      />
      <Stack.Screen
        name="FetchCASFromRTAsForm"
        options={{headerShown: false}}
        component={FetchCASFromRTAsForm}
      />

      <Stack.Screen
        name="CombinedUpdateCASAndLienMarking"
        options={{headerShown: false}}
        component={CombinedUpdateCASAndLienMarking}
      />
    </Stack.Navigator>
  );
};

export default Development;
