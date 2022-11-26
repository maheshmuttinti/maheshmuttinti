import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from './screens/Dashboard/Index';
import CustomSideBar from './reusables/CustomSideBar';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '90%',
        },
      }}
      drawerContent={props => <CustomSideBar {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
