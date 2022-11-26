import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity} from 'react-native';
import {
  AdvisorTabIcon,
  Home,
  ProfileTabIcon,
  ReportsTabIcon,
  HomeFilled,
  ProfileTabFilledIcon,
} from 'assets';
import {useTheme} from 'theme';
import Profile from './screens/Profile';
import Reports from './screens/Reports';
import Advisor from './screens/Advisor';

export default function ({HomeScreen}) {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();

  const CustomTabButton = props => (
    <TouchableOpacity
      {...props}
      style={
        props.accessibilityState.selected
          ? [
              props.style,
              {
                paddingTop: 13,
                borderTopColor: theme.colors.primaryOrange,
                borderTopWidth: 4,
                borderTopEndRadius: 35,
                borderTopStartRadius: 35,
                borderRightColor: '#fff',
              },
            ]
          : [
              props.style,
              {
                paddingTop: 13,
                borderTopColor: 'transparent',
                borderTopWidth: 2,
              },
            ]
      }
    />
  );
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          switch (route.name) {
            case 'Home':
              return focused ? <HomeFilled /> : <Home />;
            case 'Reports':
              return <ReportsTabIcon />;
            case 'Advisior':
              return <AdvisorTabIcon />;
            case 'Profile':
              return focused ? <ProfileTabFilledIcon /> : <ProfileTabIcon />;
            default:
              return focused ? <HomeFilled /> : <Home />;
          }
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          borderRadius: 14,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
          shadowOffset: {width: 2, height: 16},
          shadowRadius: 10,
          elevation: 5,
          height: 70,
          borderColor: theme.colors.primaryBlue,
          fontSize: 200,
          paddingBottom: 11,
        },
        tabBarLabelStyle: {
          paddingTop: 2,
          paddingBottom: 2,
          fontSize: 10,
        },
        tabBarActiveTintColor: theme.colors.primaryOrange,
        tabBarInactiveTintColor: theme.colors.text,
      })}
      initialRouteName={'Home'}
      backBehavior="initialRoute">
      <Tab.Screen
        options={{headerShown: false, tabBarButton: CustomTabButton}}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{headerShown: false, tabBarButton: CustomTabButton}}
        name="Reports"
        component={Reports}
      />
      <Tab.Screen
        options={{headerShown: false, tabBarButton: CustomTabButton}}
        name="Advisor"
        component={Advisor}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarButton: CustomTabButton,
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}
