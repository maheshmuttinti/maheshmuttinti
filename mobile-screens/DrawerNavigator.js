import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from './screens/Dashboard/Index';
import CustomSideBar from './reusables/CustomSideBar';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
const Drawer = createDrawerNavigator();

const getGestureEnabled = route => {
  const routeName = getFocusedRouteNameFromRoute(route) || 'Home';
  switch (routeName) {
    case 'Home':
      return true;
    default:
      return false;
  }
};
const DrawerNavigator = () => {
  const [isHomeScreen, setIsHomeScreen] = React.useState(false);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEdgeWidth: isHomeScreen ? 25 : 0,
        drawerStyle: {
          width: '90%',
        },
      }}
      drawerContent={props => <CustomSideBar {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={({route}) => {
          const isHomeTabScreen = getGestureEnabled(route);
          setIsHomeScreen(isHomeTabScreen);
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
