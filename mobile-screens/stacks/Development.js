import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DevelopmentList from '../screens/Development';
import FetchCASFromRTAsForm from '../screens/Development/NewCASFlow/screens/FetchCASFromRTAs';
import CombinedUpdateCASAndLienMarking from '../screens/Development/NewCASFlow/screens/CombinedUpdateCASAndLienMarking';
import UpdatePortfolio from '../screens/Development/NewCASFlow/screens/UpdatePortfolio';
import CollectPAN from '../screens/Development/NewCASFlow/screens/CollectPAN';
import {useTheme} from 'theme';

const Development = () => {
  const theme = useTheme();
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={DevelopmentList}>
      <Stack.Screen
        name="DevelopmentList"
        options={{headerShown: false}}
        component={DevelopmentList}
      />
      <Stack.Screen
        name="CollectPAN"
        options={{headerShown: false}}
        component={CollectPAN}
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
    </Stack.Navigator>
  );
};

export default Development;
