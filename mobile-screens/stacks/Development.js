import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DevelopmentList from '../screens/Development';
import LoanAmountSelection from '../screens/Development/LoanAmountSelection/screen';
import ChooseNBFCSingle from '../screens/Development/NBFCs/screens/ChooseNBFCs/SingleNBFC';
import ChooseNBFCHorizontal from '../screens/Development/NBFCs/screens/ChooseNBFCs/HorizontalSelectionNBFCs';
import ChooseNBFCVertical from '../screens/Development/NBFCs/screens/ChooseNBFCs/VerticalSelectionNBFCs';
import CompareNBFCs from '../screens/Development/NBFCs/screens/CompareNBFCs';

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
      <Stack.Screen
        name="ChooseNBFCSingle"
        options={{headerShown: false}}
        component={ChooseNBFCSingle}
      />
      <Stack.Screen
        name="ChooseNBFCHorizontal"
        options={{headerShown: false}}
        component={ChooseNBFCHorizontal}
      />
      <Stack.Screen
        name="ChooseNBFCVertical"
        options={{headerShown: false}}
        component={ChooseNBFCVertical}
      />
      <Stack.Screen
        name="CompareNBFCs"
        options={{headerShown: false}}
        component={CompareNBFCs}
      />
    </Stack.Navigator>
  );
};

export default Development;
