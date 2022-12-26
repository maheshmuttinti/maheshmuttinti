import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from '../DrawerNavigator';
import {useTheme} from 'theme';
import LAMFV2 from './LAMFV2';

const Protected = () => {
  const Stack = createStackNavigator();
  const theme = useTheme();

  useEffect(() => {
    console.log('*******Protected Stack Mounted****');
    return () => {
      console.log('*******Protected Stack UnMounted****');
    };
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.backgroundBlue,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: 'blue',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName={'Drawer'}>
      <Stack.Screen
        name="Drawer"
        options={{headerShown: false}}
        component={Dashboard}
      />
      <Stack.Screen
        name="LAMFV2"
        options={{headerShown: false}}
        component={LAMFV2}
      />
    </Stack.Navigator>
  );
};

export default Protected;
