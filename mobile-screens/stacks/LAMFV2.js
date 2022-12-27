import * as React from 'react';
import {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoanAmountSelection from '../screens/LAMFV2/LoanAmountSelection/screen';
import ChooseNBFCSingle from '../screens/LAMFV2/NBFCs/screens/ChooseNBFCs/SingleNBFC';
import ChooseNBFCHorizontal from '../screens/LAMFV2/NBFCs/screens/ChooseNBFCs/HorizontalSelectionNBFCs';
import ChooseNBFCVertical from '../screens/LAMFV2/NBFCs/screens/ChooseNBFCs/VerticalSelectionNBFCs';
import CompareNBFCs from '../screens/LAMFV2/NBFCs/screens/CompareNBFCs';
import {useTheme} from 'theme';
import UpdatePortfolio from '../screens/NewCASFlow/screens/UpdatePortfolio';
import LoanDetailsForLienMarking from '../screens/LAMFV2/LienMarking/LoanDetails/screen';
import LienMarkingSteps from '../screens/LAMFV2/LienMarking/LienMarkingSteps/CombinedUpdateCASAndLienMarking';

const LAMFV2 = () => {
  const Stack = createStackNavigator();

  const theme = useTheme();

  useEffect(() => {
    console.log('*******Protected Stack Mounted****');
    return () => {
      console.log('*******Protected Stack UnMounted****');
    };
  }, []);
  return (
    <Stack.Navigator initialRouteName={LoanAmountSelection}>
      <Stack.Screen
        name="UpdatePortfolio"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={UpdatePortfolio}
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
      <Stack.Screen
        name="LoanDetailsForLienMarking"
        options={{headerShown: false}}
        component={LoanDetailsForLienMarking}
      />
      <Stack.Screen
        name="LienMarkingSteps"
        options={{headerShown: false}}
        component={LienMarkingSteps}
      />
    </Stack.Navigator>
  );
};

export default LAMFV2;
