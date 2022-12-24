import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DevelopmentList from '../screens/Development';
import LoanAmountSelection from '../screens/Development/LoanAmountSelection/screen';
// import ChooseNBFCSingle from '../screens/Development/NBFCs/screens/SingleNBFC';
// import ChooseNBFCHorizontal from '../screens/Development/NBFCs/screens/SingleNBFC';
// import ChooseNBFCVertical from '../screens/Development/NBFCs/screens/SingleNBFC';

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
        name="LoanAmountSelection"
        options={{headerShown: false}}
        component={LoanAmountSelection}
      />
    </Stack.Navigator>
  );
};

export default Development;
